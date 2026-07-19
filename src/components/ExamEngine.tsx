import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, Clock, AlertTriangle, Play, Pause, Bookmark, 
  HelpCircle, CheckCircle2, ChevronRight, BookOpen, RefreshCw, EyeOff, Search,
  Compass, Sliders, ChevronDown, Check, Layout, AlertCircle, BarChart2, Shield,
  Layers, Database, Terminal, Settings, LogOut, CheckSquare,
  History, FileDown, Share2, FileText, Trash2, ExternalLink, Globe
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Question, ExamSession } from '../types';

interface ExamMode {
  type: 'BCS' | 'Bank' | 'Custom';
  role?: string; // For BB eg "Assistant Director (AD)", "Senior Officer"
}

interface ExamEngineProps {
  examType: string;
  selectedExamMode?: ExamMode;
  onExamCompleted: (results: NonNullable<ExamSession['results']>) => void;
  onTriggerTutor: (subject: string, topic: string) => void;
}

// Full BCS 10-domain detailed syllabus with rich, complete topics
const bcsSyllabus = [
  {
    name: "১. বাংলা ভাষা ও সাহিত্য",
    marks: 35,
    color: "from-cyan-500 to-blue-500",
    topics: [
      { name: "প্রয়োগ-অপপ্রয়োগ, বানান ও বাক্য শুদ্ধি", bcsNo: "ভাষা (১৫ নম্বর): প্রয়োগ-অপপ্রয়োগ, বানান ও বাক্য শুদ্ধি", mastery: 82, trend: "+4%" },
      { name: "পরিভাষা, সমার্থক ও বিপরীতার্থক শব্দ", bcsNo: "ভাষা (১৫ নম্বর): পরিভাষা, সমার্থক ও বিপরীতার্থক শব্দ", mastery: 75, trend: "+2%" },
      { name: "ধ্বনি, বর্ণ ও শব্দ", bcsNo: "ভাষা (১৫ নম্বর): ধ্বনি, বর্ণ, শব্দ", mastery: 80, trend: "+3%" },
      { name: "পদ ও বাক্য", bcsNo: "ভাষা (১৫ নম্বর): পদ, বাক্য", mastery: 78, trend: "+5%" },
      { name: "প্রত্যয়, সন্ধি ও সমাস", bcsNo: "ভাষা (১৫ নম্বর): প্রত্যয়, সন্ধি ও সমাস", mastery: 71, trend: "+1%" },
      { name: "ক. প্রাচীন ও মধ্যযুগ (সাহিত্য)", bcsNo: "সাহিত্য (১৫ নম্বর): ক. প্রাচীন ও মধ্যযুগ (০৫ নম্বর)", mastery: 70, trend: "+12%" },
      { name: "খ. আধুনিক যুগ (১৮০০-বর্তমান পর্যন্ত) (সাহিত্য)", bcsNo: "সাহিত্য (১৫ নম্বর): খ. আধুনিক যুগ (১৮০০-বর্তমান পর্যন্ত) (১০ নম্বর)", mastery: 65, trend: "+0%" }
    ]
  },
  {
    name: "২. English Language & Literature",
    marks: 35,
    color: "from-blue-500 to-indigo-500",
    topics: [
      { name: "A. Parts of Speech: Noun & Pronoun", bcsNo: "Language: Parts of Speech: The Noun (Determiner, Gender, Number); The Pronoun", mastery: 78, trend: "+5%" },
      { name: "A. Parts of Speech: The Verb & Modals", bcsNo: "Language: Parts of Speech: The Verb (Finite, Non-finite, Linking, Phrasal, Modals)", mastery: 71, trend: "+3%" },
      { name: "A. Parts of Speech: Adjective, Adverb, Preposition & Conjunction", bcsNo: "Language: Parts of Speech: The Adjective, Adverb, Preposition, Conjunction", mastery: 74, trend: "+4%" },
      { name: "B. Idioms & Phrases", bcsNo: "Language: Meanings of Phrases, Kinds of Phrases, Identifying Phrases.", mastery: 58, trend: "+10%" },
      { name: "C. Clauses", bcsNo: "Language: The Principal Clause, The Subordinate Clause (Noun, Adjective, Adverbial & its types).", mastery: 70, trend: "+8%" },
      { name: "D. Corrections", bcsNo: "Language: Corrections (The Tense, Verb, Preposition, Determiner, Gender, Number, Subject-Verb Agreement)", mastery: 42, trend: "-6%" },
      { name: "E. Sentences & Transformations", bcsNo: "Language: Sentences and transformations (Simple, Compound, Complex, Active/Passive Voice, Degrees)", mastery: 72, trend: "+6%" },
      { name: "F. Words: Meanings, Synonyms & Antonyms", bcsNo: "Language: Words: Meanings, Synonyms, Antonyms", mastery: 48, trend: "-4%" },
      { name: "F. Words: Spellings & Formations", bcsNo: "Language: Words: Spellings, Prefix and Suffix word formations", mastery: 63, trend: "+2%" },
      { name: "G. Composition", bcsNo: "Language: Composition: Names of parts of paragraphs/letters/applications", mastery: 60, trend: "+8%" },
      { name: "H. English Literature", bcsNo: "Literature: Writers from Elizabethan period to the 21st Century. Quotations from drama/poetry of different ages.", mastery: 53, trend: "+4%" }
    ]
  },
  {
    name: "৩. বাংলাদেশ বিষয়াবলি",
    marks: 30,
    color: "from-emerald-500 to-teal-500",
    topics: [
      { name: "১. বাংলাদেশের জাতীয় বিষয়াবলি", bcsNo: "প্রাচীনকাল হতে সম-সাময়িক কালের ইতিহাস, কৃষ্টি ও সংস্কৃতি। ভাষা আন্দোলন এবং মুক্তিযুদ্ধের পটভূমি ও ঘটনাপ্রবাহ । (০৬ নম্বর)", mastery: 80, trend: "+3%" },
      { name: "২. বাংলাদেশের কৃষিজ সম্পদ", bcsNo: "শস্য উৎপাদন এবং এর বহুমুখীকরণ, খাদ্য উৎপাদন, মৎস্য, গবাদিপশু ও হাঁস-মুরগি পালন এবং এ সংক্রান্ত বনজ ও খনিজ সম্পদ উন্নয়ন ইত্যাদি । (০৩ নম্বর)", mastery: 72, trend: "+5%" },
      { name: "৩. বাংলাদেশের জনসংখ্যা, আদমশুমারি, জাতি, গোষ্ঠী ও উপজাতি", bcsNo: "জনসংখ্যা কাঠামো, আদমশুমারি, বিভিন্ন জাতি, গোষ্ঠী ও উপজাতির ভৌগোলিক অবস্থান, সামাজিক-সাংস্কৃতিক জীবনধারা ইত্যাদি । (০৩ নম্বর)", mastery: 68, trend: "+2%" },
      { name: "৪. বাংলাদেশের অর্থনীতি", bcsNo: "উন্নয়ন পরিকল্পনা (দীর্ঘমেয়াদী ও পঞ্চবার্ষিকী), বাজেট ও কর নীতি, জিডিপি ও প্রবৃদ্ধি, দারিদ্র্য বিমোচন, বৈদেশিক সাহায্য ও রেমিট্যান্স ইত্যাদি । (০৩ নম্বর)", mastery: 60, trend: "+8%" },
      { name: "৫. বাংলাদেশের শিল্প ও বাণিজ্য", bcsNo: "শিল্প উৎপাদন, পণ্য আমদানি ও রপ্তানি, গার্মেন্টস শিল্প, বৈদেশিক বাণিজ্য ও রেমিট্যান্স, ব্যাংক ও বীমা ব্যবস্থাপনা ইত্যাদি । (০৩ নম্বর)", mastery: 77, trend: "+5%" },
      { name: "৬. বাংলাদেশের সংবিধান", bcsNo: "প্রস্তাবনা ও বৈশিষ্ট্য, মৌলিক অধিকারসহ রাষ্ট্র পরিচালনার মূলনীতিসমূহ, সংবিধানের সংশোধনীসমূহ । (০৩ নম্বর)", mastery: 85, trend: "+15%" },
      { name: "৭. বাংলাদেশের রাজনৈতিক ব্যবস্থা", bcsNo: "রাজনৈতিক দলসমূহের পঠন, ভূমিকা ও কার্যক্রম, ক্ষমতাসীন ও বিরোধী দলের পারস্পরিক সম্পর্কাদি, সুশীল সমাজ ও চাপ সৃষ্টিকারী গোষ্ঠীসমূহ এবং এদের ভূমিকা । (০৩ নম্বর)", mastery: 64, trend: "-4%" },
      { name: "৮. বাংলাদেশের সরকার ব্যবস্থা", bcsNo: "আইন, শাসন ও বিচার বিভাগসমূহ, আইন প্রণয়ন, নীতি নির্ধারণ, জাতীয় ও স্থানীয় পর্যায়ের প্রশাসনিক ব্যবস্থাপনা কাঠামো, প্রশাসনিক পুনর্গঠন ও সংস্কার । (০৩ নম্বর)", mastery: 74, trend: "+10%" },
      { name: "৯. বাংলাদেশের জাতীয় অর্জন, বিশিষ্ট ব্যক্তিত্ব ও গুরুত্বপূর্ণ প্রতিষ্ঠান", bcsNo: "জাতীয় অর্জনসমূহ, বিশিষ্ট ব্যক্তিত্ব, গুরুত্বপূর্ণ প্রতিষ্ঠান, খেলাধুলা, বিশিষ্ট ল্যান্ডমার্ক ও দিবসসমূহ ইত্যাদি । (০৩ নম্বর)", mastery: 70, trend: "+6%" }
    ]
  },
  {
    name: "৪. আন্তর্জাতিক বিষয়াবলি",
    marks: 20,
    color: "from-teal-500 to-cyan-500",
    topics: [
      { name: "১. বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি", bcsNo: "বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি (০৫ নম্বর)", mastery: 50, trend: "+11%" },
      { name: "২. আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক", bcsNo: "আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক (০৫ নম্বর)", mastery: 55, trend: "+5%" },
      { name: "৩. বিশ্বের সাম্প্রতিক ও চলমান ঘটনাপ্রবাহ", bcsNo: "বিশ্বের সাম্প্রতিক ও চলমান ঘটনাপ্রবাহ (০৫ নম্বর)", mastery: 68, trend: "+2%" },
      { name: "৪. আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি", bcsNo: "আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি (০৫ নম্বর)", mastery: 48, trend: "-8%" },
      { name: "৫. আন্তর্জাতিক সংগঠনসমূহ এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি", bcsNo: "আন্তর্জাতিক সংগঠনসমূহ এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি (০৫ নম্বর)", mastery: 73, trend: "+4%" }
    ]
  },
  {
    name: "৫. ভূগোল (বাংলাদেশ ও বিশ্ব), পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
    marks: 10,
    color: "from-cyan-600 to-teal-600",
    topics: [
      { name: "১. ভৌগোলিক অবস্থান ও গুরুত্ব", bcsNo: "বাংলাদেশ ও অঞ্চলভিত্তিক ভৌগোলিক অবস্থান, সীমানা, পারিবেশিক, আর্থ-সামাজিক ও ভূ-রাজনৈতিক গুরুত্ব । (০২ নম্বর)", mastery: 76, trend: "+3%" },
      { name: "২. ভৌত পরিবেশ ও সম্পদের বণ্টন", bcsNo: "অঞ্চলভিত্তিক ভৌত পরিবেশ (ভূ-প্রাকৃতিক), সম্পদের বণ্টন ও গুরুত্ব । (০২ নম্বর)", mastery: 62, trend: "+4%" },
      { name: "৩. বাংলাদেশের পরিবেশ: প্রকৃতি ও সম্পদ", bcsNo: "বাংলাদেশের পরিবেশ: প্রকৃতি ও সম্পদ, প্রধান চ্যালেঞ্জসমূহ । (০২ নম্বর)", mastery: 80, trend: "+0%" },
      { name: "৪. বাংলাদেশ ও বৈশ্বিক পরিবেশ পরিবর্তন", bcsNo: "বাংলাদেশ ও বৈশ্বিক পরিবেশ পরিবর্তন: আবহাওয়া ও জলবায়ু নিয়ামকসমূহ এবং সেক্টরভিত্তিক প্রভাব । (০২ নম্বর)", mastery: 60, trend: "-2%" },
      { name: "৫. প্রাকৃতিক দুর্যোগ ও ব্যবস্থাপনা", bcsNo: "প্রাকৃতিক দুর্যোগ ও ব্যবস্থাপনা: দুর্যোগের ধরন, প্রকৃতি ও ব্যবস্থাপনা । (০২ নম্বর)", mastery: 66, trend: "+5%" }
    ]
  },
  {
    name: "৬. সাধারণ বিজ্ঞান",
    marks: 15,
    color: "from-indigo-500 to-purple-500",
    topics: [
      { name: "ভৌত বিজ্ঞান", bcsNo: "ভৌত বিজ্ঞান- পদার্থের অবস্থা, এটমের গঠন, কার্বনের বহুমুখী ব্যবহার, এসিড, ক্ষার, লবণ ইত্যাদি। (০৫ নম্বর)", mastery: 65, trend: "+2%" },
      { name: "জীব বিজ্ঞান", bcsNo: "জীব বিজ্ঞান- পদার্থের জীববিজ্ঞান-বিষয়ক ধর্ম, টিস্যু, জেনেটিকস, জীববৈচিত্র্য ইত্যাদি। (০৫ নম্বর)", mastery: 74, trend: "+10%" },
      { name: "আধুনিক বিজ্ঞান", bcsNo: "আধুনিক বিজ্ঞান- পৃথিবী সৃষ্টির ইতিহাস, কসমিক রে, ব্লাক হোল, হিগের কণা ইত্যাদি। (০৫ নম্বর)", mastery: 68, trend: "+4%" }
    ]
  },
  {
    name: "৭. কম্পিউটার ও তথ্যপ্রযুক্তি",
    marks: 15,
    color: "from-purple-500 to-fuchsia-500",
    topics: [
      { name: "কম্পিউটার (অঙ্গসংগঠন ও পেরিফেরালস)", bcsNo: "কম্পিউটার পেরিফেরালস, কম্পিউটারের অঙ্গসংগঠন, সিস্টেমস ও ডেটাবেইস । (১০ নম্বর)", mastery: 77, trend: "+9%" },
      { name: "তথ্যপ্রযুক্তি (নেটওয়ার্ক ও যোগাযোগ)", bcsNo: "ই-কমার্স, সেলুলার ডাটা নেটওয়ার্ক, ইন্টারনেট ও দৈনন্দিন কম্পিউটিং প্রযুক্তি । (০৫ নম্বর)", mastery: 58, trend: "+3%" },
      { name: "তথ্যপ্রযুক্তি (আধুনিক সেবা ও সাইবারক্রাইম)", bcsNo: "ক্লাউড কম্পিউটিং, সোশ্যাল নেটওয়ার্কিং, রোবটিক্স ও সাইবার অপরাধ । (০৫ নম্বর)", mastery: 71, trend: "+4%" }
    ]
  },
  {
    name: "৮. গাণিতিক যুক্তি",
    marks: 15,
    color: "from-fuchsia-500 to-pink-500",
    topics: [
      { name: "১. পাটিগণিত", bcsNo: "বাস্তব সংখ্যা, ল.সা.গু, গ.সা.গু, শতকরা, সরল ও যৌগিক মুনাফা, অনুপাত ও সমানুপাত, লাভ ও ক্ষতি । (০৩ নম্বর)", mastery: 48, trend: "-6%" },
      { name: "২. বীজগণিত", bcsNo: "বীজগাণিতিক সূত্রাবলি, বহুপদী উৎপাদক, সমীকরণ ও অসমতা, সহসমীকরণ । (০৩ নম্বর)", mastery: 55, trend: "+8%" },
      { name: "৩. সূচক, লগারিদম ও ধারা", bcsNo: "সূচক ও লগারিদম, সমান্তর ও গুণোত্তর অনুক্রম ও ধারা । (০৩ নম্বর)", mastery: 60, trend: "+15%" },
      { name: "৪. জ্যামিতি ও পিথাগোরাস", bcsNo: "রেখা, কোণ, ত্রিভুজ ও চতুর্ভুজ সংক্রান্ত উপপাদ্য, পিথাগোরাসের উপপাদ্য, বৃত্ত সংক্রান্ত উপপাদ্য, পরিমিতি । (০৩ নম্বর)", mastery: 40, trend: "+0%" },
      { name: "৫. সেট, বিন্যাস ও সমাবেশ", bcsNo: "সেট, বিন্যাস ও সমাবেশ, পরিসংখ্যান ও সম্ভাব্যতা । (০৩ নম্বর)", mastery: 35, trend: "-10%" }
    ]
  },
  {
    name: "৯. মানসিক দক্ষতা",
    marks: 15,
    color: "from-pink-500 to-rose-500",
    topics: [
      { name: "১. ভাষাগত যৌক্তিক বিচার (Verbal)", bcsNo: "ভাষাগত যৌক্তিক বিচার (Verbal Reasoning)", mastery: 80, trend: "+2%" },
      { name: "২. সমস্যা সমাধান (Problem Solving)", bcsNo: "সমস্যা সমাধান (Problem Solving)", mastery: 68, trend: "-1%" },
      { name: "৩. বানান ও ভাষা (Spelling)", bcsNo: "বানান ও ভাষা (Spelling and Language)", mastery: 75, trend: "+5%" },
      { name: "৪. যান্ত্রিক দক্ষতা (Mechanical)", bcsNo: "যান্ত্রিক দক্ষতা (Mechanical Reasoning)", mastery: 70, trend: "+3%" },
      { name: "৫. স্থানাঙ্ক সম্পর্ক (Space Relation)", bcsNo: "স্থানাঙ্ক সম্পর্ক (Space Relation)", mastery: 62, trend: "+8%" },
      { name: "৬. সংখ্যাগত ক্ষমতা (Numerical)", bcsNo: "সংখ্যাগত ক্ষমতা (Numerical Ability)", mastery: 72, trend: "+4%" }
    ]
  },
  {
    name: "১০. নৈতিকতা, মূল্যবোধ ও সু-শাসন",
    marks: 10,
    color: "from-rose-500 to-red-500",
    topics: [
      { name: "মূল্যবোধ ও সুশাসনের সংজ্ঞায়ন ও সম্পর্ক", bcsNo: "Definition of Values and Good Governance; Relation between Values and Good Governance; General Perception of Values and Good Governance", mastery: 90, trend: "+5%" },
      { name: "মূল্যবোধের গুরুত্ব ও সুশাসন প্রতিষ্ঠা", bcsNo: "Importance of Values and Good Governance in the life of an individual as a citizen as well as in the making of society and national ideals; How the element of Good Governance and Values can be established in society", mastery: 88, trend: "+0%" },
      { name: "জাতীয় উন্নয়ন ও অনুপস্থিতির মাশুল", bcsNo: "Impact of Values and Good Governance in national development; The benefit of Values and Good Governance and the cost society pays adversely in their absence", mastery: 83, trend: "+3%" }
    ]
  }
];

