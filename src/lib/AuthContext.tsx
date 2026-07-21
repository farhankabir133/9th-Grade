import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, User as SupabaseUser } from "@supabase/supabase-js";
import { supabaseAsUser } from "../../config/supabase";
import { UserProfile, defaultUserProfile } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: SupabaseErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUpEmail: (email: string, password: string, name: string) => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInAsGuest: (name: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const savedGuestUser = localStorage.getItem('ninthgrade_guest_user');
    const savedGuestProfile = localStorage.getItem('ninthgrade_guest_profile');

    if (savedGuestUser && savedGuestProfile) {
      try {
        setUser(JSON.parse(savedGuestUser));
        setProfile(JSON.parse(savedGuestProfile));
        setLoading(false);
        return;
      } catch (e) {
        console.error("Error reading saved guest session: ", e);
      }
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const activeGuest = localStorage.getItem('ninthgrade_guest_user');
      if (activeGuest) {
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        loadProfile(session.user.id, session.access_token);
      } else {
        setUser(null);
        setProfile(null);
        setAccessToken(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string, token: string) => {
    try {
      const supabase = supabaseAsUser(token);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          email: '',
          phone: data.phone || '',
          examType: data.exam_type,
          targetYear: data.target_year,
          streak: data.streak,
          xp: data.xp,
          level: data.level,
          learningStyle: data.learning_style || 'visual',
          readinessScore: data.readiness_score,
          predictedRank: data.predicted_rank,
          totalStudents: data.total_students,
          passingProbability: data.passing_probability,
          consistencyScore: data.consistency_score,
          district: data.district,
          archetype: data.archetype,
        });
      } else {
        const initialProfile: UserProfile = {
          id: userId,
          name: '',
          email: '',
          phone: '',
          examType: 'BCS',
          targetYear: 2027,
          streak: 0,
          xp: 0,
          level: 1,
          learningStyle: 'visual',
          readinessScore: 0,
          predictedRank: 0,
          totalStudents: 0,
          passingProbability: 0,
          consistencyScore: 0,
          district: '',
          archetype: '',
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: initialProfile.name,
            phone: initialProfile.phone,
            exam_type: initialProfile.examType,
            target_year: initialProfile.targetYear,
            streak: initialProfile.streak,
            xp: initialProfile.xp,
            level: initialProfile.level,
            learning_style: initialProfile.learningStyle,
            readiness_score: initialProfile.readinessScore,
            predicted_rank: initialProfile.predictedRank,
            total_students: initialProfile.totalStudents,
            passing_probability: initialProfile.passingProbability,
            consistency_score: initialProfile.consistencyScore,
            district: initialProfile.district,
            archetype: initialProfile.archetype,
          });

        if (insertError) throw insertError;
        setProfile(initialProfile);
      }
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, `profiles/${userId}`);
    } finally {
      setLoading(false);
    }
  };

  const signUpEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;

      if (data.user && data.session) {
        setUser(data.user);
        setAccessToken(data.session.access_token);
        await loadProfile(data.user.id, data.session.access_token);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        setUser(data.user);
        setAccessToken(data.session.access_token);
        await loadProfile(data.user.id, data.session.access_token);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInAsGuest = async (guestName: string) => {
    setLoading(true);
    const resolvedGuestName = guestName.trim() || 'Farhan Kabir (Guest)';

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.auth.signUp({
        email: `guest-${Date.now()}@local.dev`,
        password: Math.random().toString(36).slice(2),
        options: {
          data: { name: resolvedGuestName, isGuest: true }
        }
      });

      if (error) throw error;

      if (data.user && data.session) {
        const mockUserItem = {
          uid: data.user.id,
          email: data.user.email ?? 'guest@local.dev',
          displayName: resolvedGuestName,
          emailVerified: true,
          isAnonymous: true,
          phoneNumber: '',
          providerId: 'guest',
        };

        const mockProfileItem: UserProfile = {
          id: data.user.id,
          name: resolvedGuestName,
          email: data.user.email ?? '',
          phone: '',
          examType: 'BCS',
          targetYear: 2027,
          streak: 0,
          xp: 0,
          level: 1,
          learningStyle: 'visual',
          readinessScore: 0,
          predictedRank: 0,
          totalStudents: 0,
          passingProbability: 0,
          consistencyScore: 0,
          district: '',
          archetype: '',
        };

        localStorage.setItem('ninthgrade_guest_user', JSON.stringify(mockUserItem));
        localStorage.setItem('ninthgrade_guest_profile', JSON.stringify(mockProfileItem));
        setUser(mockUserItem as unknown as SupabaseUser);
        setProfile(mockProfileItem);
        setAccessToken(data.session.access_token);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('ninthgrade_guest_user');
      localStorage.removeItem('ninthgrade_guest_profile');

      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );

      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateUserProfile = async (newProfile: Partial<UserProfile>) => {
    const activeGuest = localStorage.getItem('ninthgrade_guest_user');
    const isMockUser = activeGuest || user?.user_metadata?.isGuest;

    const updatedProfile = {
      ...(profile || defaultUserProfile),
      ...newProfile
    };

    if (isMockUser) {
      setProfile(updatedProfile);
      localStorage.setItem('ninthgrade_guest_profile', JSON.stringify(updatedProfile));
      return;
    }

    if (!user || !accessToken) return;

    const supabase = supabaseAsUser(accessToken);
    const pathStr = `profiles/${user.id}`;

    try {
      const updateData: Record<string, any> = {};
      if (newProfile.name !== undefined) updateData.name = newProfile.name;
      if (newProfile.phone !== undefined) updateData.phone = newProfile.phone;
      if (newProfile.examType !== undefined) updateData.exam_type = newProfile.examType;
      if (newProfile.targetYear !== undefined) updateData.target_year = newProfile.targetYear;
      if (newProfile.streak !== undefined) updateData.streak = newProfile.streak;
      if (newProfile.xp !== undefined) updateData.xp = newProfile.xp;
      if (newProfile.level !== undefined) updateData.level = newProfile.level;
      if (newProfile.learningStyle !== undefined) updateData.learning_style = newProfile.learningStyle;
      if (newProfile.readinessScore !== undefined) updateData.readiness_score = newProfile.readinessScore;
      if (newProfile.predictedRank !== undefined) updateData.predicted_rank = newProfile.predictedRank;
      if (newProfile.totalStudents !== undefined) updateData.total_students = newProfile.totalStudents;
      if (newProfile.passingProbability !== undefined) updateData.passing_probability = newProfile.passingProbability;
      if (newProfile.consistencyScore !== undefined) updateData.consistency_score = newProfile.consistencyScore;
      if (newProfile.district !== undefined) updateData.district = newProfile.district;
      if (newProfile.archetype !== undefined) updateData.archetype = newProfile.archetype;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      setProfile(updatedProfile);
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, pathStr);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUpEmail,
    signInEmail,
    signInGoogle,
    signInAsGuest,
    signOutUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
