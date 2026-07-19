import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, ExamType, defaultUserProfile } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Monitor auth state changes on mount
  useEffect(() => {
    const savedGuestUser = localStorage.getItem('ninthgrade_guest_user');
    const savedGuestProfile = localStorage.getItem('ninthgrade_guest_profile');

    if (savedGuestUser && savedGuestProfile) {
      try {
        setUser(JSON.parse(savedGuestUser) as unknown as User);
        setProfile(JSON.parse(savedGuestProfile) as UserProfile);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Error reading saved guest session: ", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const activeGuest = localStorage.getItem('ninthgrade_guest_user');
      if (activeGuest) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user Profile in firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const pathStr = `users/${currentUser.uid}`;
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setProfile(userDocSnap.data() as UserProfile);
          } else {
            // Profile does not exist yet. Initialize it with authenticated user name.
            const initialProfile: UserProfile = {
              ...defaultUserProfile,
              name: currentUser.displayName || defaultUserProfile.name,
              phone: currentUser.phoneNumber || defaultUserProfile.phone
            };
            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, pathStr);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCredential.user;
      
      // Update firebase user profile template display name
      await firebaseUpdateProfile(createdUser, { displayName: name });
      
      const newProfile: UserProfile = {
        ...defaultUserProfile,
        name: name,
        phone: ""
      };

      // Set inside Firestore
      const userDocRef = doc(db, 'users', createdUser.uid);
      const pathStr = `users/${createdUser.uid}`;
      try {
        await setDoc(userDocRef, newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, pathStr);
      }

      setProfile(newProfile);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInAsGuest = async (guestName: string) => {
    setLoading(true);
    const resolvedGuestName = guestName.trim() || 'Farhan Kabir (Guest)';
    const mockUserItem = {
      uid: 'demo-guest-uid',
      email: 'guest@farhankabir.dev',
      displayName: resolvedGuestName,
      emailVerified: true,
      isAnonymous: false,
      phoneNumber: '',
      providerId: 'custom',
    };
    const mockProfileItem: UserProfile = {
      ...defaultUserProfile,
      name: resolvedGuestName
    };
    localStorage.setItem('ninthgrade_guest_user', JSON.stringify(mockUserItem));
    localStorage.setItem('ninthgrade_guest_profile', JSON.stringify(mockProfileItem));
    setUser(mockUserItem as unknown as User);
    setProfile(mockProfileItem);
    setLoading(false);
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('ninthgrade_guest_user');
      localStorage.removeItem('ninthgrade_guest_profile');
      await signOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateUserProfile = async (newProfile: Partial<UserProfile>) => {
    const activeGuest = localStorage.getItem('ninthgrade_guest_user');
    const isMockUser = activeGuest || user?.uid === 'demo-guest-uid';

    const updatedProfile = {
      ...(profile || defaultUserProfile),
      ...newProfile
    };

    if (isMockUser) {
      setProfile(updatedProfile);
      localStorage.setItem('ninthgrade_guest_profile', JSON.stringify(updatedProfile));
      return;
    }

    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const pathStr = `users/${user.uid}`;

    try {
      await setDoc(userDocRef, updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, pathStr);
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