// Bangladesh Bank Core Common Syllabus
const bankSyllabus = [
  {
    name: "১. Bangla Language & Literature",
    weight: 20,
    color: "from-emerald-500 to-teal-500",
    topics: [
      { name: "Bangla Grammar (ব্যাকরণ)", match: "প্রয়োগ-অপপ্রয়োগ, শুদ্ধিশোধন, সন্ধি, সমাস, কারক", mastery: 75, trend: "+5%" },
      { name: "Bangla Literature History", match: "প্রাচীন, মধ্য ও আধুনিক যুগ, কবি ও রচয়িতারা", mastery: 55, trend: "+2%" }
    ]
  },
  {
    name: "২. English Language & Literature",
    weight: 25,
    color: "from-indigo-600 to-cyan-500",
    topics: [
      { name: "Quantitative Grammar & Idioms", match: "Tenses, Voice change, Preposition, Parts of speech", mastery: 68, trend: "+8%" },
      { name: "Vocabulary & Analogy", match: "Synonyms, Antonyms, Analogies, Sentence completions", mastery: 42, trend: "-4%" },
      { name: "English Literature", match: "Famous writers, periods, quotes and literary devices", mastery: 50, trend: "+1%" }
    ]
  },
  {
    name: "৩. Mathematics & Quantitative Aptitude",
    weight: 30,
    color: "from-amber-500 to-orange-500",
    topics: [
      { name: "Arithmetic Numerical Abilities", match: "Simple & compound interest, percentage, profit-loss, average", mastery: 45, trend: "-5%" },
      { name: "Algebraic & Word Problems", match: "Equations, ratio-proportion, work-time, speed-distance-trains, pipes", mastery: 38, trend: "+10%" },
      { name: "Geometry & Coordinate Maths", match: "Triangles, circles, quadrilaterals, coordinate geometry & lines", mastery: 30, trend: "-2%" },
      { name: "Data Interpretation (DI)", match: "Tables, pie charts, bar charts, line graphs and caselets", mastery: 52, trend: "+3%" },
      { name: "Set Theory & Probability", match: "Venn diagram, sets, combinations, permutations and basic probability", mastery: 48, trend: "+4%" },
      { name: "Mensuration & Numbers", match: "Area, volume, LCM, HCF, fractions, indices, log and number series", mastery: 55, trend: "+12%" }
    ]
  },
  {
    name: "৪. General Knowledge (GK)",
    weight: 15,
    color: "from-blue-600 to-sky-500",
    topics: [
      { name: "Bangladesh Affairs (বাংলাদেশ বিষয়)", match: "History, Central Bank, Currency, 5-year plans & state structure", mastery: 84, trend: "+2%" },
      { name: "International Banking & Trade", match: "IMF, WB, global trade, geopolitics, current headlines & agreements", mastery: 60, trend: "+7%" },
      { name: "Monetary Policy & FinTech", match: "Regulator acts, green banking, monetary instruments and mobile banking", mastery: 72, trend: "+6%" },
      { name: "Global Geopolitics & Organizations", match: "United Nations, treaties, regional groupings, summits and international awards", mastery: 63, trend: "+5%" },
      { name: "Environmental Issues & Sports", match: "Climate change, global summits, sports events and international history", mastery: 77, trend: "+2%" }
    ]
  },
  {
    name: "৫. Computer & ICT",
    weight: 10,
    color: "from-purple-600 to-indigo-500",
    topics: [
      { name: "Computer Hardware & OS Architecture", match: "Memory, Peripherals, Registers, Processing speeds, Bus structure", mastery: 70, trend: "+4%" },
      { name: "Banking Technology & Networking", match: "LAN, WAN, SWIFT, cyber security & threat detection", mastery: 82, trend: "+11%" },
      { name: "Database & Information Systems", match: "SQL querying, DBMS structures, computer languages and soft engineering", mastery: 64, trend: "+5%" },
      { name: "Internet, Cyber Security & E-Commerce", match: "Email protocols, routing, firewalls, cyber crimes and secure transactions", mastery: 79, trend: "+8%" }
    ]
  }
];



// Helper map to retrieve subtopics per topic
function getSubtopicsForTopic(topicName: string): string[] {
  const mapping: { [key: string]: string[] } = {
    // Bangla
    "প্রয়োগ-অপপ্রয়োগ, বানান ও বাক্য শুদ্ধি": ["বানান শুদ্ধি (Spellings)", "বাক্য শুদ্ধি (Syntax)", "প্রয়োগ-অপপ্রয়োগ (Usage)"],
    "পরিভাষা, সমার্থক ও বিপরীতার্থক শব্দ": ["পরিভাষা (Terminology)", "সমার্থক শব্দ (Synonyms)", "বিপরীতার্থক শব্দ (Antonyms)"],
    "ধ্বনি, বর্ণ ও শব্দ": ["ধ্বনি ও বর্ণ (Phonetics)", "শব্দের প্রকারভেদ", "ধ্বনি পরিবর্তন (Sound Change)"],
    "পদ ও বাক্য": ["পদের শ্রেণিবিভাগ", "বাক্যের গঠন", "কারক ও বিভক্তি (Cases)"],
    "প্রত্যয়, সন্ধি ও সমাস": ["সন্ধি (Sandhi)", "সমাস (Compound Words)", "প্রত্যয় (Prefix/Suffix)"],
    "ক. প্রাচীন ও মধ্যযুগ (সাহিত্য)": ["চর্যাপদ (Charyapada)", "মঙ্গলকাব্য (Mangalkavya)", "বৈষ্ণব পদাবলি", "মোর্শিয়া সাহিত্য"],
    "খ. আধুনিক যুগ (১৮০০-বর্তমান পর্যন্ত) (সাহিত্য)": ["রবীন্দ্র-নজরুল সাহিত্য", "ভাষা আন্দোলন ভিত্তিক সাহিত্য", "মুক্তিযুদ্ধ ভিত্তিক সাহিত্য", "সার্থক ইতিহাস ও উপন্যাস"],

    // English
    "A. Parts of Speech: Noun & Pronoun": ["Noun & Determiners", "Pronoun Classifications", "Gender & Number"],
    "A. Parts of Speech: The Verb & Modals": ["Finite & Non-finite", "Linking & Phrasal Verbs", "Modals & Auxiliaries"],
    "A. Parts of Speech: Adjective, Adverb, Preposition & Conjunction": ["Adjective Degrees", "Adverbs of Frequency", "Appropriate Prepositions"],
    "B. Idioms & Phrases": ["Idiomatic Expressions", "Kinds of Phrases", "Verbal Phrases"],
    "C. Clauses": ["Principal Clause", "Subordinate Noun Clause", "Adjective and Adverbial Clauses"],
    "D. Corrections": ["Subject-Verb Agreement", "Tense Consistency", "Pronoun Reference Error"],
    "E. Sentences & Transformations": ["Simple, Compound, Complex", "Active & Passive Voice", "Degree Transformations"],
    "F. Words: Meanings, Synonyms & Antonyms": ["Synonyms & Contextual Meaning", "Antonyms", "Analogical Words"],
    "F. Words: Spellings & Formations": ["Spelling Corrections", "Prefixes & Suffixes", "Inflections"],
    "G. Composition": ["Letter Writing formats", "Paragraph Composition structures"],
    "H. English Literature": ["Elizabethan Period", "Romantic Period", "Victorian & Modernist Writers", "Famous Quotations"],

    // Bangladesh affairs
    "১. বাংলাদেশের জাতীয় বিষয়াবলি": ["প্রাচীন বাংলার ইতিহাস", "ভাষা আন্দোলন ১৯৫২", "মুক্তিযুদ্ধ ১৯৭১ ও পটভূমি"],
    "২. বাংলাদেশের কৃষিজ সম্পদ": ["শস্য বহুমুখীকরণ", "মৎস্য ও গবাদিপশু পালন", "বনজ ও খনিজ সম্পদ"],
    "৩. বাংলাদেশের জনসংখ্যা, আদমশুমারি, জাতি, গোষ্ঠী ও উপজাতি": ["জনসংখ্যা কাঠামো", "আদমশুমারি ও গৃহগণনা", "উপজাতিদের ভৌগোলিক অবস্থান"],
    "৪. বাংলাদেশের অর্থনীতি": ["পঞ্চবার্ষিকী পরিকল্পনা", "জাতীয় বাজেট ও জিডিপি", "দারিদ্র্য বিমোচন ও রেমিট্যান্স"],
    "৫. বাংলাদেশের শিল্প ও বাণিজ্য": ["পোশাক খাত (RMG)", "আমদানি ও রপ্তানি পণ্য", "ব্যাংক ও বীমা সেক্টর"],
    "৬. বাংলাদেশের সংবিধান": ["প্রস্তাবনা ও মূলনীতি", "মৌলিক অধিকারসমূহ", "গুরুত্বপূর্ণ সংবিধান সংশোধনী"],
    "৭. বাংলাদেশের রাজনৈতিক ব্যবস্থা": ["রাজনৈতিক দলের ভূমিকা", "সুশীল সমাজ ও চাপ সৃষ্টিকারী দল"],
    "৮. বাংলাদেশের সরকার ব্যবস্থা": ["আইন, শাসন ও বিচার বিভাগ", "জাতীয় ও স্থানীয় প্রশাসনিক কাঠামো"],
    "৯. বাংলাদেশের জাতীয় অর্জন, বিশিষ্ট ব্যক্তিত্ব ও গুরুত্বপূর্ণ প্রতিষ্ঠান": ["জাতীয় অর্জন ও দিবস", "বিশিষ্ট ব্যক্তিত্ব", "খেলাধুলা ও ল্যান্ডমার্ক"],

    // International affairs
    "১. বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি": ["বৈশ্বিক ইতিহাস ও যুদ্ধ", "আঞ্চলিক ফোরাম", "ভূ-রাজনীতি ও সমীকরণ"],
    "২. আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক": ["আন্তরাষ্ট্রীয় চুক্তি ও নিরাপত্তা", "সামরিক জোট ও সক্ষমতা"],
    "৩. বিশ্বের সাম্প্রতিক ও চলমান ঘটনাপ্রবাহ": ["চলমান বৈশ্বিক সংঘাত", "সাম্প্রতিক ভূ-রাজনৈতিক সম্মেলন"],
    "৪. আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি": ["COP ও পরিবেশ চুক্তি", "গ্রিনহাউস গ্যাস ও তাপমাত্রা"],
    "৫. আন্তর্জাতিক সংগঠনসমূহ এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি": ["জাতিসংঘ ও সাব-সংস্থা (UN)", "বিশ্বব্যাংক ও আইএমএফ (WB/IMF)", "ডব্লিউটিও (WTO)"],

    // Science
    "ভৌত বিজ্ঞান": ["পদার্থের অবস্থা ও এটম", "কার্বন ও পলিমার", "এসিড, ক্ষার ও লবণ"],
    "জীব বিজ্ঞান": ["উদ্ভিদ ও প্রাণী টিস্যু", "জেনেটিক্স ও ডিএনএ", "জীববৈচিত্র্য ও ভাইরাস"],
    "আধুনিক বিজ্ঞান": ["পৃথিবী ও মহাবিশ্ব সৃষ্টি", "ব্লাক হোল ও কসমিক রে", "হিগস বোসন কণা"],

    // ICT
    "কম্পিউটার (অঙ্গসংগঠন ও পেরিফেরালস)": ["কম্পিউটার হার্ডওয়্যার", "মেমোরি ও বাস কাঠামো", "সিস্টেম ও ডাটাবেজ"],
    "তথ্যপ্রযুক্তি (নেটওয়ার্ক ও যোগাযোগ)": ["LAN/WAN নেটওয়ার্ক প্রটোকল", "মোবাইল ডাটা প্রযুক্তি", "ই-কমার্সের ভিত্তি"],
    "তথ্যপ্রযুক্তি (আধুনিক সেবা ও সাইবারক্রাইম)": ["ক্লাউড কম্পিউটিং", "রোবটিক্স ও এআই", "সাইবার ক্রাইম ও সিকিউরিটি"],

    // Math
    "১. পাটিগণিত": ["বাস্তব সংখ্যা, লসাগু-গসাগু", "শতকরা ও লাভ-ক্ষতি", "সরল ও যৌগিক মুনাফা"],
    "২. বীজগণিত": ["বীজগাণিতিক সূত্রাবলি", "বহুপদী উৎপাদক", "সমীকরণ ও অসমতা"],
    "৩. সূচক, লগারিদম ও ধারা": ["সূচক ও লগারিদম", "সমান্তর ও গুণোত্তর ধারা"],
    "৪. জ্যামিতি ও পিথাগোরাস": ["কোণ ও ত্রিভুজ সংক্রান্ত", "পিথাগোরাসের উপপাদ্য", "ক্ষেত্রফল ও পরিমিতি"],
    "৫. সেট, বিন্যাস ও সমাবেশ": ["সেট ও ভেনচিত্র", "বিন্যাস ও সমাবেশ", "পরিসংখ্যান ও সম্ভাব্যতা"],

    // Mental
    "১. মানসিক দক্ষতা": ["মানসিক ক্ষমতা গাণিতিক ধাঁধা"],
    "১. ভাষাগত যৌক্তিক বিচার (Verbal)": ["ভাষাগত যৌক্তিক কোডিং", "রক্তের সম্পর্কীয় সমস্যা"],
    "২. সমস্যা সমাধান (Problem Solving)": ["সমস্যা সমাধান সমাধান", "দিক ও দূরত্ব সমস্যা"],
    "৩. বানান ও ভাষা (Spelling)": ["বানান শুদ্ধি যাচাই", "ভাষাগত সামঞ্জস্যপূর্ণ জোড়"],
    "৪. যান্ত্রিক দক্ষতা (Mechanical)": ["যান্ত্রিক পার্টস ও গিয়ার", "পদার্থের সাধারণ যান্ত্রিক নিয়ম"],
    "৫. স্থানাঙ্ক সম্পর্ক (Space Relation)": ["স্থানাঙ্ক জ্যামিতি বেসিক", "আয়নায় প্রতিবিম্ব প্রতিচ্ছবি"],
    "৬. সংখ্যাগত ক্ষমতা (Numerical)": ["সিরিজ ও ধারা পূরণ", "সংখ্যার গণনামূলক ধাঁধা"],

    // Ethics
    "মূল্যবোধ ও সুশাসনের সংজ্ঞায়ন ও সম্পর্ক": ["মূল্যবোধ ও সুশাসন সংজ্ঞা", "মূল্যবোধের উপাদান"],
    "মূল্যবোধের গুরুত্ব ও সুশাসন প্রতিষ্ঠা": ["নাগরিক মূল্যবোধ", "সুশাসনের স্তম্ভসমূহ প্রতিষ্ঠা"],
    "জাতীয় উন্নয়ন ও অনুপস্থিতির মাশুল": ["জাতীয় উন্নয়নে সুশাসন প্রভাব", "দুর্নীতি ও অব্যবস্থাপনার মূল্য"]
  };
  
  return mapping[topicName] || ["সাধারণ প্রশ্ন (General Concepts)", "ব্যাখ্যাসূত্র বিশ্লেষণ (Analytical Concepts)"];
}

export default function ExamEngine({ examType, selectedExamMode, onExamCompleted, onTriggerTutor }: ExamEngineProps) {
  
  const currentMode = selectedExamMode || { type: 'BCS' };
  
  // States
  const [activeTab, setActiveTab] = useState<'syllabus' | 'mastery' | 'builder' | 'simulation' | 'history'>('syllabus');
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [pendingTab, setPendingTab] = useState<'syllabus' | 'mastery' | 'builder' | 'simulation' | 'history' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Persistence, Export and DB states
  const [examHistory, setExamHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ninthgrade_exam_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [pdfLayoutMode, setPdfLayoutMode] = useState<'single' | 'double' | 'concise'>('double');
  const [includeAnswersInPdf, setIncludeAnswersInPdf] = useState<boolean>(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isExportingGd, setIsExportingGd] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>('');
  const [confirmationExport, setConfirmationExport] = useState<{
    fileName: string;
    type: 'PDF' | 'GDrive';
    status: 'success' | 'creating' | 'error';
    linkUrl?: string;
    errorMsg?: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ninthgrade_exam_history', JSON.stringify(examHistory));
    } catch (e) {
      console.error('Failed to write history to localStorage:', e);
    }
  }, [examHistory]);

  const recordSessionInHistory = (newQuestions: Question[], difficulty: string, subjectsUsed: string[]) => {
    const newSessionId = `exam_${Date.now()}`;
    setActiveSessionId(newSessionId);

    const dateStr = new Date().toLocaleString('bn-BD', {
      hour12: true,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newHistoryItem = {
      id: newSessionId,
      timestamp: new Date().toISOString(),
      dateString: dateStr,
      mode: currentMode.type,
      difficulty,
      questionCount: newQuestions.length,
      subjects: subjectsUsed.length > 0 ? subjectsUsed : ["সাধারণ প্র্যাকটিস"],
      questions: newQuestions,
      status: 'In Progress',
      results: null
    };

    setExamHistory(prev => [newHistoryItem, ...prev]);
  };

  const handlePrintExam = (questionsToExport: Question[], baseTitle: string, includeAnswers: boolean, layout: 'single' | 'double' | 'concise' = pdfLayoutMode) => {
    // Show confirmation toast/modal with generated filename
    setConfirmationExport({
      fileName: `${baseTitle}.pdf`,
      type: 'PDF',
      status: 'success'
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("পপ-আপ সক্ষম করুন (Enable pop-ups to export as PDF)");
      return;
    }

    const bnDateStr = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

    let optionsHTML = '';
    questionsToExport.forEach((q, idx) => {
      let optionsDivStyle = '';
      if (layout === 'concise') {
        optionsDivStyle = `display: flex; flex-flow: row wrap; gap: 4px 12px; margin-left: 10px; margin-top: 2px;`;
      } else {
        optionsDivStyle = `display: grid; grid-template-columns: ${layout === 'double' ? '1fr' : '1fr 1fr'}; gap: ${layout === 'double' ? '5px' : '10px'}; margin-left: 12px;`;
      }

      optionsHTML += `
        <div class="question-block" style="margin-bottom: ${layout === 'concise' ? '6px' : layout === 'double' ? '14px' : '22px'}; break-inside: avoid; page-break-inside: avoid;">
          <p style="font-size: ${layout === 'concise' ? '10.5px' : layout === 'double' ? '12px' : '14px'}; font-weight: bold; margin-bottom: 4px; color: #1e293b; text-align: left; line-height: ${layout === 'concise' ? '1.25' : '1.4'};">
            ${idx + 1}. ${q.text}
          </p>
          <div style="${optionsDivStyle}">
            ${q.options.map((opt, oIdx) => `
              <div style="font-size: ${layout === 'concise' ? '9.5px' : layout === 'double' ? '11px' : '12px'}; color: #334155; display: flex; align-items: center; gap: 4px; text-align: left;">
                <span style="font-weight: bold; font-family: monospace; border: 1px solid #cbd5e1; border-radius: 3px; padding: 0px 3px; background: #f1f5f9; display: inline-block; min-width: 12px; text-align: center; font-size: ${layout === 'concise' ? '8.5px' : '10px'};">
                  ${String.fromCharCode(65 + oIdx)}
                </span>
                <span>${opt}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    let answersHTML = '';
    if (includeAnswers) {
      if (layout === 'concise') {
        const answerGridItems = questionsToExport.map((q, idx) => `
          <div style="border: 1px solid #e2e8f0; padding: 3px 5px; font-size: 9px; background: #f8fafc; text-align: left; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: bold; font-family: monospace; color: #475569;">Q${idx + 1}:</span>
            <span style="font-weight: bold; color: #16a34a;">${String.fromCharCode(65 + q.correctIndex)}</span>
          </div>
        `).join('');

        answersHTML = `
          <div style="margin-top: 15px; border-top: 2px dashed #cbd5e1; padding-top: 10px; break-inside: avoid; page-break-inside: avoid;">
            <h3 style="font-size: 11px; font-weight: bold; color: #0f172a; margin-bottom: 6px; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">
              ANSWER MATRIX (উত্তরপত্র সংক্ষেপ)
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 3px;">
              ${answerGridItems}
            </div>
          </div>
        `;
      } else {
        answersHTML = `
          <div style="margin-top: 30px; border-top: 2px dashed #94a3b8; padding-top: 15px; break-inside: avoid; page-break-inside: avoid;">
            <h3 style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 10px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
              ANSWER KEY & EXPLANATIONS (উত্তরমালা ও সমাধান সূত্র)
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; text-align: left;">
              <thead>
                <tr style="background-color: #f1f5f9;">
                  <th style="padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 10px; width: 40px;">Q.No</th>
                  <th style="padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 10px; width: 140px;">Correct Key</th>
                  <th style="padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 10px;">Explanation / সূত্র</th>
                </tr>
              </thead>
              <tbody>
                ${questionsToExport.map((q, idx) => `
                  <tr>
                    <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-weight: bold; font-family: monospace; font-size: 10px;">${idx + 1}</td>
                    <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-weight: bold; color: #15803d; font-size: 10px;">
                      Option ${String.fromCharCode(65 + q.correctIndex)}: ${q.options[q.correctIndex]}
                    </td>
                    <td style="padding: 4px 8px; border: 1px solid #e2e8f0; font-size: 10px; color: #475569;">
                      ${q.explanations?.bn || 'সমাধান সূত্র লোড করা আছে।'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }

    const completeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${baseTitle}</title>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #1e293b;
            padding: ${layout === 'concise' ? '12px' : layout === 'double' ? '20px' : '40px'};
            line-height: ${layout === 'concise' ? '1.25' : '1.4'};
            margin: 0;
            background: white;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
          
          /* Column styling */
          .questions-container {
            display: block;
          }
          .layout-double-columns {
            column-count: 2;
            column-gap: ${layout === 'concise' ? '16px' : '30px'};
            column-rule: 1px dashed #cbd5e1;
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background: #0f172a; color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif;">
          <span style="font-size: 13px; font-weight: bold;">
            🖨️ PDF Print Preview (${layout === 'concise' ? '⚡ Concise Ultra-Compact Column Layout' : layout === 'double' ? 'Double Column Paper-Saving Mode 📄📄' : 'Standard Single Column Layout 📃'})
          </span>
          <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>

        <div style="border-bottom: 3px double #334155; padding-bottom: 10px; margin-bottom: 18px; text-align: center;">
          <h1 style="font-size: ${layout === 'concise' ? '15px' : layout === 'double' ? '18px' : '22px'}; font-weight: bold; margin: 0 0 4px 0; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
            ${baseTitle}
          </h1>
          <p style="font-size: 9px; color: #64748b; font-family: monospace; margin: 0 0 5px 0;">
            9TH GRADE AI SYSTEM • HIGH-EFFICIENCY COMPACT EXAM FORMAT
          </p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #475569; margin-top: 8px;">
            <span>তারিখ: <strong>${bnDateStr}</strong></span>
            <span>প্রশ্নের সংখ্যা: <strong>${questionsToExport.length} টি</strong></span>
            <span>সময়: <strong>${Math.ceil((questionsToExport.length * 40) / 60)} মিনিট</strong></span>
          </div>
        </div>

        <div style="margin-bottom: 10px; font-size: 10px; font-style: italic; color: #64748b; line-height: 1.3; text-align: left;">
          * নির্দেশাবলি: প্রতিটি প্রশ্নের জন্য সঠিক উত্তরের বৃত্ত ভরাট করুন। ভুল উত্তরের জন্য ০.৫০ নেতিবাচক মার্কিং প্রযোজ্য। অফলাইন অনুশীলন শেষে সমাধান শিট দিয়ে নিজেকে মূল্যায়ন করুন।
        </div>

        <hr style="border: 0; border-top: 1px solid #cbd5e1; margin-bottom: 15px;" />

        <div class="${(layout === 'double' || layout === 'concise') ? 'layout-double-columns' : 'questions-container'}">
          ${optionsHTML}
        </div>

        ${answersHTML}

        <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 10px; text-align: center; font-size: 8px; color: #94a3b8; font-family: monospace;">
          Generated by 9Th Grade AI Educational Platform • Prep intelligently, measure accurately.
        </div>

        <script>
          setTimeout(function() {
            window.print();
          }, 500);
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(completeHTML);
    printWindow.document.close();
  };

  const getGoogleToken = async (): Promise<string> => {
    if (googleAccessToken) return googleAccessToken;

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.setCustomParameters({
      prompt: 'consent'
    });

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('গুগল অ্যাক্সেস টোকেন পাওয়া যায়নি।');
    }

    setGoogleAccessToken(credential.accessToken);
    return credential.accessToken;
  };

  const handleDownloadTextOffline = (questionsToExport: Question[], baseTitle: string) => {
    const fileName = `${baseTitle} - 9Th Grade AI Practice.txt`;
    const dateStr = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
    let bodyText = `9TH GRADE AI - EXAM PRACTICE SHEET\n`;
    bodyText += `তারিখ: ${dateStr}\n`;
    bodyText += `মোট প্রশ্ন: ${questionsToExport.length} টি\n`;
    bodyText += `কোর্স স্ট্রিম: ${currentMode.type}\n`;
    bodyText += `=========================================\n\n`;

    questionsToExport.forEach((q, idx) => {
      bodyText += `${idx + 1}. ${q.text}\n`;
      bodyText += `বিষয়: ${q.subject} | টপিক: ${q.topic} | কঠিনতা: ${q.difficulty}\n`;
      q.options.forEach((opt, oIdx) => {
        bodyText += `   [${String.fromCharCode(65 + oIdx)}] ${opt}\n`;
      });
      bodyText += `\n`;
    });

    bodyText += `\n=========================================\n`;
    bodyText += `ANSWER KEYS & SOLUTIONS (উত্তরমালা ও ব্যাখ্যা শিট)\n`;
    bodyText += `=========================================\n`;
    questionsToExport.forEach((q, idx) => {
      bodyText += `প্রশ্ন ${idx + 1}: সঠিক উত্তর [${String.fromCharCode(65 + q.correctIndex)}] ${q.options[q.correctIndex]}\n`;
      bodyText += `ব্যাখ্যা: ${q.explanations?.bn || 'সমাধান ডাটাবেজে সংরক্ষিত রয়েছে।'}\n\n`;
    });

    bodyText += `\n\nGenerated with 9Th Grade AI. Prep intelligently, measure accurately.`;

    const element = document.createElement("a");
    const file = new Blob([bodyText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportGoogleDocs = async (questionsToExport: Question[], baseTitle: string) => {
    setIsExportingGd(true);
    const fileName = `${baseTitle} - 9Th Grade AI Offline Exam.txt`;
    setConfirmationExport({
      fileName,
      type: 'GDrive',
      status: 'creating'
    });
    setExportMessage('সার্ভারের সাথে ডাটা সিঙ্ক করা হচ্ছে...');
    try {
      const token = await getGoogleToken();
      setExportMessage('গুগল ড্রাইভে ফাইল তৈরি করা হচ্ছে...');

      const dateStr = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
      let bodyText = `9TH GRADE AI - EXAM PRACTICE SHEET\n`;
      bodyText += `তারিখ: ${dateStr}\n`;
      bodyText += `মোট প্রশ্ন: ${questionsToExport.length} টি\n`;
      bodyText += `কোর্স স্ট্রিম: ${currentMode.type}\n`;
      bodyText += `=========================================\n\n`;

      questionsToExport.forEach((q, idx) => {
        bodyText += `${idx + 1}. ${q.text}\n`;
        bodyText += `বিষয়: ${q.subject} | টপিক: ${q.topic} | কঠিনতা: ${q.difficulty}\n`;
        q.options.forEach((opt, oIdx) => {
          bodyText += `   [${String.fromCharCode(65 + oIdx)}] ${opt}\n`;
        });
        bodyText += `\n`;
      });

      bodyText += `\n=========================================\n`;
      bodyText += `ANSWER KEYS & SOLUTIONS (উত্তরমালা ও ব্যাখ্যা শিট)\n`;
      bodyText += `=========================================\n`;
      questionsToExport.forEach((q, idx) => {
        bodyText += `প্রশ্ন ${idx + 1}: সঠিক উত্তর [${String.fromCharCode(65 + q.correctIndex)}] ${q.options[q.correctIndex]}\n`;
        bodyText += `ব্যাখ্যা: ${q.explanations?.bn || 'সমাধান ডাটাবেজে সংরক্ষিত রয়েছে।'}\n\n`;
      });

      bodyText += `\n\nGenerated with 9Th Grade AI. Prep intelligently, measure accurately.`;

      const docMetadata = {
        name: fileName,
        mimeType: 'text/plain'
      };

      const boundary = '39f60206-dace-43d2-97f2-07955188';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartBody = 
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(docMetadata) +
        delimiter +
        'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
        bodyText +
        closeDelimiter;

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!response.ok) {
        throw new Error('গুগল ড্রাইভ কানেক্টিভিটি ত্রুটি।');
      }

      const driveData = await response.json();
      const fileId = driveData.id;
      const fileUrl = fileId ? `https://drive.google.com/open?id=${fileId}` : undefined;

      setConfirmationExport({
        fileName,
        type: 'GDrive',
        status: 'success',
        linkUrl: fileUrl
      });

      setExportMessage('সাফল্য! গুগল ড্রাইভে ফাইল সঠিকভাবে তৈরি হয়েছে।');
      setTimeout(() => setExportMessage(''), 4000);
    } catch (err: any) {
      console.error('Google Docs export failed:', err);
      const isOpeNotAllowed = err?.code === 'auth/operation-not-allowed' || err?.message?.includes('auth/operation-not-allowed') || err?.message?.includes('operation-not-allowed');
      const errorMsg = isOpeNotAllowed 
        ? 'আপনার ফায়ারবেস কনসোলে Google Auth সচল করা নেই। আপনি চাইলে নিচের অফলাইন বোতামে ক্লিক করে এখনই টেক্সট ফাইলটি আপনার হার্ডড্রাইভে ডাউনলোড করতে পারেন।'
        : (err.message || 'রপ্তানি করতে সমস্যা হয়েছে।');

      setConfirmationExport({
        fileName,
        type: 'GDrive',
        status: 'error',
        errorMsg: errorMsg
      });
      setExportMessage(`ত্রুটি: ${errorMsg}`);
      setTimeout(() => setExportMessage(''), 5000);
    } finally {
      setIsExportingGd(false);
    }
  };
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<boolean>(false);
  const [isCertain, setIsCertain] = useState<boolean>(true);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes standard
  const [totalTimeLimit, setTotalTimeLimit] = useState<number>(300);
  const [answersSheet, setAnswersSheet] = useState<{ [qId: string]: { answeredIndex: number; isCertain: boolean } }>({});
  
  // Custom builder options
  const [customLength, setCustomLength] = useState<number>(10);
  const [customDifficulty, setCustomDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectCounts, setSubjectCounts] = useState<{ [subjName: string]: number }>({});
  const [topicCounts, setTopicCounts] = useState<{ [subjTopicKey: string]: number }>({});
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('All');
  const [questionLanguage, setQuestionLanguage] = useState<'Bangla' | 'English'>('Bangla');
  const [selectedExamModeSetting, setSelectedExamModeSetting] = useState<string>('Practice');
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compilingError, setCompilingError] = useState<string>('');
  const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);
  const [isCustomScrollMode, setIsCustomScrollMode] = useState<boolean>(false);
  const [eliminatedOptionsScroll, setEliminatedOptionsScroll] = useState<{ [qId: string]: number[] }>({});
  
  // Learning Graph states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSubjectIndex, setExpandedSubjectIndex] = useState<number | null>(0);
  const [selectedMapNode, setSelectedMapNode] = useState<{ subject: string; topic: string; mastery: number } | null>(null);

  // AI states
  const [loadingAdaptiveQ, setLoadingAdaptiveQ] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [sessionResults, setSessionResults] = useState<NonNullable<ExamSession['results']>>({
    score: 0,
    totalPossible: 0,
    timeSpentSeconds: 0,
    accuracy: 0,
    percentile: 0,
    weakTopics: [],
    guessDetections: 0,
    confidenceLevel: 'Mixed'
  });

  // Dynamic status parameters depending on BB post or BCS
  const getPostSpecificConfig = () => {
    if (currentMode.type === 'BCS') {
      return {
        title: "BCS Preliminary Exam Engine",
        subtitle: "১০টি ক্যাডার ক্যাটাগরি এবং পূর্ণাঙ্গ ২০০ নম্বরের বিসিএস প্রিলিমিনারি প্রস্তুতির বুদ্ধিদীপ্ত ইঞ্জিন",
        baselineDifficulty: "Medium-Hard",
        rankDenominator: "4,50,000",
        cohortConfidence: "BCS Active Cohort",
        primaryTheme: "from-cyan-500 to-blue-600 text-cyan-400",
        bgBadge: "bg-cyan-950/40 text-cyan-300 border-cyan-800/30",
        accentColor: "cyan",
        syllabus: bcsSyllabus
      };
    } else if (currentMode.type === 'Bank') {
      const roleName = currentMode.role || "Assistant Director (AD)";
      let diff = "Hard";
      let denominator = "80,000";
      if (roleName.includes("Officer (Cash)")) {
        diff = "Easy-Medium";
        denominator = "1,50,000";
      } else if (roleName.includes("Senior Officer")) {
        diff = "Medium-Hard";
        denominator = "1,10,000";
      } else if (roleName.includes("General Officer")) {
        diff = "Medium";
        denominator = "1,30,000";
      }
      return {
        title: `${roleName} - Bank Intelligence Engine`,
        subtitle: `বাংলাদেশ ব্যাংক ৯ম গ্রেড ${roleName} পদের জন্য নির্ধারিত সিলেবাস ও প্রশ্ন বিন্যাস নিয়ন্ত্রণ`,
        baselineDifficulty: diff,
        rankDenominator: denominator,
        cohortConfidence: "BB 9th Grade Pool",
        primaryTheme: "from-emerald-500 to-teal-600 text-emerald-400",
        bgBadge: "bg-emerald-950/40 text-emerald-300 border-emerald-800/30",
        accentColor: "emerald",
        syllabus: bankSyllabus
      };
    } else {
      return {
        title: "Custom Exam Builder (AI Generated)",
        subtitle: "কম্পাইল করুন ও সেকেন্ডের মধ্যে আপনার দুর্বল টপিক নিয়ে কাস্টম প্র্যাকটিস শুরু করুন",
        baselineDifficulty: "Dynamic",
        rankDenominator: "1,20,000",
        cohortConfidence: "Personal Learning Metric",
        primaryTheme: "from-purple-500 to-fuchsia-600 text-purple-400",
        bgBadge: "bg-purple-950/40 text-purple-300 border-purple-800/30",
        accentColor: "purple",
        syllabus: bcsSyllabus
      };
    }
  };

  const config = getPostSpecificConfig();

  // Integrated Question Library mapping domains to mock items
  const questionPool: Question[] = [
    {
      id: "bcs-bn-1",
      text: "কোনটি বাংলা ভাষায় রচিত প্রথম প্রামাণ্য ব্যাকরণ গ্রন্থ এবং এটি কত সালে প্রকাশিত হয়েছিল?",
      options: [
        "A Grammar of the Bengali Language, ১৭৭৮",
        "Bengali Grammar, ১৮০১",
        "ব্যাকরণ কৌমুদী, ১৮৫৩",
        "গৌড়ীয় ব্যাকরণ, ১৮৩৩"
      ],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "প্রয়োগ-অপপ্রয়োগ ও বানান শুদ্ধি",
      difficulty: "Medium",
      explanations: {
        bn: "নাথানিয়েল ব্রাসি হালেদের রচিত 'A Grammar of the Bengali Language' বাংলা ভাষার প্রথম প্রামাণ্য ব্যাকরণ গ্রন্থ, যা ১৭৭৮ সালে ভারতের হুগলি থেকে প্রকাশিত হয়েছিল।",
        en: "Nathaniel Brassey Halhed's 'A Grammar of the Bengali Language' (1778) is the first standard grammar book on Bengali language.",
        wrongOptions: [
          "গৌড়ীয় ব্যাকরণ রামমোহন রায় কর্তৃক ১৮৩৩ সালে প্রকাশিত প্রথম বাংলা ভাষায় রচিত ব্যাকরণ গ্রন্থ।",
          "ব্যাকরণ কৌমুদী ঈশ্বরচন্দ্র বিদ্যাসাগর প্রণীত অত্যন্ত সমাদৃত ব্যাকরণ।"
        ]
      }
    },
    {
      id: "bcs-bn-2",
      text: "বাঙলা সাহিত্যের আদি নিদর্শন 'চর্যাপদ' নেপালের রাজদরবার থেকে হরপ্রসাদ শাস্ত্রী কর্তৃক কোন সালে আবিষ্কৃত হয়?",
      options: [
        "১৯০৭",
        "১৯১৬",
        "১৮৯৭",
        "১৯২১"
      ],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "প্রাচীন ও মধ্যযুগ (সাহিত্য)",
      difficulty: "Easy",
      explanations: {
        bn: "চর্যাপদ নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে ১৯০৭ সালে মহামহোপাধ্যায় হরপ্রসাদ শাস্ত্রী কর্তৃক আবিষ্কৃত হয় এবং ১৯১৬ সালে বঙ্গীয় সাহিত্য পরিষদ থেকে প্রথম প্রকাশিত হয়।",
        en: "Charyapada was discovered from the Royal Palace library of Nepal by Haraprasad Shastri in 1907.",
        wrongOptions: [
          "১৯১৬ সালে চর্যাপদ প্রথম পুস্তক আকারে প্রকাশিত হয়।",
          "১৯২১ সালে ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠিত হয়েছিল।"
        ]
      }
    },
    {
      id: "bcs-en-1",
      text: "Identify the correct clause in the brackets: The student [who completed the assignment first] received a special grade of recommendation from the faculty.",
      options: [
        "Adjective Clause",
        "Noun Clause",
        "Adverbial Clause",
        "Co-ordinate Clause"
      ],
      correctIndex: 0,
      subject: "২. English Language & Literature",
      topic: "Parts of Speech & Clauses",
      difficulty: "Medium",
      explanations: {
        bn: "যেহেতু 'who completed the assignment first' অংশটি তার পূর্বে অবস্থিত Noun 'The student' কে মডিফাই করছে বা তথ্য প্রদান করছে, তাই এটি একটি Adjective Clause।",
        en: "Since the bracketed clause describes the preceding noun 'The student', it functions as an Adjective Clause (or relative clause).",
        wrongOptions: [
          "Noun Clause বাক্যের Subject, Object বা Preposition এর Object হিসেবে বসে, মডিফায়ার নয়।",
          "Adverbial Clause সময়, স্থান, কারণ বা অনুমিতি নির্দেশ করে।"
        ]
      }
    },
    {
      id: "bcs-en-2",
      text: "Which of the following Elizabethan plays is celebrated as William Shakespeare's shortest tragedy?",
      options: [
        "Macbeth",
        "Hamlet",
        "Othello",
        "King Lear"
      ],
      correctIndex: 0,
      subject: "২. English Language & Literature",
      topic: "English Literature History",
      difficulty: "Medium",
      explanations: {
        bn: "উইলিয়াম শেক্সপিয়রের রচিত ট্র্যাজেডিগুলোর মধ্যে 'ম্যাকবেথ' (Macbeth) সবচেয়ে ছোট। পক্ষান্তরে 'হ্যামলেট' (Hamlet) সবচেয়ে দীর্ঘ ও জটিল ট্র্যাজেডি।",
        en: "Macbeth is the shortest tragedy of William Shakespeare, while Hamlet is the longest.",
        wrongOptions: [
          "হ্যামলেট হল শেক্সপিয়রের দীর্ঘতম নাটক ও ট্র্যাজেডি।",
          "কিং লিআর এবং ওথেলো অন্যান্য দীর্ঘ গুরুত্বপূর্ণ ট্র্যাজেডির উদাহরণ।"
        ]
      }
    },
    {
      id: "bcs-bd-1",
      text: "বাংলাদেশ পাবলিক সার্ভিস কমিশন (BPSC) সংবিধানের কত অনুচ্ছেদ অনুযায়ী রাষ্ট্রপতির আদেশক্রমে গঠিত একটি সংবিধিবদ্ধ প্রতিষ্ঠান?",
      options: [
        "অনুচ্ছেদ ১৩৭",
        "অনুচ্ছেদ ১৪০",
        "অনুচ্ছেদ ১৩৫",
        "অনুচ্ছেদ ১৪২"
      ],
      correctIndex: 0,
      subject: "৩. বাংলাদেশ বিষয়াবলি",
      topic: "বাংলাদেশের সংবিধান ও সংশোধন",
      difficulty: "Medium",
      explanations: {
        bn: "সংবিধানের ১৩৭ নং অনুচ্ছেদ অনুযায়ী রাষ্ট্রপতি আদেশক্রমে 'বাংলাদেশ সরকারি কর্ম কমিশন' প্রতিষ্ঠা করার ক্ষমতা লাভ করেন। BPSC নির্বাহী বিভাগের আধীনে একটি সংবিধিবদ্ধ স্বাধীন কমিশন।",
        en: "BPSC is established under Article 137 of the Constitution of the Peoples Republic of Bangladesh.",
        wrongOptions: [
          "১৪০ অনুচ্ছেদে সরকারি কর্ম কমিশনের বার্ষিক কাজের রিপোর্টের উল্লেখ রয়েছে।",
          "১৪২ অনুচ্ছেদে সংবিধান সংশোধন পরিবর্তনের আইনি পদ্ধতি ব্যাখ্যা করা হয়েছে।"
        ]
      }
    },
    {
      id: "bcs-bd-2",
      text: "বাংলাদেশ সংবিধানের কোন সংশোধনীকে 'প্রথম সংশোধনী' বা ফার্স্ট এমেন্ডমেন্ট হিসেবে বিবেচনা করা হয় এবং এটি কি সংশোধন করেছিল?",
      options: [
        "যুদ্ধাপরাধীদের বিচার নিশ্চিতকরণ, ১৯৭৩",
        "রাষ্ট্রধর্ম ঘোষণা, ১৯৮৮",
        "তত্ত্বাবধায়ক সরকার বাতিলকরণ, ২০১১",
        "ধর্মনিরপেক্ষতা পুনর্বহাল, ১৯৭৫"
      ],
      correctIndex: 0,
      subject: "৩. বাংলাদেশ বিষয়াবলি",
      topic: "বাংলাদেশের সংবিধান ও সংশোধন",
      difficulty: "Hard",
      explanations: {
        bn: "১৯৭৩ সালের জুলাই মাসে গৃহীত প্রথম সংশোধনীর মাধ্যমে যুদ্ধাপরাধীদের বিচারের আইনী গ্যারান্টি এবং তাদের বিচারের জন্য সামরিক ট্রাইব্যুনাল গঠনের পথ সুগম হয়।",
        en: "The First Amendment of Bangladesh Constitution was passed in 1973 to enable the prosecution and trial of war criminals for genocide and crimes against humanity.",
        wrongOptions: [
          "১৯৮৮ সালে ৮ম সংশোধনীর মাধ্যমে ইসলামকে রাষ্ট্রধর্ম ঘোষণা করা হয়েছিল।",
          "২০১১ সালে ১৫তম সংশোধনীর মাধ্যমে তত্ত্বাবধায়ক সরকার ব্যবস্থা বাতিল করা হয়।"
        ]
      }
    },
    {
      id: "bcs-it-1",
      text: "কম্পিউটারের প্রধান মেমোরির গতি পরিমাপের মূল একক বা ফ্রিকোয়েন্সি মেমোরি ইন্টারফেসটিকে কী বলা হয়?",
      options: [
        "System Clock Speed (MHz/GHz)",
        "Hard drive seek time",
        "RAM capacity size in GB",
        "ALU calculation cycle speed"
      ],
      correctIndex: 0,
      subject: "৭. কম্পিউটার ও তথ্যপ্রযুক্তি",
      topic: "কম্পিউটারের অঙ্গসংগঠন ও পেরিফেরালস",
      difficulty: "Medium",
      explanations: {
        bn: "মেমোরি বাস কিংবা মেমোরি কন্ট্রোল ইন্টারফেসের গতি সিস্টেম ক্লক স্পিড (MHz/GHz) দিয়ে পরিমাপ করা হয়, যা নির্ধারণ করে মেমোরি প্রতি সেকেন্ডে কত বার আইপি ডাটা স্থানান্তর করতে পারে।",
        en: "Clock cycles/frequency measured in megahertz (MHz) represent the primary speed metric of system memory busses.",
        wrongOptions: [
          "RAM capacity মূলত ডাটা ধারণক্ষমতা নির্দেশ করে, গতি নয়।",
          "ALU কম্পিউটারের লজিক ইউনিট যা হিসাব-নিকাশ পরিচালনা করে।"
        ]
      }
    },
    {
      id: "bcs-math-1",
      text: "কোনো মূলধন ৫ বছরে সরল সুদে দ্বিগুণ হলে, একই সুদের হারে তা কত বছরে চার গুণ (৪ গুণ) হবে?",
      options: [
        "১৫ বছর",
        "১০ বছর",
        "১২ বছর",
        "২০ বছর"
      ],
      correctIndex: 0,
      subject: "৮. গাণিতিক যুক্তি",
      topic: "বাস্তব সংখ্যা, লসাআগু ও লাভ-ক্ষতি",
      difficulty: "Hard",
      explanations: {
        bn: "ধরি আসল P। ৫ বছরে আসল দ্বিগুণ হলে সরল সুদ I = P। সুতরাং সুদের হার R = (I * 100) / P*T = (P*100) / (P*5) = 20%। ৪ গুণ হতে হলে মোট সুদ হতে হবে ৩ গুণ অর্থাৎ I' = 3P। অতএব সময় T' = (3P * 100) / (P * 20) = 15 বছর।",
        en: "To quadruple, interest gained must be 3 times Principal. rate = 100/5 = 20%. Time = (3 * 100) / 20 = 15 years.",
        wrongOptions: [
          "১০ বছর মূলত চক্রবৃদ্ধি সুদের বা ভ্রান্ত ভুল হিসেবের জন্য মনে হয়।",
          "২০ বছর দ্বিগুণ ৫ বছর হলে চারগুণ ২০ বছর হবে এমন একটি সহজ ভুল ধারণা থেকে আসে।"
        ]
      }
    },
    {
      id: "bank-math-2",
      text: "A project manager completes 25% of a workspace contract in 12 days. How many more days will he require to complete the remainder of the work alone at this rate?",
      options: [
        "36 Days",
        "24 Days",
        "48 Days",
        "30 Days"
      ],
      correctIndex: 0,
      subject: "৩. Mathematics & Quantitative Aptitude",
      topic: "Arithmetic Numerical Abilities",
      difficulty: "Hard",
      explanations: {
        bn: "২৫% কাজের জন্য সময় লাগে ১২ দিন। বাকি থাকে ৭৫% কাজ (২৫% এর ৩ গুণ)। সুতরাং একই হারে বাকি ৭৫% কাজ করতে সময় লাগবে ১২ * ৩ = ৩৬ দিন।",
        en: "25% of work takes 12 days. The remaining 75% work (which is 3 times the existing part) will take 12 * 3 = 36 days.",
        wrongOptions: [
          "৪৮ দিন হচ্ছে সম্পূর্ণ কাজ করতে লাগা মোট সময়, 'কত অতিরিক্ত দিন' কাজের জন্য নয়।",
          "২৪ দিন হিসাবের অসতর্কতায় ২ গুণ হিসেব করায় আসে যা ভুল।"
        ]
      }
    },
    {
      id: "bank-gk-1",
      text: "Which of the following organizations handles real-time cross-border financial transactions and high-security messaging across global banks, including Bangladesh Bank?",
      options: [
        "SWIFT (Society for Worldwide Interbank Financial Telecommunication)",
        "IMF (International Monetary Fund)",
        "World Bank Group",
        "FEMA (Foreign Exchange Monetary Association)"
      ],
      correctIndex: 0,
      subject: "৪. General GK",
      topic: "International Banking & Trade",
      difficulty: "Medium",
      explanations: {
        bn: "SWIFT হল একটি স্বাধীন বৈশ্বিক উচ্চ-সুরক্ষিত ফিনান্সিয়াল মেসেজিং নেটওয়ার্ক, যার মাধ্যমে বাংলাদেশ ব্যাংক এবং অন্যান্য বাণিজ্যিক ব্যাংক আন্তর্জাতিক লেনদেন সম্পন্ন করে।",
        en: "SWIFT stands for Society for Worldwide Interbank Financial Telecommunication and coordinates global interbank transactions.",
        wrongOptions: [
          "IMF মূলত সদস্য দেশগুলির ভারসাম্য ও ঋণ ব্যবস্থা তদারকি করে।",
          "বিশ্বব্যাংক উন্নয়নশীল দেশসমূহের অবকাঠামোগত মূলধন সরবরাহকারী প্রতিষ্ঠান।"
        ]
      }
    }
  ];

  // Monitor mode and load appropriate question pools or dynamic generator
  useEffect(() => {
    setCompleted(false);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerConfirmed(false);
    setIsCertain(true);
    setEliminatedOptions([]);
    setAnswersSheet({});
    setIsCustomScrollMode(false);
    setEliminatedOptionsScroll({});

    // Filter baseline question set based on activeStream types
    let matchedPool: Question[] = [];
    if (currentMode.type === 'BCS') {
      matchedPool = questionPool.filter(q => q.id.startsWith('bcs-'));
    } else if (currentMode.type === 'Bank') {
      matchedPool = questionPool.filter(q => q.id.startsWith('bank-') || q.subject.includes('English') || q.subject.includes('গাণিতিক') || q.subject.includes('ICT') || q.subject.includes('বিজ্ঞান'));
    } else {
      matchedPool = [...questionPool];
    }

    if (matchedPool.length === 0) {
      matchedPool = [...questionPool];
    }
    setQuestions(matchedPool);
    setSecondsRemaining(customLength * 30); // 30 seconds per question
    setTotalTimeLimit(customLength * 30);
  }, [selectedExamMode, customLength]);

  // Timers
  useEffect(() => {
    if (isPaused || completed || activeTab !== 'simulation') return;
    if (secondsRemaining <= 0) {
      handleCompleteExam();
      return;
    }
    const timer = setTimeout(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [secondsRemaining, isPaused, completed, activeTab]);

  const handleSelectOption = (index: number) => {
    if (isAnswerConfirmed) return;
    setSelectedAnswer(index);
  };

  const handleSelectOptionForScrollMode = (qId: string, index: number) => {
    setAnswersSheet(prev => {
      const exists = prev[qId];
      if (exists && exists.answeredIndex === index) {
        // Toggle/deselect if desired, or set. Let's set.
        return {
          ...prev,
          [qId]: { answeredIndex: index, isCertain: prev[qId]?.isCertain ?? true }
        };
      }
      return {
        ...prev,
        [qId]: { answeredIndex: index, isCertain: true }
      };
    });
  };

  const handleToggleEliminationForScrollMode = (qId: string, index: number) => {
    setEliminatedOptionsScroll(prev => {
      const currentElims = prev[qId] || [];
      const updated = currentElims.includes(index)
        ? currentElims.filter(i => i !== index)
        : [...currentElims, index];
      return {
        ...prev,
        [qId]: updated
      };
    });
  };

  const handleToggleCertaintyForScrollMode = (qId: string) => {
    setAnswersSheet(prev => {
      const entry = prev[qId];
      if (!entry) return prev;
      return {
        ...prev,
        [qId]: { ...entry, isCertain: !entry.isCertain }
      };
    });
  };

  const handleToggleElimination = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnswerConfirmed) return;
    setEliminatedOptions(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleToggleBookmark = () => {
    const qId = questions[currentIdx]?.id;
    if (!qId) return;
    setBookmarked(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === null) return;
    
    const currentQ = questions[currentIdx];
    setAnswersSheet(prev => ({
      ...prev,
      [currentQ.id]: { answeredIndex: selectedAnswer, isCertain }
    }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
      setIsCertain(true);
      setEliminatedOptions([]);
    } else {
      // Dynamic AI question pull or complete
      setLoadingAdaptiveQ(true);
      
      // Calculate running performance accuracy for adaptive difficulty scaling
      let correctAnswers = 0;
      let totalAnswered = 0;
      const updatedAnswers = {
        ...answersSheet,
        [currentQ.id]: { answeredIndex: selectedAnswer, isCertain }
      };
      
      questions.forEach((q) => {
        const record = updatedAnswers[q.id];
        if (record) {
          totalAnswered++;
          if (record.answeredIndex === q.correctIndex) {
            correctAnswers++;
          }
        }
      });
      
      const sessionAccuracy = totalAnswered > 0 ? (correctAnswers / totalAnswered) : 0.5;
      let dynamicAdaptiveDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
      
      if (sessionAccuracy >= 0.70) {
        dynamicAdaptiveDifficulty = 'Hard';
      } else if (sessionAccuracy < 0.40) {
        dynamicAdaptiveDifficulty = 'Easy';
      }
      
      try {
        const response = await fetch("/api/ai/adaptive-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: currentQ.subject,
            topic: currentQ.topic,
            examType: currentMode.type,
            difficulty: dynamicAdaptiveDifficulty,
            questionLanguage: questionLanguage
          })
        });
        if (response.ok) {
          const newQ = await response.json();
          if (newQ && newQ.text && !questions.some(q => q.text === newQ.text)) {
            setQuestions(prev => [...prev, newQ]);
            setCurrentIdx(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerConfirmed(false);
            setIsCertain(true);
            setEliminatedOptions([]);
          } else {
            handleCompleteExam();
          }
        } else {
          handleCompleteExam();
        }
      } catch (err) {
        console.error("Adaptive Gen failed, calculating score", err);
        handleCompleteExam();
      } finally {
        setLoadingAdaptiveQ(false);
      }
    }
  };

  const handleCompleteExam = () => {
    let score = 0;
    let guessDetections = 0;
    const weakTopics: string[] = [];

    const finalAnswers = { ...answersSheet };
    if (!isCustomScrollMode && selectedAnswer !== null && questions[currentIdx]) {
      finalAnswers[questions[currentIdx].id] = { answeredIndex: selectedAnswer, isCertain };
    }

    questions.forEach((q) => {
      const record = finalAnswers[q.id];
      if (record) {
        const correct = record.answeredIndex === q.correctIndex;
        if (correct) {
          score += 1;
        } else {
          if (!weakTopics.includes(q.subject)) {
            weakTopics.push(q.subject);
          }
        }
        if (correct && !record.isCertain) {
          guessDetections += 1;
        }
      } else {
        if (!weakTopics.includes(q.subject)) {
          weakTopics.push(q.subject);
        }
      }
    });

    const timeSpent = totalTimeLimit - secondsRemaining;
    const accuracy = Math.round((questions.length ? (score / questions.length) : 0) * 100);
    
    // Scale stand-by standing placement percentile based on stream denominator
    const percentile = Math.min(99, Math.round((accuracy * 0.92) + 12));

    const results: NonNullable<ExamSession['results']> = {
      score,
      totalPossible: questions.length,
      timeSpentSeconds: timeSpent,
      accuracy,
      percentile,
      weakTopics: weakTopics.length > 0 ? weakTopics : ["English vocabulary building"],
      guessDetections,
      confidenceLevel: guessDetections > 1 ? 'Mixed' : 'High'
    };

    setSessionResults(results);
    setCompleted(true);
    onExamCompleted(results);

    // Save session outcome back to our database
    if (activeSessionId) {
      setExamHistory(prev => prev.map(item => {
        if (item.id === activeSessionId) {
          return {
            ...item,
            status: 'Completed',
            results: results
          };
        }
        return item;
      }));
    }
  };

  const getNormalizedAllocations = (
    totalLength: number,
    selectedSubjs: string[],
    subCounts: { [key: string]: number },
    topCounts: { [key: string]: number }
  ) => {
    let targets = selectedSubjs;
    if (targets.length === 0) {
      targets = [config.syllabus[0]?.name || "১. বাংলা ভাষা ও সাহিত্য"];
    }

    const activeElements: Array<{
      id: string;
      subject: string;
      topic: string | null;
      weight: number;
    }> = [];

    targets.forEach(subjName => {
      const subj = config.syllabus.find(s => s.name === subjName);
      if (!subj) return;

      const subjectTopicKeys = subj.topics.map(t => `${subj.name}::${t.name}`);
      const activeTopicKeys = Object.keys(topCounts).filter(k =>
        subjectTopicKeys.includes(k) && (topCounts[k] || 0) > 0
      );

      if (activeTopicKeys.length > 0) {
        subj.topics.forEach(t => {
          const topicKey = `${subj.name}::${t.name}`;
          const currentTopicWeight = topCounts[topicKey] || 0;
          if (currentTopicWeight > 0) {
            activeElements.push({
              id: topicKey,
              subject: subj.name,
              topic: t.name,
              weight: currentTopicWeight
            });
          }
        });
      } else {
        const weight = subCounts[subj.name] !== undefined ? subCounts[subj.name] : 3;
        activeElements.push({
          id: subj.name,
          subject: subj.name,
          topic: null,
          weight: weight
        });
      }
    });

    if (activeElements.length === 0) {
      return [];
    }

    const totalWeight = activeElements.reduce((sum, item) => sum + item.weight, 0);
    
    let allocatedSum = 0;
    const itemsWithCounts = activeElements.map(item => {
      const portion = totalWeight > 0 ? (item.weight / totalWeight) : (1 / activeElements.length);
      const idealCount = portion * totalLength;
      const roundedCount = Math.round(idealCount);
      allocatedSum += roundedCount;
      return {
        ...item,
        idealCount,
        count: roundedCount
      };
    });

    let diff = totalLength - allocatedSum;
    if (diff !== 0) {
      const indexedItems = itemsWithCounts.map((item, idx) => ({
        idx,
        remainder: item.idealCount - item.count,
        count: item.count
      }));

      if (diff > 0) {
        indexedItems.sort((a, b) => b.remainder - a.remainder);
        for (let i = 0; i < diff; i++) {
          const itemIdx = indexedItems[i % indexedItems.length].idx;
          itemsWithCounts[itemIdx].count += 1;
        }
      } else {
        indexedItems.sort((a, b) => a.remainder - b.remainder);
        let targetToSubtract = Math.abs(diff);
        for (let i = 0; i < targetToSubtract; i++) {
          const candidates = indexedItems.filter(x => itemsWithCounts[x.idx].count > 1);
          if (candidates.length > 0) {
            const bestChoice = candidates[0];
            itemsWithCounts[bestChoice.idx].count -= 1;
            bestChoice.count -= 1;
          } else {
            const bestChoice = indexedItems[i % indexedItems.length];
            if (itemsWithCounts[bestChoice.idx].count > 0) {
              itemsWithCounts[bestChoice.idx].count -= 1;
            }
          }
        }
      }
    }

    return itemsWithCounts.filter(x => x.count > 0).map(x => ({
      subject: x.subject,
      topic: x.topic,
      count: x.count
    }));
  };

  const handleCompileCustomExam = async () => {
    setIsCompiling(true);
    setCompilingError('');
    
    try {
      // Build allocations list dynamically based on independent selected customLength & weights
      const allocations = getNormalizedAllocations(customLength, selectedSubjects, subjectCounts, topicCounts);
      
      if (allocations.length === 0) {
        setIsCompiling(false);
        setCompilingError('অনুগ্রহ করে কমপক্ষে ১টি বিষয় বা টপিক সিলেক্ট করুন এবং প্রশ্নের সংখ্যা ১ বা তার বেশি দিন।');
        return;
      }
      
      const response = await fetch("/api/ai/batch-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: currentMode.type,
          role: (currentMode as any).role || "",
          difficulty: customDifficulty,
          allocations: allocations,
          subtopics: selectedSubtopics,
          questionType: selectedQuestionType,
          examMode: selectedExamModeSetting,
          questionLanguage: questionLanguage
        })
      });
      
      if (!response.ok) {
        throw new Error("সার্ভার থেকে প্রশ্ন তৈরিতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
      
      const data = await response.json();
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setIsFallbackActive(!!data.isFallback);
        recordSessionInHistory(data.questions, customDifficulty, selectedSubjects);
        setCurrentIdx(0);
        setSelectedAnswer(null);
        setIsAnswerConfirmed(false);
        setIsCertain(true);
        setEliminatedOptions([]);
        setAnswersSheet({});
        setIsCustomScrollMode(true);
        setEliminatedOptionsScroll({});
        
        const totalCalculatedSeconds = data.questions.length * 40;
        setSecondsRemaining(totalCalculatedSeconds);
        setTotalTimeLimit(totalCalculatedSeconds);
        setCompleted(false);
        setActiveTab('simulation');
      } else {
        throw new Error("এআই ইঞ্জিন কোনো প্রশ্ন উত্তর দেয়নি।");
      }
    } catch (err: any) {
      console.error("Batch compiling failed:", err);
      setCompilingError(err.message || "আইটি সিস্টেমে ইন্টারনাল প্রবলেম হয়েছে। কৃত্রিম বুদ্ধিমত্তা সচল রাখতে পুনরায় ট্রাই করুন।");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleStartNodePractice = (subject: string, topic: string) => {
    const topicQ = questionPool.filter(q => q.subject.includes(subject) || q.topic.includes(topic));
    const finalSet = topicQ.length > 0 ? topicQ : questionPool.slice(0, 3);
    setQuestions(finalSet);
    recordSessionInHistory(finalSet, 'Medium', [subject]);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerConfirmed(false);
    setIsCertain(true);
    setEliminatedOptions([]);
    setAnswersSheet({});
    setIsCustomScrollMode(false);
    setEliminatedOptionsScroll({});
    setSecondsRemaining(finalSet.length * 40);
    setTotalTimeLimit(finalSet.length * 40);
    setCompleted(false);
    setActiveTab('simulation');
  };

  const currentQuestion = questions[currentIdx];

  // Filtering Syllabus and mapping search results
  const filteredSyllabus = config.syllabus.filter(domain => {
    if (!searchQuery) return true;
    return domain.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           domain.topics.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className={`space-y-6 ${focusMode ? 'max-w-3xl mx-auto' : ''} text-slate-100`}>
      
      {/* Toast Notification for Google Drive/PDF Export */}
      {exportMessage && !confirmationExport && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-indigo-100 text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Visual Export Status Tracker Toast */}
      {confirmationExport && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 animate-fadeIn backdrop-blur text-left">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${
                confirmationExport.status === 'success' 
                  ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400' 
                  : confirmationExport.status === 'error'
                    ? 'bg-rose-950 border border-rose-500/30 text-rose-450'
                    : 'bg-purple-950 border border-purple-500/30 text-purple-400'
              }`}>
                {confirmationExport.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : confirmationExport.status === 'error' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                )}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">
                  {confirmationExport.type === 'PDF' ? 'PDF Export Generated' : 'Google Drive Core Synced'}
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  {confirmationExport.status === 'success' ? 'Ready to use' : confirmationExport.status === 'error' ? 'Failed' : 'Uploading...'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setConfirmationExport(null)}
              className="text-slate-500 hover:text-slate-350 transition-colors text-xs font-bold font-sans cursor-pointer p-0.5"
            >
              ✕
            </button>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 flex items-center gap-2.5">
            <FileText className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-300 block truncate" title={confirmationExport.fileName}>
                {confirmationExport.fileName}
              </span>
              <span className="text-[9px] font-mono text-slate-500 block uppercase">
                Format: {confirmationExport.type === 'PDF' ? 'document (.pdf)' : 'text sheet (.txt)'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {confirmationExport.linkUrl ? (
              <a 
                href={confirmationExport.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-550 hover:to-indigo-550 text-slate-950 text-[10.5px] font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View in Google Drive
              </a>
            ) : confirmationExport.type === 'PDF' ? (
              <button
                onClick={() => {
                  alert("অনুগ্রহ করে আপনার ব্রাউজারের প্রিন্ট ডায়ালগ অথবা লোকাল ডাউনলোড ফোল্ডার চেক করুন।");
                }}
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-650 text-slate-300 text-[10.5px] font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-none"
              >
                <FileDown className="w-3.5 h-3.5" /> Close Print Dialog
              </button>
            ) : (
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 leading-relaxed">
                  {confirmationExport.status === 'creating' ? 'Syncing securely with Google Workspace Node...' : confirmationExport.errorMsg || 'Process halted.'}
                </div>
                {confirmationExport.status === 'error' && (
                  <button
                    onClick={() => {
                      handleDownloadTextOffline(questions, "9Th Grade AI practice Sheet");
                    }}
                    className="w-full py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 text-[10.5px] font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" /> টেক্সট ফাইল (.txt) ডাউনলোড করুন
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Dynamic Profile/Stream Intelligence Header */}
      <div className={`p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden transition-all duration-300`}>
        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr ${config.accentColor === 'cyan' ? 'from-cyan-500/10' : config.accentColor === 'emerald' ? 'from-emerald-500/10' : 'from-purple-500/10'} blur-3xl pointer-events-none`}></div>
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono tracking-widest font-bold uppercase rounded px-2 py-0.5 border ${config.bgBadge}`}>
              {currentMode.type === 'Bank' ? 'BANGLADESH BANK 9TH GRADE' : 'BPSC BCS SYSTEM'}
            </span>
            <span className="text-[10px] bg-slate-950/60 text-slate-400 border border-slate-850 px-2 py-0.5 rounded font-mono">
              🎯 Diff: {config.baselineDifficulty}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
            {config.title}
          </h2>
          <p className="text-slate-400 text-xs">
            {config.subtitle}
          </p>
        </div>

        {/* Dynamic score prediction gauge */}
        <div className="flex items-center gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-850 z-10 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">Rank Stream Boundary</span>
            <span className={`text-md font-mono font-bold block ${config.accentColor === 'cyan' ? 'text-cyan-400' : config.accentColor === 'emerald' ? 'text-emerald-400' : 'text-purple-400'}`}>
              # {currentMode.type === 'BCS' ? '1,240 - 1,510' : currentMode.role?.includes('AD') ? '112 - 145' : '620 - 740'}
            </span>
            <span className="text-[8px] text-slate-500 block">Out of {config.rankDenominator} candidates</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">Target Accuracy</span>
            <span className="text-md font-mono font-bold block text-slate-200">
              {currentMode.type === 'Bank' && currentMode.role?.includes('Cash') ? '70%' : '82%'}
            </span>
            <span className="text-[8px] text-slate-500 block">Required passing bound</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs inside module */}
      <div className="flex border-b border-slate-900 gap-1 overflow-x-auto pb-px">
        {[
          { id: 'syllabus', label: 'Living Syllabus Tree', icon: Compass },
          { id: 'mastery', label: 'Syllabus Mastery Map', icon: Layout },
          { id: 'builder', label: 'AI Custom Builder', icon: Sliders },
          { id: 'simulation', label: 'Exam Terminal', icon: Terminal, disabled: questions.length === 0 },
          { id: 'history', label: 'Exam History logs', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => {
                const isActiveSession = activeTab === 'simulation' && !completed && questions.length > 0;
                if (isActiveSession && tab.id !== 'simulation') {
                  setPendingTab(tab.id as any);
                  setShowExitConfirm(true);
                } else {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'simulation' && completed) {
                    setCompleted(false);
                  }
                }
              }}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? `border-${config.accentColor}-400 text-${config.accentColor}-400 bg-${config.accentColor}-500/5` 
                  : tab.disabled 
                    ? 'opacity-30 cursor-not-allowed border-transparent text-slate-600'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER TAB CONTENTS */}

      {/* 1. SYLLABUS INTERACTIVE TREE GRAPH */}
      {activeTab === 'syllabus' && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* AI Advisor Card top */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3.5">
            <div className={`p-2 bg-gradient-to-tr ${config.primaryTheme} rounded-xl shadow-md flex-shrink-0`}>
              <Sparkles className="w-4 h-4 text-slate-250 animate-pulse" />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block font-bold">🤖 AI Syllabus Advisor</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentMode.type === 'BCS' 
                  ? 'আপনার সিলেবাস অনুযায়ী বাংলা সাহিত্য এবং আন্তর্জাতিক বিষয়াবলি থেকে সর্বাধিক হাই-ইয়েল্ডিং প্রশ্ন আসে। নিচে দেওয়া যেকোনো টপিকে ক্লিক করে সরাসরি প্র্যাকটিস সেট অথবা আপনার AI টিউটরের সংক্ষেপ ব্যাখ্যা বিশ্লেষণ শুরু করতে পারেন।' 
                  : `বাংলাদেশ ব্যাংক সিলেবাস অনুযায়ী গাণিতিক যুক্তি (Quantitative Aptitude) এবং ইংরেজি ব্যাকরণ অংশের প্রশ্ন বেশি জটিল হয়ে থাকে। AD পদের জন্য ম্যাথ অংশটি হার্ড বেঞ্চমার্কে সেট থাকবে।`}
              </p>
            </div>
          </div>

          {/* Search bar inside syllabus */}
          <div className="relative text-left">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text"
              placeholder="সিলেবাসের বিষয় বা টপিক খুঁজুন (যেমন: সমাস, Parts of Speech, সাধারণ বিজ্ঞান)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs focus:border-cyan-400 outline-none transition-colors placeholder:text-slate-600 font-sans text-white text-left"
            />
          </div>

          {/* Interactive tree of syllabus subjects */}
          <div className="grid grid-cols-1 gap-3 font-sans text-left">
            {filteredSyllabus.map((domain, domainIdx) => {
              const isExpanded = expandedSubjectIndex === domainIdx;
              return (
                <div 
                  key={domainIdx} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 text-left"
                >
                  <button
                    onClick={() => setExpandedSubjectIndex(isExpanded ? null : domainIdx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${domain.color}`} />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-205 text-slate-200">{domain.name}</span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          {currentMode.type === 'BCS' ? `পূর্ণমান: ${(domain as any).marks}` : `মান বণ্টন: ${(domain as any).weight}%`}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-850 p-4 space-y-3 bg-slate-950/20 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {domain.topics.map((t, idx) => (
                          <div 
                            key={idx} 
                            className="bg-slate-950/80 border border-slate-850 p-3.5 rounded-xl space-y-2 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-slate-200">{t.name}</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  t.mastery > 70 
                                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-950/20' 
                                    : 'bg-yellow-950/40 text-yellow-500 border border-yellow-900/20'
                                }`}>
                                  {t.mastery}%
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 block leading-relaxed font-mono capitalize">
                                {t.bcsNo || (t as any).match}
                              </span>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-900">
                              <button 
                                onClick={() => handleStartNodePractice(domain.name, t.name)}
                                className={`flex-1 py-1.5 px-2 bg-${config.accentColor}-400/10 hover:bg-${config.accentColor}-400 text-${config.accentColor}-400 hover:text-slate-950 duration-150 rounded text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer`}
                              >
                                <Play className="w-3 h-3" /> Practice (MCQ)
                              </button>
                              <button 
                                onClick={() => onTriggerTutor(domain.name, t.name)}
                                className="py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded text-[10px] font-semibold border border-slate-800 transition-all cursor-pointer"
                              >
                                Ask AI Tutor
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 2. SYLLABUS MASTERY MAP HEATMAP */}
      {activeTab === 'mastery' && (
        <div className="space-y-5 animate-fadeIn text-left">
          
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 text-left">
            <div className="flex justify-between items-center text-left font-sans">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-sans">Mastery Heatmap & National Placement Graph</h3>
              <span className="text-[10px] text-slate-500 font-mono">Total {config.syllabus.length} Domains Loaded</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
              এই বিষয়ভিত্তিক হিটম্যাপটি আপনার দক্ষতা নির্দেশ করে। সাবজেক্ট বা টপিক নোডে ক্লিক করুন এবং তাৎক্ষণিক AI প্র্যাকটিস অথবা লাইভ টেস্ট শুরু করুন।
            </p>
          </div>

          {/* Interactive Grid Map representing connected syllabus nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 font-sans text-left">
            {config.syllabus.flatMap(d => d.topics.map(t => ({ 
              subject: d.name, 
              topicName: t.name, 
              mastery: t.mastery, 
              trend: t.trend, 
              color: d.color 
            }))).map((node, idx) => {
              const isSelected = selectedMapNode?.topic === node.topicName;
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedMapNode({ subject: node.subject, topic: node.topicName, mastery: node.mastery })}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between h-36 text-left ${
                    isSelected 
                      ? 'bg-slate-950/85 border-purple-500/50 ring-2 ring-purple-500/20' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-705'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] opacity-65 font-mono uppercase tracking-wider block truncate">{node.subject}</span>
                    <h4 className="text-xs font-bold text-slate-202 text-slate-200 line-clamp-2">{node.topicName}</h4>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {/* Glowing master state level bar */}
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-indigo-500"
                        style={{ width: `${node.mastery}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-500">Mastery: <strong>{node.mastery}%</strong></span>
                      <span className={`font-bold ${node.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-450'}`}>{node.trend}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Node Details Side drawer detail card */}
          {selectedMapNode && (
            <div className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-4 animate-scaleUp font-sans text-left">
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] text-slate-550 uppercase font-mono tracking-widest font-bold">Selected Mastery Area</span>
                  <h4 className="text-sm font-extrabold text-white">{selectedMapNode.topic}</h4>
                  <span className="text-xs text-slate-400 font-mono block">{selectedMapNode.subject}</span>
                </div>
                <button 
                  onClick={() => setSelectedMapNode(null)}
                  className="text-xs text-slate-500 hover:text-white cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-850 text-left">
                  <span className="text-[9px] text-slate-550 uppercase font-bold block">Current Standing Index</span>
                  <span className="text-lg font-mono font-bold block text-purple-400 mt-1">{selectedMapNode.mastery}% Mastery Score</span>
                  <p className="text-[10.5px] text-slate-500 leading-normal mt-1.5 font-sans">You are in the 82nd percentile on this specific domain nationally compared to 12K active BPSC candidates.</p>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850 flex flex-col justify-between text-left">
                  <span className="text-[9px] text-slate-550 uppercase font-bold block text-left font-sans">Actionable AI Assistance</span>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => handleStartNodePractice(selectedMapNode.subject, selectedMapNode.topic)}
                      className="flex-1 py-2 bg-purple-500 text-slate-950 font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                    >
                      Adaptive Practice (১০টি MCQ)
                    </button>
                    <button 
                      onClick={() => {
                        onTriggerTutor(selectedMapNode.subject, selectedMapNode.topic);
                      }}
                      className="flex-1 py-1 px-2.5 bg-slate-800 hover:bg-slate-705 border border-slate-700 text-slate-350 rounded text-[10px] font-semibold transition-all cursor-pointer"
                    >
                      Bilingual Tutor Explanation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. AI CUSTOM EXAM BUILDER */}
      {activeTab === 'builder' && (() => {
        const currentAllocations = getNormalizedAllocations(customLength, selectedSubjects, subjectCounts, topicCounts);
        const totalDurationSeconds = customLength * 40; // 40 seconds per question standard

        return (
          <div className="p-6 md:p-8 bg-slate-900 rounded-3xl border border-slate-800 space-y-6 font-sans">
            
            <div className="space-y-1.5 border-b border-slate-850 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-400" /> AI Custom Examination Builder
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    আপনার সিলেক্টেড বিষয় ও টপিকের নির্দিষ্ট অনুপাত নির্ধারণ করে কৃত্রিম বুদ্ধিমত্তা দ্বারা কাস্টম পরীক্ষার বৈজ্ঞানিক পেপার তৈরি করুন।
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-2xl flex items-center gap-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Total Estimated Duration</span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {totalDurationSeconds}s Limit ({Math.floor(totalDurationSeconds / 60)}m Room)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
              
              {/* Left Column Settings */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Question Length Summary Indicator - Now fully independent & User's Hand controlled */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 text-left">
                  <span className="text-[10px] text-purple-400 font-mono font-bold tracking-widest block uppercase">Set Specific Question Count</span>
                  
                  <div className="space-y-3">
                    <label className="text-slate-350 text-[11px] font-medium block">
                      পরীক্ষায় মোট প্রশ্নের সংখ্যা নির্ধারণ করুন (Fully Custom / Independent):
                    </label>
                    
                    {/* Interactive custom entry counter */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                      <button
                        type="button"
                        onClick={() => setCustomLength(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-755 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-lg text-lg font-black cursor-pointer transition-all active:scale-95"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">
                        <input
                          type="number"
                          min="1"
                          max="300"
                          value={customLength}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              setCustomLength(Math.min(300, Math.max(1, val)));
                            }
                          }}
                          className="w-full text-center bg-transparent font-mono font-black text-2xl text-white outline-none focus:ring-0"
                        />
                        <span className="text-[9px] text-slate-500 font-mono block uppercase mt-0.5">Edit with your hand</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomLength(prev => Math.min(300, prev + 1))}
                        className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-755 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-lg text-lg font-black cursor-pointer transition-all active:scale-95"
                      >
                        +
                      </button>
                    </div>

                    {/* Preset quick buttons */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-medium font-sans">শর্টকাট প্রিসেট (Shortcuts Selection):</span>
                      <div className="grid grid-cols-5 gap-1 pt-1">
                        {[5, 10, 25, 50, 100].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCustomLength(num)}
                            className={`py-1.5 px-1 text-center font-mono font-bold rounded-lg border text-xs transition-colors cursor-pointer ${
                              customLength === num
                                ? 'bg-purple-950/50 border-purple-500 text-purple-400 font-black'
                                : 'bg-slate-900 border-slate-850 hover:bg-slate-800 text-slate-400'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-3 space-y-2">
                    <p className="flex items-center gap-1 text-purple-400/90 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>মোট কাস্টম প্রশ্নের টার্গেট: <strong className="font-mono text-white underline decoration-purple-500/50 decoration-2">{customLength} টি</strong></span>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      এআই নিচের বিষয় ও টপিকগুলোর আপেক্ষিক অনুপাত ঠিক রেখে আপনার নির্ধারিত <strong className="text-slate-400 font-mono">{customLength} টি</strong> প্রশ্নেই পেপারটি ব্যালেন্স করবে।
                    </p>
                  </div>
                </div>

                {/* Difficulty Scale Selection */}
                <div className="space-y-2 text-left">
                  <label className="text-slate-400 font-semibold uppercase font-mono tracking-wider block">Target Cognitive Level (পরীক্ষার জটিলতা)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setCustomDifficulty(diff as any)}
                        className={`py-2.5 border rounded-xl font-bold transition-all cursor-pointer ${
                          customDifficulty === diff 
                            ? 'bg-purple-950/40 border-purple-400 text-purple-400 ring-1 ring-purple-500/25 font-black' 
                            : 'bg-slate-900 border-slate-850 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {diff === 'Easy' ? 'সহজ' : diff === 'Medium' ? 'মাঝারি' : 'কঠিন'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exam Mode Settings */}
                <div className="space-y-2 text-left">
                  <label className="text-slate-400 font-semibold uppercase font-mono tracking-wider block">Exam Mode Configuration (পরীক্ষার ধরন)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Practice', label: 'Practice Mode', sub: 'Instant Solutions' },
                      { id: 'Mock', label: 'Standard Mock', sub: 'Timer & Final Score' },
                      { id: 'Live', label: 'Live Simulation', sub: 'Competitor Cohort' },
                      { id: 'Adaptive', label: 'Adaptive AI Test', sub: 'Dynamic Difficulty' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedExamModeSetting(mode.id)}
                        className={`p-2.5 border rounded-xl font-sans text-left transition-all cursor-pointer flex flex-col justify-between h-16 ${
                          selectedExamModeSetting === mode.id 
                            ? 'bg-purple-950/40 border-purple-400 text-purple-200 ring-1 ring-purple-500/25' 
                            : 'bg-slate-900 border-slate-850 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold block text-[11px]">{mode.label}</span>
                        <span className="text-[9px] text-slate-500 block leading-tight">{mode.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Type Selection */}
                <div className="space-y-2 text-left">
                  <label className="text-slate-400 font-semibold uppercase font-mono tracking-wider block">Question Formulation Type (প্রশ্ন কাঠামো)</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'All', label: 'All Formulate Types (সব ধরনের প্রশ্ন)' },
                      { id: 'Conceptual', label: 'Conceptual Focus (ধারণাগত ও তত্ত্ব ভিত্তিক)' },
                      { id: 'Numerical', label: 'Numerical Focus (গাণিতিক বা সমস্যা ভিত্তিক)' },
                      { id: 'Grammar', label: 'Grammar & Corrections (ব্যাকরণ ও বানানগত)' },
                      { id: 'Analytical', label: 'Analytical Core (গভীর যুক্তি ও বুদ্ধিদীপ্ত)' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedQuestionType(type.id)}
                        className={`p-2 px-3 border rounded-xl font-sans text-left transition-all cursor-pointer flex items-center justify-between ${
                          selectedQuestionType === type.id 
                            ? 'bg-purple-950/45 border-purple-400 text-purple-300' 
                            : 'bg-slate-900 border-slate-850 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold text-[10px]">{type.label}</span>
                        {selectedQuestionType === type.id && <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-2 text-left">
                  <label className="text-slate-400 font-semibold uppercase font-mono tracking-wider block flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span>Question Language (প্রশ্নের ভাষা)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Bangla', label: 'Bangla (বাংলা)', sub: 'Refined Academic Bengali' },
                      { id: 'English', label: 'English (ইংরেজি)', sub: 'Standard Academic English' }
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setQuestionLanguage(lang.id as any)}
                        className={`p-2 text-left border rounded-xl font-sans transition-all cursor-pointer flex flex-col justify-between h-14 ${
                          questionLanguage === lang.id 
                            ? 'bg-purple-950/45 border-purple-400 text-purple-300 ring-1 ring-purple-500/20' 
                            : 'bg-slate-900 border-slate-850 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold block text-[10px]">{lang.label}</span>
                        <span className="text-[8px] text-slate-500 block leading-tight">{lang.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column Custom Allocation Area */}
              <div className="lg:col-span-8 space-y-3 text-left font-sans">
                <label className="text-slate-400 font-semibold uppercase font-mono tracking-wider block">Syllabus Grid & Relative Ratios (বিষয় ও টপিক সংখ্যানুপাত সমন্বয়)</label>
                
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 pad-scroll scrollbar-thin text-left">
                  {config.syllabus.map((subj, idx) => {
                    const isChecked = selectedSubjects.includes(subj.name);
                    const isExpanded = expandedSubjects.includes(subj.name);
                    
                    // Compute dynamic info
                    const activeTopicAllocations = subj.topics.filter(t => (topicCounts[`${subj.name}::${t.name}`] || 0) > 0);
                    const hasTopicLevel = activeTopicAllocations.length > 0;
                    const currentSubCount = subjectCounts[subj.name] !== undefined ? subjectCounts[subj.name] : 3;
                    
                    // Allocated count for this subject
                    const allocatedSubjCount = currentAllocations.filter(item => item.subject === subj.name).reduce((sum, item) => sum + item.count, 0);

                    return (
                      <div 
                        key={idx}
                        className={`transition-all border rounded-2xl overflow-hidden ${
                          isChecked 
                            ? 'bg-slate-950/60 border-purple-900/35 shadow-inner' 
                            : 'bg-slate-950 border-slate-855/80'
                        }`}
                      >
                        <div className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSubjects(prev => 
                                  isChecked ? prev.filter(s => s !== subj.name) : [...prev, subj.name]
                                );
                              }}
                              className={`p-1.5 rounded-xl border flex-shrink-0 transition-all cursor-pointer ${
                                isChecked 
                                  ? 'bg-purple-950 border-purple-500 text-purple-400' 
                                  : 'bg-slate-900 border-slate-800 text-slate-600'
                              }`}
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                            
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-xs font-bold truncate ${isChecked ? 'text-purple-300' : 'text-slate-450'}`}>
                                {subj.name}
                              </h4>
                              {isChecked ? (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] bg-purple-955/80 border border-purple-900/50 text-purple-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase block w-fit">
                                    Allocated: {allocatedSubjCount} Qs
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-mono">
                                    Ratio Weight: {hasTopicLevel ? 'Topic-Based' : currentSubCount}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono block uppercase">
                                  Unselected
                                </span>
                              )}
                            </div>
                          </div>

                          {isChecked && (
                            <div className="flex items-center gap-3">
                              {/* Counter input for Parent Subject if no topic allocation is set */}
                              {!hasTopicLevel ? (
                                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                                  <span className="text-[10px] text-slate-500 font-medium font-sans">Weight:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSubjectCounts(prev => ({
                                        ...prev,
                                        [subj.name]: Math.max(1, currentSubCount - 1)
                                      }));
                                    }}
                                    className="w-5 h-5 flex items-center justify-center bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-350 rounded font-black cursor-pointer animate-none"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center font-mono font-bold text-white text-xs">{currentSubCount}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSubjectCounts(prev => ({
                                        ...prev,
                                        [subj.name]: Math.min(20, currentSubCount + 1)
                                      }));
                                    }}
                                    className="w-5 h-5 flex items-center justify-center bg-slate-855 hover:bg-slate-800 border border-slate-755 text-slate-300 rounded font-black cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-955/50 border border-cyan-900/30 px-2.5 py-1 rounded-xl">
                                  Topic Split Active
                                </span>
                              )}

                              {/* Collapse/Expand Topic button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedSubjects(prev => 
                                    isExpanded ? prev.filter(s => s !== subj.name) : [...prev, subj.name]
                                  );
                                }}
                                className="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                              >
                                {hasTopicLevel ? `Adjust Topics (${activeTopicAllocations.length})` : 'Topic Matrix'}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Expand topics list for checked and expanded subject */}
                        {isChecked && isExpanded && (
                          <div className="bg-slate-950 px-4 pb-4 pt-1 border-t border-slate-900 space-y-2 animate-fadeIn divide-y divide-slate-900">
                            <div className="pt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                              Topic Weighting and Allocation (টপিক অনুপাত):
                            </div>
                            {subj.topics.map((topicItem, tIdx) => {
                              const topicKey = `${subj.name}::${topicItem.name}`;
                              const topicValue = topicCounts[topicKey] || 0;
                              const topicAllocCount = currentAllocations.find(item => item.subject === subj.name && item.topic === topicItem.name)?.count || 0;
                              const subtopicsForThis = getSubtopicsForTopic(topicItem.name);

                              return (
                                <div key={tIdx} className="flex flex-col py-2.5 text-[11px] text-slate-350 first:pt-1">
                                  <div className="flex justify-between items-center">
                                    <div className="flex flex-col min-w-0 pr-2">
                                      <span className="font-semibold truncate text-slate-300">{topicItem.name}</span>
                                      {topicAllocCount > 0 && (
                                        <span className="text-[9px] text-cyan-400 font-mono font-semibold">
                                          Allocated: {topicAllocCount} Qs
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0 font-sans">
                                      <span className="text-[10px] text-slate-500 font-mono">Weight:</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTopicCounts(prev => ({
                                            ...prev,
                                            [topicKey]: Math.max(0, topicValue - 1)
                                          }));
                                        }}
                                        className="w-5 h-5 flex items-center justify-center bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded cursor-pointer animate-none"
                                      >
                                        -
                                      </button>
                                      <span className="w-5 text-center font-mono font-bold text-white text-[11px]">{topicValue}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTopicCounts(prev => ({
                                            ...prev,
                                            [topicKey]: Math.min(10, topicValue + 1)
                                          }));
                                        }}
                                        className="w-5 h-5 flex items-center justify-center bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded cursor-pointer animate-none"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Render Subtopic Matrix */}
                                  <div className="mt-1.5 pl-2 border-l border-slate-850 space-y-1.5">
                                    <span className="text-[9px] text-slate-550 uppercase font-mono tracking-wider block">Focus Subtopics Subsets:</span>
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                      {subtopicsForThis.map((sub, sIdx) => {
                                        const isSubSelected = selectedSubtopics.includes(sub);
                                        return (
                                          <button
                                            key={sIdx}
                                            type="button"
                                            onClick={() => {
                                              setSelectedSubtopics(prev => 
                                                isSubSelected 
                                                  ? prev.filter(item => item !== sub) 
                                                  : [...prev, sub]
                                              );
                                            }}
                                            className={`p-1 px-2 text-[9px] border rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                                              isSubSelected 
                                                ? 'bg-purple-950/40 border-purple-500/50 text-purple-350' 
                                                : 'bg-slate-900/60 border-slate-850 hover:bg-slate-800 text-slate-500'
                                            }`}
                                          >
                                            {isSubSelected && <span className="text-purple-400">✓</span>}
                                            <span>{sub}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* Compilation error and status trigger controls */}
            {compilingError && (
              <div className="p-4 bg-rose-950/30 border border-rose-900/40 text-rose-300 rounded-2xl flex items-center gap-3 animate-fadeIn text-xs text-left">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-450" />
                <div>
                  <strong className="block font-black uppercase text-rose-455">Compilation Error</strong>
                  <p className="mt-0.5">{compilingError}</p>
                </div>
              </div>
            )}

            {/* Intelligent selection overview tag list */}
            <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-left">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase font-bold block">Tailored Blueprints Compilation Summary</span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium">
                    🎯 Qs: {customLength}
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-[#a5b4fc] px-2 py-0.5 rounded-lg text-[10px] font-medium">
                    📊 Level: {customDifficulty === 'Easy' ? 'সহজ' : customDifficulty === 'Medium' ? 'মাঝারি' : 'কঠিন'}
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-purple-400 px-2 py-0.5 rounded-lg text-[10px] font-medium font-semibold">
                    ⚙️ Mode: {selectedExamModeSetting}
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-indigo-400 px-2 py-0.5 rounded-lg text-[10px] font-medium font-semibold">
                    📝 Type: {selectedQuestionType}
                  </span>
                  {selectedSubtopics.length > 0 && (
                    <span className="bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold">
                      💡 Subtopics Focus: {selectedSubtopics.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-550 leading-normal font-sans md:max-w-xs">
                {selectedSubjects.length === 0 
                  ? "কোনো বিষয় সিলেক্ট করা নেই। ক্লিক করলে আদর্শ সিলেবাস বিন্যাস অনুযায়ী এআই জেনারেট করবে।"
                  : `${selectedSubjects.length}টি বিষয় এবং নির্বাচিত সাব-টপিক অনুপাত অনুযায়ী প্রশ্নপত্রটি এআই কমপাইল করবে।`
                }
              </div>
            </div>

            <button
              onClick={handleCompileCustomExam}
              disabled={isCompiling}
              className={`w-full py-4.5 bg-gradient-to-r from-purple-400 to-indigo-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:scale-[1.005] active:opacity-90 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-purple-500/10 cursor-pointer ${
                isCompiling ? 'opacity-50 cursor-not-allowed saturate-50' : ''
              }`}
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="w-4.5 h-4.5 animate-spin" /> Compiling Simulated Paper with AI Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5" /> Compile Entire {customLength} Questions Set In Single Click
                </>
              )}
            </button>

          </div>
        );
      })()}








      {/* 4. MCQ ACTIVE TESTING TERMINAL */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {completed ? (
            <div className="space-y-6 animate-fadeIn text-left">
              
              {/* Scorecard Header */}
              <div className="p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono tracking-widest text-[#a5b4fc] uppercase block font-black">Practice Stream Result</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5.5 h-5.5 text-emerald-400" /> Exam Session Completed!
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Compact PDF Print Layout Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
                      <span className="px-1.5 text-slate-500 font-bold uppercase tracking-wider font-mono">Format:</span>
                      <button
                        type="button"
                        onClick={() => setPdfLayoutMode('concise')}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          pdfLayoutMode === 'concise'
                            ? 'bg-slate-800 text-cyan-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="অতি-সংক্ষেপ ২-কলাম বিন্যাস (কাগজ সর্বোচ্চ সাশ্রয় করবে)"
                      >
                        ⚡ Concise
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfLayoutMode('double')}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          pdfLayoutMode === 'double'
                            ? 'bg-slate-800 text-emerald-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="২-কলাম প্রিণ্ট বিন্যাস (কাগজ ও প্রিন্টিং খরচ বাঁচাবে)"
                      >
                        📄 Double
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfLayoutMode('single')}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          pdfLayoutMode === 'single'
                            ? 'bg-slate-850 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="১-কলাম সাধারণ প্রিণ্ট বিন্যাস"
                      >
                        📃 Single
                      </button>
                    </div>

                    {/* Compact Answers Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]" style={{ userSelect: 'none' }}>
                      <span className="px-1.5 text-slate-500 font-bold uppercase tracking-wider font-mono">Answers:</span>
                      <button
                        type="button"
                        onClick={() => setIncludeAnswersInPdf(true)}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          includeAnswersInPdf
                            ? 'bg-slate-800 text-emerald-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="উত্তরপত্র সহ প্রিণ্ট করুন"
                      >
                        ✓ Include
                      </button>
                      <button
                        type="button"
                        onClick={() => setIncludeAnswersInPdf(false)}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          !includeAnswersInPdf
                            ? 'bg-slate-800 text-rose-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="উত্তরমালা ছাড়া প্রিণ্ট করুন"
                      >
                        ✕ Exclude
                      </button>
                    </div>

                    <button
                      onClick={() => handlePrintExam(questions, "9Th Grade AI Practice Paper with Full Solutions", includeAnswersInPdf)}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Export Paper {includeAnswersInPdf ? '+ Solutions' : ''}
                    </button>
                    <button
                      disabled={isExportingGd}
                      onClick={() => handleExportGoogleDocs(questions, "9Th Grade AI Completed Exam Sheet")}
                      className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-400 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Export to Drive
                    </button>
                    <button
                      onClick={() => {
                        setCompleted(false);
                        setQuestions([]);
                        setCurrentIdx(0);
                        setSelectedAnswer(null);
                        setIsAnswerConfirmed(false);
                        setAnswersSheet({});
                        setSecondsRemaining(totalTimeLimit);
                        setActiveTab('builder');
                      }}
                      className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Build Another Exam
                    </button>
                  </div>
                </div>

                {/* Score indicators grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Obtained Score</span>
                    <span className={`text-2xl font-mono font-bold block text-${config.accentColor}-400 mt-1`}>
                      {sessionResults.score} <span className="text-xs text-slate-500">/ {sessionResults.totalPossible}</span>
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Accuracy Rate</span>
                    <span className="text-2xl font-mono font-bold block text-emerald-400 mt-1">
                      {sessionResults.accuracy}%
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-center">
                    <span className="text-[10px] text-slate-505 text-slate-500 block uppercase font-mono">National Percentile</span>
                    <span className="text-2xl font-mono font-bold block text-cyan-400 mt-1">
                      {sessionResults.percentile}th
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-center">
                    <span className="text-[10px] text-slate-520 text-slate-500 block uppercase font-mono">Guess Metrics</span>
                    <span className="text-2xl font-mono font-bold block text-yellow-500 mt-1">
                      {sessionResults.guessDetections} <span className="text-xs text-slate-500">guesses</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Cognitive gap decomposition lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-left">
                
                <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Syllabus Weaknesses Identified
                  </h4>
                  <p className="text-slate-404 text-slate-400">উক্ত পরীক্ষায় ভুল হওয়া বিষয়ের ওপর ভিত্তি করে AI নিচের টপিকগুলোতে পুনরায় রিভিশন দেবার পরামর্শ দিচ্ছে:</p>
                  
                  <div className="space-y-2">
                    {sessionResults.weakTopics.map((topic, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl flex justify-between items-center">
                        <span className="font-bold text-slate-300">{topic}</span>
                        <button
                          onClick={() => onTriggerTutor(topic, "Related test questions")}
                          className={`px-3 py-1 bg-${config.accentColor}-400 text-slate-950 font-bold rounded text-[9px] uppercase cursor-pointer`}
                        >
                          Tutor Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-cyan-400" /> What model students are doing
                  </h4>
                  <p className="text-slate-400 leading-relaxed font-sans">
                    {currentMode.type === 'BCS' 
                      ? '৯২তম পার্সেন্টাইলের ওপরে থাকা বিসিএস পরীক্ষার্থীরা সাধারণত সংবিধান এবং বিজ্ঞান অংশে গড়ে ৯০% এর বেশি সঠিক উত্তর দিয়ে থাকে। গাণিতিক সূত্রের অপপ্রয়োগ কমাতে প্রতিদিন স্পেসড মেমোরি ট্যাব থেকে প্র্যাকটিস করুন।'
                      : `বাংলাদেশ ব্যাংক AD অফিসার ক্যাডারের শিক্ষার্থীরা অ্যালোকেশন ও সময় সাশ্রয়ে প্রতিদিন অংক রিভিশন দেয়। ইংরেজি ভোকাবুলারি মনে রাখতে ফ্ল্যাশ কার্ড ব্যবহার করার অভ্যাস বাড়ান।`}
                  </p>
                  <div className="p-3 bg-indigo-950/40 border border-indigo-900/30 rounded-xl text-slate-300 leading-normal font-sans">
                    <strong>পরবর্তী পদক্ষেপ:</strong> আপনার দুর্বল টপিকগুলোতে পুনরায় AI টিউটরের সাহায্য চান, অথবা কাস্টম বিল্ডারে গিয়ে নতুন করে ১০ প্রশ্নের রিভিশন পরীক্ষা দিন।
                  </div>
                </div>

              </div>
              
            </div>
          ) : (
            <div className={`space-y-6 ${focusMode ? 'max-w-xl mx-auto' : ''}`}>
              
              {isFallbackActive && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl text-[11px] text-left flex items-start gap-2.5 leading-relaxed animate-fadeIn">
                  <span className="text-[13px] mt-0.5">⚡</span>
                  <div>
                    <span className="font-bold">সিল্যাবস ব্যাকআপ সামগ্রী সক্রিয় (Syllabus Backup Active):</span> উচ্চ ট্রাফিক বা এআই ইঞ্জিন লিমিটের কারণে 9Th Grade AI স্বয়ংক্রিয়ভাবে একটি আদর্শ প্রফেশনাল মডেল প্রশ্নের সেট প্রস্তুত করেছে। আপনার অনুশীলন কোনো ব্যাঘাত ছাড়াই সচল রয়েছে!
                  </div>
                </div>
              )}

              {/* Active Header Row */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] font-mono tracking-widest text-[#a5b4fc] block uppercase font-black">
                    DYNAMIC STREAM: {currentMode.type === 'Bank' ? currentMode.role : 'BCS Preliminary'}
                  </span>
                  <h3 className="text-md font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400 block" /> MCQ Practice Session
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  
                  {/* Timer view block */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}</span>
                  </div>

                  {/* Bookmark button */}
                  {!isCustomScrollMode && currentQuestion && (
                    <button
                      onClick={handleToggleBookmark}
                      className={`p-2.5 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 ${
                        bookmarked.includes(currentQuestion?.id) ? 'text-yellow-400' : 'text-slate-500'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl font-mono hover:bg-slate-850 text-[10px]"
                  >
                    {focusMode ? 'Normal space' : 'Focus Mode'}
                  </button>

                  <button
                    onClick={() => {
                      setPendingTab('builder');
                      setShowExitConfirm(true);
                    }}
                    className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/30 text-rose-400 rounded-xl font-mono text-[10px] flex items-center gap-1 cursor-pointer font-bold transition-all"
                  >
                    <LogOut className="w-3 h-3" />
                    Exit Session
                  </button>

                </div>
              </div>

              {/* Export Toolbar */}
              {questions.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans text-xs">
                  <div className="space-y-0.5 text-left">
                    <div className="font-bold text-slate-350 flex items-center gap-1.5 text-xs">
                      <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>অফলাইনে পরীক্ষা দিতে চান? (Take Exam Offline)</span>
                    </div>
                    <div className="text-slate-500 text-[10px]">এই কাস্টম টেস্টটি প্রিন্ট করে অফলাইনে প্র্যাকটিস করুন অথবা গুগল ড্রাইভে সংরক্ষণ করুন।</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto self-end sm:self-auto">
                    {/* Compact PDF Print Layout Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]" style={{ userSelect: 'none' }}>
                      <span className="px-1.5 text-slate-500 font-bold uppercase tracking-wider font-mono">Format:</span>
                      <button
                        type="button"
                        onClick={() => setPdfLayoutMode('concise')}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          pdfLayoutMode === 'concise'
                            ? 'bg-slate-800 text-cyan-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="অতি-সংক্ষেপ ২-কলাম বিন্যাস (কাগজ সর্বোচ্চ সাশ্রয় করবে)"
                      >
                        ⚡ Concise
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfLayoutMode('double')}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          pdfLayoutMode === 'double'
                            ? 'bg-slate-800 text-emerald-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="২-কলাম প্রিণ্ট বিন্যাস (কাগজ বাঁচাবে)"
                      >
                        📄 Double
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfLayoutMode('single')}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          pdfLayoutMode === 'single'
                            ? 'bg-slate-850 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="১-কলাম সাধারণ প্রিণ্ট বিন্যাস"
                      >
                        📃 Single
                      </button>
                    </div>

                    {/* Compact Answers Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]" style={{ userSelect: 'none' }}>
                      <span className="px-1.5 text-slate-500 font-bold uppercase tracking-wider font-mono">Answers:</span>
                      <button
                        type="button"
                        onClick={() => setIncludeAnswersInPdf(true)}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          includeAnswersInPdf
                            ? 'bg-slate-800 text-emerald-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="উত্তরপত্র সহ প্রিণ্ট করুন"
                      >
                        ✓ Include
                      </button>
                      <button
                        type="button"
                        onClick={() => setIncludeAnswersInPdf(false)}
                        className={`px-2 py-0.5 rounded-lg transition-all font-bold cursor-pointer ${
                          !includeAnswersInPdf
                            ? 'bg-slate-800 text-rose-400 font-extrabold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="উত্তরমালা ছাড়া প্রিণ্ট করুন"
                      >
                        ✕ Exclude
                      </button>
                    </div>

                    <button
                      onClick={() => handlePrintExam(questions, "9Th Grade AI Offline Exam Paper", includeAnswersInPdf)}
                      className="px-3.5 py-2 bg-emerald-555 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-bold rounded-xl text-[11px] whitespace-nowrap cursor-pointer transition-all flex items-center gap-1"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Save as PDF
                    </button>
                    <button
                      disabled={isExportingGd}
                      onClick={() => handleExportGoogleDocs(questions, "9Th Grade AI Exam Paper")}
                      className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-400 font-bold rounded-xl text-[11px] whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {isExportingGd ? 'Saving...' : 'Export to GDrive'}
                    </button>
                  </div>
                </div>
              )}

              {questions.length === 0 ? (
                <div className="text-center p-12 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 font-sans text-left">
                  <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
                  <p className="text-xs text-slate-400">সিলেবাসে কোনো প্র্যাকটিস কোয়েশ্চেন লোড করা হয়নি। অনুগ্রহ করে লিভিং সিলেবাস থেকে টপিক সিলেক্ট করুন অথবা AI কাস্টম বিল্ডারে কম্পাইল করুন।</p>
                </div>
              ) : isCustomScrollMode ? (
                // Scroll-based Layout for custom compiled assessments
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Compiled Batch details: <strong className="text-slate-200">{questions.length} Questions (All-at-once response active)</strong></span>
                    <span>Answering mechanism: <strong className="text-purple-400">Scroll and Tick directly</strong></span>
                  </div>

                  <div className="space-y-5">
                    {questions.map((q, idx) => {
                      const ansRecord = answersSheet[q.id];
                      const currentSelectedOpt = ansRecord ? ansRecord.answeredIndex : null;
                      const qCertain = ansRecord ? ansRecord.isCertain : true;
                      const qElims = eliminatedOptionsScroll[q.id] || [];
                      const isQBookmarked = bookmarked.includes(q.id);

                      return (
                        <div key={q.id} className="p-6 md:p-8 bg-slate-900 border border-slate-850 rounded-3xl space-y-5 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a5b4fc] block font-bold">
                              {idx + 1}. {q.subject} • {q.topic}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {/* Difficulty Badge */}
                              <span className="text-[9px] font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-cyan-400 capitalize">
                                {q.difficulty}
                              </span>
                              {/* Individual question Bookmark toggle */}
                              <button
                                onClick={() => {
                                  setBookmarked(prev => 
                                    prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]
                                  );
                                }}
                                className={`p-1.5 bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-850 transition-colors cursor-pointer ${
                                  isQBookmarked ? 'text-yellow-400' : 'text-slate-500'
                                }`}
                                title="Bookmark Question"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm md:text-[14px] font-bold leading-normal text-slate-200">
                            {q.text}
                          </p>

                          {/* Options Mapping Grid */}
                          <div className="grid grid-cols-1 gap-2.5 font-sans text-xs">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = currentSelectedOpt === optIdx;
                              const isEliminated = qElims.includes(optIdx);

                              return (
                                <div
                                  key={optIdx}
                                  onClick={() => {
                                    handleSelectOptionForScrollMode(q.id, optIdx);
                                  }}
                                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                    isSelected 
                                      ? `bg-${config.accentColor}-950/20 border-${config.accentColor}-400 text-white font-semibold ring-1 ring-${config.accentColor}-400/20` 
                                      : isEliminated
                                        ? 'opacity-30 bg-slate-950/30 border-transparent text-slate-600 line-through'
                                        : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-350'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center border transition-colors ${
                                      isSelected 
                                        ? `bg-` + config.accentColor + `-400 text-slate-950 border-` + config.accentColor + `-400` 
                                        : 'border-slate-800 bg-slate-900 text-slate-500'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="text-slate-300 font-medium">{opt}</span>
                                  </div>

                                  {/* Scratchpad Option Crossing */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleEliminationForScrollMode(q.id, optIdx);
                                    }}
                                    className={`p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-rose-455 transition-colors border border-slate-808 ${
                                      isEliminated ? 'text-rose-400' : 'text-slate-500 hover:text-slate-400'
                                    }`}
                                    title="Crossing elimination scratchpad"
                                  >
                                    <EyeOff className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          {/* Individual low certainty flag */}
                          {currentSelectedOpt !== null && (
                            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 flex items-center justify-between">
                              <div className="text-[10px]">
                                <span className="text-slate-400 font-semibold block text-left"> নিশ্চিত নাকি অনুমান? (Are you Certain?)</span>
                                <span className="text-slate-500 block text-[9px] text-left">অনুমান করা উত্তর ভুল হলে মেধাক্রম মূল্যায়নে এআই বিশ্লেষণ যোগ করা হবে।</span>
                              </div>
                              <button
                                onClick={() => handleToggleCertaintyForScrollMode(q.id)}
                                className={`px-2.5 py-1 rounded font-mono text-[9px] font-bold uppercase border transition-colors cursor-pointer ${
                                  qCertain 
                                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
                                    : 'bg-yellow-950/40 text-yellow-500 border-yellow-850/40'
                                }`}
                              >
                                {qCertain ? '✓ Certain' : '⚠ Guessing'}
                              </button>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                  {/* Submit actions block */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-900 font-sans justify-between items-center bg-slate-950/20 p-4 rounded-2xl border border-slate-900">
                    <span className="text-xs text-slate-400 font-medium font-sans">
                      ✓ মোট {Object.keys(answersSheet).length}টি প্রশ্নের উত্তর নির্বাচন করেছেন।
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCompleteExam}
                        className={`px-6 py-3 bg-${config.accentColor}-400 hover:opacity-95 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg`}
                      >
                        Finish and Score Custom Paper ({questions.length} Qs)
                      </button>
                    </div>
                  </div>

                </div>
              ) : currentQuestion ? (
                // Step-by-Step Question Presentation
                <div className="space-y-5 text-left animate-fadeIn">
                  
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Progress indicator: <strong className="text-slate-200">{currentIdx + 1} of {questions.length}</strong></span>
                    <span className="capitalize font-mono">Difficulty: <strong className="text-cyan-400">{currentQuestion.difficulty}</strong></span>
                  </div>

                  {/* Question Prompt Card */}
                  <div className="p-6 md:p-8 bg-slate-900 border border-slate-850 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block font-bold">
                        {currentQuestion.subject} • {currentQuestion.topic}
                      </span>
                    </div>

                    <p className="text-sm md:text-[15px] font-bold leading-normal text-slate-200">
                      {currentQuestion.text}
                    </p>

                    {/* Options Mapping Grid */}
                    <div className="grid grid-cols-1 gap-2.5 font-sans text-xs">
                      {currentQuestion.options.map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isEliminated = eliminatedOptions.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => !isAnswerConfirmed && handleSelectOption(idx)}
                            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected 
                                ? `bg-${config.accentColor}-950/20 border-${config.accentColor}-400 text-white` 
                                : isEliminated
                                  ? 'opacity-30 bg-slate-950/30 border-transparent text-slate-600 line-through'
                                  : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center border ${
                                isSelected ? `bg-${config.accentColor}-400 text-slate-950 border-${config.accentColor}-400` : 'border-slate-800 bg-slate-900 text-slate-500'
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="font-medium text-slate-300">{opt}</span>
                            </div>

                            {/* Elimination crossing tool button */}
                            {!isAnswerConfirmed && (
                              <button
                                onClick={(e) => handleToggleElimination(idx, e)}
                                className={`p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-rose-400 transition-colors border border-slate-800 ${
                                  isEliminated ? 'text-rose-400' : 'text-slate-500'
                                }`}
                                title="Eliminate option"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Low Certainty toggles */}
                    {selectedAnswer !== null && !isAnswerConfirmed && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between font-sans">
                        <div className="text-[11px]">
                          <span className="font-semibold block text-slate-300">Are you Certain about this answer?</span>
                          <span className="text-slate-500 block text-[10px]">Unchecking flags this answer as a guess in standing prediction analytics.</span>
                        </div>
                        <button
                          onClick={() => setIsCertain(!isCertain)}
                          className={`px-3 py-1 rounded font-mono text-[9px] font-bold uppercase border transition-colors ${
                            isCertain 
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
                              : 'bg-yellow-950/40 text-yellow-500 border-yellow-800/40'
                          }`}
                        >
                          {isCertain ? '✓ Certain' : '⚠ Guessing'}
                        </button>
                      </div>
                    )}

                    {/* Explanations panel if committed */}
                    {isAnswerConfirmed && (
                      <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/15 space-y-4 font-sans text-left">
                        <div>
                          <span className="text-[10px] text-indigo-400 font-mono uppercase block font-semibold tracking-wider">Explanations & Solutions (সমাধান ও বিশ্লেষণ)</span>
                          <div className="mt-2 text-xs text-slate-300 leading-relaxed space-y-2">
                            <p className="font-medium text-slate-200">🇧🇩 বাংলা সমাধান:</p>
                            <p className="pl-3 border-l border-slate-800">{currentQuestion.explanations?.bn}</p>
                            
                            {currentQuestion.explanations?.en && (
                              <>
                                <p className="font-medium text-slate-200 mt-3">🇬🇧 English Explanation:</p>
                                <p className="pl-3 border-l border-slate-800 text-slate-400 italic">{currentQuestion.explanations.en}</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Wrong Options Explanations */}
                        {currentQuestion.explanations?.wrongOptions && currentQuestion.explanations.wrongOptions.length > 0 && (
                          <div className="pt-2 border-t border-slate-900">
                            <span className="text-[9px] text-rose-400 font-mono uppercase block font-semibold tracking-wider">Distractor Analysis (কেন ভুল বিকল্পগুলি ভুল?)</span>
                            <ul className="mt-2 text-[11px] text-slate-400 space-y-1.5 list-disc pl-4">
                              {currentQuestion.explanations.wrongOptions.map((wrongDesc: string, wIdx: number) => (
                                <li key={wIdx}>{wrongDesc}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Psychometric & Quality Metrics */}
                        <div className="pt-3 border-t border-slate-900 grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 font-mono uppercase block">Syllabus Concept</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/40 text-indigo-300 border border-indigo-900/30 inline-block">
                              {currentQuestion.concept || 'Foundational'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 font-mono uppercase block">Cognitive Dimension</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-900/30 inline-block capitalize">
                              {currentQuestion.cognitiveDimension || 'Applied Knowledge'}
                            </span>
                          </div>
                        </div>

                        {currentQuestion.recruitmentRelevance && (
                          <div className="pt-2 border-t border-slate-900 text-[11px]">
                            <span className="text-[9px] text-emerald-400 font-mono uppercase block font-semibold">Recruitment Relevance (পরীক্ষক দৃষ্টিভঙ্গি)</span>
                            <p className="mt-1 text-slate-400 italic">{currentQuestion.recruitmentRelevance}</p>
                          </div>
                        )}

                        {/* Panel Quality Scores */}
                        {currentQuestion.overallQualityScore && (
                          <div className="pt-3 border-t border-slate-900">
                            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono uppercase">
                              <span>BPSC/IBA Panel Assessment Score</span>
                              <span className="text-emerald-400 font-bold">{currentQuestion.overallQualityScore}/100</span>
                            </div>
                            <div className="mt-1.5 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                                style={{ width: `${currentQuestion.overallQualityScore}%` }}
                              />
                            </div>
                            <div className="mt-2 grid grid-cols-5 gap-1 text-center font-mono text-[8px] text-slate-500">
                              <div>
                                <span className="block text-slate-400">{currentQuestion.uniquenessScore || 85}</span>
                                <span>UNIQ</span>
                              </div>
                              <div>
                                <span className="block text-slate-400">{currentQuestion.difficultyScore || 75}</span>
                                <span>DIFF</span>
                              </div>
                              <div>
                                <span className="block text-slate-400">{currentQuestion.conceptDepthScore || 80}</span>
                                <span>DPTH</span>
                              </div>
                              <div>
                                <span className="block text-slate-400">{currentQuestion.syllabusRelevanceScore || 90}</span>
                                <span>RELV</span>
                              </div>
                              <div>
                                <span className="block text-slate-400">{currentQuestion.distractorQualityScore || 85}</span>
                                <span>DSTR</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Actions buttons bottom panel */}
                  <div className="flex justify-between items-center font-sans">
                    {!isAnswerConfirmed && selectedAnswer !== null ? (
                      <button
                        onClick={() => setIsAnswerConfirmed(true)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-705 text-xs text-slate-300 font-bold rounded-xl"
                      >
                        Confirm Answer Formulation
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleCompleteExam}
                        className="px-4 py-2.5 border border-slate-800 text-slate-400 hover:text-slate-300 text-xs rounded-xl"
                      >
                        Finish and Score paper
                      </button>

                      {loadingAdaptiveQ ? (
                        <div className="px-5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs flex items-center gap-1.5 text-slate-400">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" /> Synthesizing adaptive question...
                        </div>
                      ) : (
                        <button
                          disabled={selectedAnswer === null}
                          onClick={handleNextQuestion}
                          className={`px-5 py-2.5 bg-${config.accentColor}-400 hover:opacity-95 text-slate-950 font-bold rounded-xl text-xs uppercase flex items-center gap-1 disabled:opacity-40 cursor-pointer`}
                        >
                          {currentIdx === questions.length - 1 ? 'Finish Dynamic Check' : 'Proceed to next question'}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ) : null}

            </div>
          )}

        </div>
      )}

      {/* 5. HISTORY & RECENT EXAMS DATABASE */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#a5b4fc] block uppercase font-bold">Personal learning ledger</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5 font-sans">
              <History className="w-5 h-5 text-indigo-400" /> Exam History & Questions Database
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              এআই কাস্টম বিল্ডার এবং মডিউল থেকে তৈরি করা সকল প্রশ্নপত্র এখানে সময়, তারিখ ও পারফরম্যান্স বিশ্লেষণ সহ অফলাইন প্র্যাকটিসের জন্য সংরক্ষিত আছে।
            </p>
          </div>

          {examHistory.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <History className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-300">কোনো হিস্টোরি রেকর্ড পাওয়া যায়নি (No history matches)</p>
                <p className="text-xs text-slate-500">এআই কাস্টম বিল্ডারে গিয়ে নতুন একটি কাস্টম পরীক্ষা তৈরি করলে তার সম্পূর্ণ হিস্টোরি এখানে সংরক্ষিত হবে।</p>
              </div>
              <button
                onClick={() => setActiveTab('builder')}
                className={`mt-2 px-4 py-2 bg-${config.accentColor}-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer`}
              >
                Go to AI Custom Builder
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/20 p-3 rounded-xl border border-slate-900 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-medium font-sans">মোট সেশন: {examHistory.length} টি</span>
                  
                  {/* Global Layout Switcher for Log History Prints */}
                  <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-[#1e293b] text-[9px]" style={{ userSelect: 'none' }}>
                    <span className="px-1 text-slate-500 font-extrabold uppercase tracking-wider font-mono">PDF:</span>
                    <button
                      type="button"
                      onClick={() => setPdfLayoutMode('concise')}
                      className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer ${
                        pdfLayoutMode === 'concise'
                          ? 'bg-slate-850 text-cyan-400 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="অতি-সংক্ষেপ ২-কলাম বিন্যাস"
                    >
                      ⚡ Concise
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfLayoutMode('double')}
                      className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer ${
                        pdfLayoutMode === 'double'
                          ? 'bg-slate-850 text-emerald-400 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="২-কলাম প্রিণ্ট বিন্যাস"
                    >
                      📄 Double
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfLayoutMode('single')}
                      className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer ${
                        pdfLayoutMode === 'single'
                          ? 'bg-slate-850 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="১-কলাম সাধারণ বিন্যাস"
                    >
                      📃 Single
                    </button>
                  </div>

                  {/* Compact Answers Switcher for History */}
                  <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-[#1e293b] text-[9px]" style={{ userSelect: 'none' }}>
                    <span className="px-1 text-slate-500 font-extrabold uppercase tracking-wider font-mono">Answers:</span>
                    <button
                      type="button"
                      onClick={() => setIncludeAnswersInPdf(true)}
                      className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer ${
                        includeAnswersInPdf
                          ? 'bg-slate-850 text-emerald-400 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="উত্তরত্র সহ প্রিণ্ট করুন"
                    >
                      ✓ Include
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncludeAnswersInPdf(false)}
                      className={`px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer ${
                        !includeAnswersInPdf
                          ? 'bg-slate-850 text-rose-400 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="উত্তরমালা ছাড়া প্রিণ্ট করুন"
                    >
                      ✕ Exclude
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm("আপনি কি নিশ্চিতভাবে সম্পূর্ণ পরীক্ষার ইতিহাস মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না।")) {
                      setExamHistory([]);
                    }
                  }}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear Database
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 font-sans text-xs">
                {examHistory.map((session, idx) => {
                  return (
                    <div 
                      key={session.id || idx} 
                      className="p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700/80 transition-all space-y-4 text-left"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-850 pb-3 font-sans">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-slate-955 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-[#a5b4fc] font-semibold font-mono">
                              {session.mode} Stream
                            </span>
                            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-cyan-400 font-mono">
                              Diff: {session.difficulty || 'Medium'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ⏱️ Total Qs: {session.questionCount}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-550 text-slate-500 block">
                            তৈরির সময়: <strong>{session.dateString}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {session.status === 'Completed' ? (
                            <span className="text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2.5 py-1 rounded-lg">
                              ✓ Completed
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-yellow-950/40 text-yellow-500 border border-yellow-900/40 px-2.5 py-1 rounded-lg animate-pulse">
                              ⏳ In Progress
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Display performance micro-card if completed */}
                      {session.results && (
                        <div className="grid grid-cols-3 gap-3 bg-slate-950/40 border border-slate-850 p-3.5 rounded-2xl">
                          <div>
                            <span className="text-[8px] text-[#94a3b8] uppercase block font-mono">Score Obtained</span>
                            <strong className="text-sm font-mono text-slate-200">
                              {session.results.score} <span className="text-[10px] text-slate-500 font-mono">/ {session.results.totalPossible}</span>
                            </strong>
                          </div>
                          <div>
                            <span className="text-[8px] text-[#94a3b8] uppercase block font-mono">Accuracy Rate</span>
                            <strong className="text-sm font-mono text-emerald-400">
                              {session.results.accuracy}%
                            </strong>
                          </div>
                          <div>
                            <span className="text-[8px] text-[#94a3b8] uppercase block font-mono">Predicted Percentile</span>
                            <strong className="text-sm font-mono text-cyan-400">
                              {session.results.percentile}th
                            </strong>
                          </div>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-400 text-left">
                        <strong className="text-slate-300">অংশভুক্ত বিষয় ও টপিক:</strong> {session.subjects.join(', ')}
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2">
                        {/* Offline practice tools */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePrintExam(session.questions, `9Th Grade AI Offline Exam - ${session.mode}`, includeAnswersInPdf)}
                            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Print or Save as PDF"
                          >
                            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                            PDF Sheet
                          </button>
                          <button
                            disabled={isExportingGd}
                            onClick={() => handleExportGoogleDocs(session.questions, `9Th Grade AI ${session.mode} Online Sheet`)}
                            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                            title="Upload plain text practice file to Google Drive"
                          >
                            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                            To Google Drive
                          </button>
                        </div>

                        {/* Reload to Practice Room */}
                        <button
                          onClick={() => {
                            setQuestions(session.questions);
                            setActiveSessionId(session.id);
                            setCurrentIdx(0);
                            setSelectedAnswer(null);
                            setIsAnswerConfirmed(false);
                            setAnswersSheet({});
                            setIsCustomScrollMode(true);
                            setSecondsRemaining(session.questions.length * 40);
                            setTotalTimeLimit(session.questions.length * 40);
                            
                            if (session.status === 'Completed' && session.results) {
                              setSessionResults(session.results);
                              setCompleted(true);
                            } else {
                              setCompleted(false);
                            }
                            setActiveTab('simulation');
                          }}
                          className={`px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-[10px] uppercase cursor-pointer transition-all flex items-center gap-1`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Load Practice Terminal
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. EXIT CONFIRMATION DIALOG */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with fade animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowExitConfirm(false);
                setPendingTab(null);
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Dialog Content Container with spring slide-in */}
            <motion.div
              initial={{ y: 50, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-left overflow-hidden z-10"
            >
              {/* Top abstract line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600" />

              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    পরীক্ষা থেকে বের হতে চান?
                  </h3>
                  <p className="text-[10px] font-mono tracking-widest text-[#a5b4fc] uppercase block font-black">
                    Unsaved Exam Session In Progress
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-350 leading-relaxed font-sans">
                <p>
                  চলতি পরীক্ষার অগ্রগতি হারিয়ে যাবে। আপনি কি নিশ্চিত যে আপনি সেশনটি বন্ধ করতে চান?
                </p>
                <p className="text-slate-500">
                  Leaving now will discard your selected answers and stop the active session timer. Any un-submitted progress will be permanently lost.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    setPendingTab(null);
                  }}
                  className="flex-1 py-3 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  ফিরে যান (Stay & Resume)
                </button>
                <button
                  onClick={() => {
                    // Reset Active Session
                    setQuestions([]);
                    setCurrentIdx(0);
                    setSelectedAnswer(null);
                    setIsAnswerConfirmed(false);
                    setAnswersSheet({});
                    
                    if (pendingTab) {
                      setActiveTab(pendingTab);
                    } else {
                      setActiveTab('builder');
                    }
                    setShowExitConfirm(false);
                    setPendingTab(null);
                  }}
                  className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer text-center shadow-lg shadow-rose-950/20"
                >
                  বের হয়ে যান (Exit Session)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
