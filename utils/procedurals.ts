export interface LocalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  subject: string;
  topic: string;
  difficulty: string;
  explanations: {
    bn: string;
    en: string;
    wrongOptions: string[];
  };
}

export const SYLLABUS_CORPUS: Record<string, LocalQuestion[]> = {
  bangla: [
    {
      text: "বাঙলা ভাষার প্রথম স্বার্থক উপন্যাস ‘দুর্গেশনন্দিনী’ সাহিত্যসম্রাট বঙ্কিমচন্দ্র চট্টোপাধ্যায় কর্তৃক কোন সালে ভারতের হুগলি থেকে প্রকাশিত হয়?",
      options: ["১৮৬৫ সালে", "১৮৫২ সালে", "১৮৬৪ সালে", "১৮৭২ সালে"],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "খ. आधुनिक যুগ (১৮০০-বর্তমান পর্যন্ত) (সাহিত্য)",
      difficulty: "Medium",
      explanations: {
        bn: "১৮৬৫ সালে বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের প্রথম বাংলা উপন্যাস 'দুর্গেশনন্দিনী' প্রকাশিত হয়। এটি বাংলা সাহিত্যের প্রথম সার্থক উপন্যাস হিসেবে সমাদৃত।",
        en: "Durgeshnondini, published in 1865, is considered the first successful Bengali novel, written by Bankim Chandra Chattopadhyay.",
        wrongOptions: [
          "১৮৫২ সালে তারাশঙ্কর তর্করত্নের কাদম্বরী অনূদিত হয়েছিল।",
          "১৮৭২ সালে বঙ্কিমচন্দ্রের বিখ্যাত মাসিক পত্রিকা 'বঙ্গদর্শন' প্রথম প্রকাশিত হয়।"
        ]
      }
    },
    {
      text: "চর্যাপদের টিকাকারের নাম কি এবং তিনি চর্যাপদের পদগুলো কোন ভাষায় ব্যাখ্যা করেছিলেন?",
      options: ["মুনিদত্ত, সংস্কৃত ভাষা", "হরপ্রসাদ শাস্ত্রী, বাংলা ভাষা", "ড. মুহম্মদ শহীদুল্লাহ, তিব্বতি ভাষা", "কাহ্নপা, পালি ভাষা"],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "ক. প্রাচীন ও মধ্যযুগ (সাহিত্য)",
      difficulty: "Hard",
      explanations: {
        bn: "চর্যাপদের তিব্বতি অনুবাদের উপর ভিত্তি করে এর সংস্কৃত ব্যাখ্যা বা টীকা প্রস্তুত করেছিলেন মুনিদত্ত। তাঁর টীকাটি না থাকলে চর্যাপদের অনেক রহস্যময় ও সান্ধ্য ভাষার অর্থ উদ্ধার করা সম্ভব হতো না।",
        en: "Munidatta edited and translated Charyapada's cryptic verses into Sanskrit commentary.",
        wrongOptions: [
          "হরপ্রসাদ শাস্ত্রী ১৯০৭ সালে চর্যাপদের পুথি আবিষ্কার করেন, টীকা লিখেননি।",
          "ড. মুহম্মদ শহীদুল্লাহ চর্যাপদের কালনির্ণয় ও ভাষাতাত্ত্বিক বিশ্লেষণে অবদান রেখেছিলেন।"
        ]
      }
    },
    {
      text: "বাঙলা সাহিত্যের মধ্যযুগের প্রথম নিদর্শন 'শ্রীকৃষ্ণকীর্তন' কাব্যটি বড়ু চণ্ডীদাস কর্তৃক রচিত। বসন্তরঞ্জন রায় বিদ্বদ্বল্লভ এটি কোন সাল এবং স্থান থেকে উদ্ধার করেছিলেন?",
      options: [
        "১৯০৯ সালে দেবেন্দ্রনাথ মুখোপাধ্যায়ের গোয়ালঘর থেকে",
        "১৯০৭ সালে নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে",
        "১৮১৬ সালে শ্রীরামপুর মিশনের কাঠের সিন্দুক থেকে",
        "১৯১৬ সালে বঙ্গীয় সাহিত্য পরিষদের আর্কাইভ থেকে"
      ],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "ক. প্রাচীন ও মধ্যযুগ (সাহিত্য)",
      difficulty: "Hard",
      explanations: {
        bn: "১৯০৯ সালে পশ্চিমবঙ্গের বাঁকুড়া জেলার কাকিল্যা গ্রামের দেবেন্দ্রনাথ মুখোপাধ্যায়ের গোয়ালঘর থেকে বসন্তরঞ্জন রায় বিদ্বদ্বল্লভ কর্তৃক শ্রীকৃষ্ণকীর্তনের পুঁথিটি আবিষ্কৃত হয় এবং ১৯১৬ সালে তা প্রকাশিত হয়।",
        en: "Srikrishnakirtan was discovered in 1909 by Basanta Ranjan Roy from a cowshed in Bankura and published in 1916.",
        wrongOptions: [
          "১৯০৭ সালে নেপালের রাজদরবার থেকে হরপ্রসাদ শাস্ত্রী চর্যাপদ আবিষ্কার করেছিলেন।",
          "১৮১৬ সালে শ্রীরামপুর মিশন থেকে বাংলা ভাষায় প্রথম মুদ্রিত কোনো গ্রন্থ প্রকাশিত হয়েছিল।"
        ]
      }
    },
    {
      text: "কোনটি ঈশ্বরচন্দ্র বিদ্যাসাগরের প্রথম মৌলিক গদ্য রচনা হিসেবে সর্বমহলে স্বীকৃত?",
      options: ["প্রভাবতী সম্ভাষণ", "বেতাল পঞ্চবিংশতি", "শকুন্তলা", "ভ্রান্তিবিলাস"],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "খ. আধুনিক যুগ (১৮০০-বর্তমান পর্যন্ত) (সাহিত্য)",
      difficulty: "Medium",
      explanations: {
        bn: "১৮৬৩ সালে রচিত 'প্রভাবতী সম্ভাষণ' ঈশ্বরচন্দ্র বিদ্যাসাগরের প্রথম মৌলিক গদ্য রচনা (যা তাঁর অকালপ্রয়াত বান্ধবকন্যা প্রভাবতীর স্মরণে রচিত)। তাঁর পূর্ববর্তী গ্রন্থগুলো ছিল সংস্কৃত বা ইংরেজি থেকে অনুবাদ বা অনুলিখন।",
        en: "'Probhaboti Sombhashon' (1863) is recognized as Ishwar Chandra Vidyasagar's first original Bengali prose composition.",
        wrongOptions: [
          "বেতাল পঞ্চবিংশতি (১৮৪৭) বিদ্যাসাগরের প্রথম প্রকাশিত অনুবাদ গ্রন্থ, যা দিয়ে বাংলা গদ্যের যুগ শুরু হয়।",
          "ভ্রান্তিবিলাস (১৮৬৯) উইলিয়াম শেক্সপিয়রের 'কমেডি অব এররস' নাটকের একটি বিখ্যাত বাংলা গদ্য অনুবাদ।"
        ]
      }
    },
    {
      text: "বন্যেরা বনে সুন্দর, শিশুরা মাতৃক্রোড়ে— এই বিখ্যাত উক্তিটি সঞ্জীবচন্দ্র চট্টোপাধ্যায়ের কোন কালজয়ী রচনার অংশ?",
      options: ["পালামৌ", "জাল প্রতাপচাঁদ", "কণ্ঠমালা", "মাধবীলতা"],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "খ. আধুনিক যুগ (১৮০০-বর্তমান পর্যন্ত) (সাহিত্য)",
      difficulty: "Medium",
      explanations: {
        bn: "উক্তিটি সঞ্জীবচন্দ্র চট্টোপাধ্যায়ের বিখ্যাত ভ্রমণকাহিনী 'পালামৌ'-এর অংশ। এটি বাংলা ভ্রমণ সাহিত্যের অন্যতম প্রথম ও সার্থক নিদর্শন।",
        en: "The quote is taken from Palamau, a celebrated travelogue written by Sanjib Chandra Chattopadhyay.",
        wrongOptions: [
          "জাল প্রতাপচাঁদ সঞ্জীবচন্দ্রের একটি ঐতিহাসিক উপন্যাস যা ভাওয়াল রাজার কাহিনীর মতো এক সন্ন্যাসী রাজাকে কেন্দ্র করে রচিত।"
        ]
      }
    },
    {
      text: "\"সব ঝিনুকে মুক্তা মেলে না\"— এই বাক্যে 'ঝিনুকে' শব্দটি কোন কারকে কোন বিভক্তির উৎকৃষ্ট উদাহরণ?",
      options: ["অপাদানে সপ্তমী", "অধিকরণে সপ্তমী", "করণে সপ্তমী", "কর্তায় সপ্তমী"],
      correctIndex: 0,
      subject: "১. বাংলা ভাষা ও সাহিত্য",
      topic: "প্রযোগ-অপপ্রয়োগ, বানান ও বাক্য শুদ্ধি",
      difficulty: "Medium",
      explanations: {
        bn: "বাক্যটিতে 'ঝিনুকে মুক্তা মেলে না' বলতে বোঝানো হয়েছে ঝিনুক থেকে বা ঝিনুক হতে মুক্তা পাওয়া যায় না। কোনো কিছু হতে উৎপন্ন, চলিত, ভীত বা গৃহীত হলে তা অপাদান কারক হয় এবং 'এ/তে' বিভক্তির কারণে এটি সপ্তমী বিভক্তি।",
        en: "Here, 'Jhinuke' indicates the source from which pearls are obtained, hence it is Ablative Case with Locative Ending (7th inflection).",
        wrongOptions: [
          "অধিকরণ কারক কোনো ক্রিয়া সম্পাদনের স্থান বা সময়কে নির্দেশ করে, যা এখানে উৎস হিসেবে প্রকাশ পাওয়ায় ভুল।"
        ]
      }
    }
  ],
  english: [
    {
      text: "Identify the word with the correct spelling indicating an excessive interest in oneself or self-centered behavior:",
      options: ["Egocentrism", "Egocentrisim", "Egoecentrism", "Egoicentrism"],
      correctIndex: 0,
      subject: "২. English Language & Literature",
      topic: "F. Words: Spellings & Formations",
      difficulty: "Medium",
      explanations: {
        bn: "সঠিক বানানটি হল 'Egocentrism' (E-g-o-c-e-n-t-r-i-s-m), যার অর্থ আত্মকেন্দ্রিকতা বা সব বিষয়ে নিজেকে প্রধান মনে করা।",
        en: "Egocentrism is the correct spelling, representing the cognitive bias where a person believes the world revolves around them.",
        wrongOptions: [
          "Egocentrisim-এ অতিরিক্ত 'i' রয়েছে যা অশুদ্ধ বানান রূপ ধারণ করে।"
        ]
      }
    },
    {
      text: "Fill in the blank with the appropriate subjunctive verb: 'The Chief Economist insisted that the central bank _______ monetary tightening policies with immediate effect.'",
      options: ["tighten", "tightens", "tightened", "should tighten"],
      correctIndex: 0,
      subject: "২. English Language & Literature",
      topic: "D. Corrections",
      difficulty: "Hard",
      explanations: {
        bn: "যেহেতু প্রধান বাক্যে 'insisted' ক্রিয়াপদটি রয়েছে (যা আদেশ, অনুরোধ বা অনড় অবস্থান নির্দেশক Subjunctive নির্দেশ করে), তাই 'that' ক্লজের পরবর্তী Verb-টি সর্বদাই Base Form বা সাধারণ মূল রূপে হবে। সুতরাং 'tighten' সঠিক।",
        en: "The verb 'insist' triggers the subjunctive mood in the noun clause, requiring the base form of the verb ('tighten') regardless of the subject's tense or count.",
        wrongOptions: [
          "tightens সাধারণ Present tense-এ বসে কিন্তু subjunctive গঠনে Base form-এর বাইরে 's' বা 'es' যুক্ত হতে পারে না।",
          "should tighten ব্রিটিশ ব্যাকরণে ব্যবহৃত হলেও মার্কিন ও মানসম্মত বিসিএস/আইবিএ পরীক্ষায় bare infinitive tighten-কে অগ্রাধিকার দেওয়া হয়।"
        ]
      }
    },
    {
      text: "What is the most appropriate conceptual meaning of the idiomatic phrase 'To play fast and loose'?",
      options: [
        "To act in an unreliable, inconsistent, and irresponsible manner",
        "To gamble recklessly with public money or assets",
        "To finish a complex task at breakneck speeds",
        "To abide by official regulations with reluctance"
      ],
      correctIndex: 0,
      subject: "২. English Language & Literature",
      topic: "B. Idioms & Phrases",
      difficulty: "Medium",
      explanations: {
        bn: "'To play fast and loose' ইডিয়মটির অর্থ হল দায়িত্বজ্ঞানহীনভাবে আচরণ করা, কখনো একরকম আবার কখনো অন্যরকম করা, বা নির্ভরযোগ্যতা হারানো।",
        en: "'To play fast and loose' means to behave in an inconstant, irresponsible, or untruthful way, frequently changing one's attitude or commitments.",
        wrongOptions: [
          "জুয়া খেলার অর্থ বা দ্রুত কাজ করার অর্থগুলোর সাথে এই প্রবাদটির কোনো ঐতিহাসিক ও আক্ষরিক সংযোগ নেই।"
        ]
      }
    },
    {
      text: "Select the pair that best expresses a relationship similar to that expressed in the original pair (IBA Standard Analogy):\nINIMICAL : FRIENDLY ::",
      options: [
        "Obdurate : Yielding",
        "Hostile : Aggressive",
        "Avaricious : Greedy",
        "Laconic : Brief"
      ],
      correctIndex: 0,
      subject: "২. English Language & Literature",
      topic: "F. Words: Meanings, Synonyms & Antonyms",
      difficulty: "Hard",
      explanations: {
        bn: "Inimical (শত্রুভাবাপন্ন/প্রতিকূল) শব্দটির বিপরীতার্থক শব্দ হলো Friendly (বন্ধুভাবাপন্ন)। একইভাবে, Obdurate (একগুঁয়ে/অনমনীয়) শব্দের বিপরীত শব্দ হলো Yielding (নমনীয়/বশ্যতাস্বীকারকারী)। সুতরাং এটি একটি Antonym relationship।",
        en: "Inimical is the antonym of Friendly. Similarly, Obdurate (stubborn/unyielding) is the antonym of Yielding. This is a perfect antonymous match.",
        wrongOptions: [
          "Hostile ও Aggressive সমার্থক জোড় (Synonyms)।",
          "Avaricious (লোভী) এবং Greedy ও সমার্থক জোড়।",
          "Laconic (সংক্ষিপ্তভাষী) এবং Brief পরস্পর সমার্থক শব্দ।"
        ]
      }
    },
    {
      text: "Who is known as the 'Poet of Nature' in English Literature and who authored the groundbreaking 'Lyrical Ballads' alongside Samuel Taylor Coleridge in 1798?",
      options: ["William Wordsworth", "John Keats", "Percy Bysshe Shelley", "Alfred Lord Tennyson"],
      correctIndex: 0,
      subject: "২. English Language & Literature",
      topic: "H. English Literature",
      difficulty: "Medium",
      explanations: {
        bn: "উইলিয়াম ওয়ার্ডসওয়ার্থকে ইংরেজি সাহিত্যের 'Poet of Nature' বা প্রকৃতির কবি বলা হয়। ১৭৯৮ সালে তাঁর এবং স্যামুয়েল টেইলর কোলরিজের যৌথ কাব্য সংকলন 'Lyrical Ballads' প্রকাশের মধ্য দিয়েই ইংরেজি সাহিত্যে রোমান্টিক যুগের সূচনা ঘটে।",
        en: "William Wordsworth is called the Poet of Nature. The publication of 'Lyrical Ballads' in 1798 by Wordsworth and Coleridge marked the beginning of the Romantic Period.",
        wrongOptions: [
          "জন কিটস হলেন 'Poet of Beauty' বা সৌন্দর্যের কবি।",
          "পি বি শেলি হলেন 'Poet of Revolution' বা বৈপ্লবিক কবি।"
        ]
      }
    }
  ],
  bangladesh: [
    {
      text: "১৯৭১ সালের মহান মুক্তিযুদ্ধের সময় তৎকালীন অস্থায়ী বাংলাদেশ সরকার বা 'মুজিবনগর সরকার' কত তারিখে আনুষ্ঠানিকভাবে স্বাধীনতার ঘোষণাপত্র (Proclamation of Independence) জারি করে এবং শপথ গ্রহণ করে?",
      options: [
        "১০ই এপ্রিল ১৯৭১ ও ১৭ই এপ্রিল ১৯৭১",
        "২৬শে মার্চ ১৯৭১ ও ১০ই এপ্রিল ১৯৭১",
        "১৭ই এপ্রিল ১৯৭১ ও ২৫শে মে ১৯৭১",
        "১০ই এপ্রিল ১৯৭১ ও ১৬ই ডিসেম্বর ১৯৭১"
      ],
      correctIndex: 0,
      subject: "৩. বাংলাদেশ বিষয়াবলি",
      topic: "১. বাংলাদেশের জাতীয় বিষয়াবলি",
      difficulty: "Hard",
      explanations: {
        bn: "১৯৭১ সালের ১০ই এপ্রিল মেহেরপুরের মুজিবনগরে অস্থায়ী বাংলাদেশ সরকার আনুষ্ঠানিকভাবে গঠিত হয় এবং সেদিনই স্বাধীনতার ঘোষণাপত্র জারি করা হয়। এরপর ১৭ই এপ্রিল ১৯৭১ সালে এই সরকারের মন্ত্রীপরিষদ আনুষ্ঠানিকভাবে শপথ গ্রহণ করে।",
        en: "The Mujibnagar Government was formed and the Proclamation of Independence was adopted on 10 April 1971. The cabinet took oath on 17 April 1971 at Baidyanathtala, Meherpur.",
        wrongOptions: [
          "২৬শে মার্চ বঙ্গবন্ধুর স্বাধীনতার ঘোষণা প্রদানের দিন যা পরে তফসিলে যুক্ত করা হয়েছে।"
        ]
      }
    },
    {
      text: "গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের কোন অনুচ্ছেদের বা আর্টিকেলের অধীনে সুপ্রিম কোর্টের হাইকোর্ট বিভাগ মৌলিক অধিকার বলবৎকরণের জন্য রিট (Writs) জারি করার একচ্ছত্র আইনি একতিয়ার লাভ করে?",
      options: ["অনুচ্ছেদ ১০২", "অনুচ্ছেদ ৪৪", "অনুচ্ছেদ ১০৪", "অনুচ্ছেদ ৯৪"],
      correctIndex: 0,
      subject: "৩. বাংলাদেশ বিষয়াবলি",
      topic: "৬. বাংলাদেশের সংবিধান",
      difficulty: "Medium",
      explanations: {
        bn: "সংবিধানের ১০২ নম্বর অনুচ্ছেদ অনুযায়ী কোনো নাগরিকের মৌলিক অধিকার লঙ্ঘিত হলে সুপ্রিম কোর্টের হাইকোর্ট বিভাগ ৫ ধরনের রিট (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) জারির মাধ্যমে তা বলবৎ করতে পারে।",
        en: "Article 102 of the Constitution of Bangladesh empowers the High Court Division to issue writs for the enforcement of fundamental rights.",
        wrongOptions: [
          "৪৪ নং অনুচ্ছেদে মৌলিক অধিকার বলবৎ করার মৌলিক অধিকারের নিশ্চয়তা প্রদান করা হয়েছে, তবে বিচারিক রিট ক্ষমতার উৎস ১০২ অনুচ্ছেদ।",
          "১০৪ নং অনুচ্ছেদ আপিল বিভাগের পূর্ণাঙ্গ ন্যায়বিচারের আদেশ জারি সংক্রান্ত আইনি ক্ষমতা।"
        ]
      }
    },
    {
      text: "বাংলাদেশ সংবিধানের কোন সংশোধনীর মাধ্যমে যুদ্ধাপরাধীদের বিচারের আইনী গ্যারান্টি এবং তাদের বিচারের জন্য বিশেষ ট্রাইব্যুনাল গঠনের সংশোধনী আনা হয়েছিল, যা 'প্রথম সংশোধনী' হিসেবে পরিচিত?",
      options: [
        "প্রথম সংশোধনী আইন, ১৯৭৩",
        "দ্বিতীয় সংশোধনী আইন, ১৯৭৩",
        "চতুর্থ সংশোধনী আইন, ১৯৭৫",
        "পঞ্চম সংশোধনী আইন, ১৯৭৯"
      ],
      correctIndex: 0,
      subject: "৩. বাংলাদেশ বিষয়াবলি",
      topic: "৬. বাংলাদেশের সংবিধান",
      difficulty: "Hard",
      explanations: {
        bn: "১৯৭৩ সালে গৃহীত প্রথম সংশোধনীর মাধ্যমে সংবিধানে ৪৭(৩) অনুচ্ছেদ যুক্ত করে ১৯৭১ সালের মানবতাবিরোধী অপরাধ, গণহত্যা ও যুদ্ধাপরাধীদের বিচারের জন্য বিশেষ সামরিক বা আইনগত ট্রাইব্যুনাল গঠনের আইনী সুরক্ষা দেয়া হয়।",
        en: "The First Amendment in 1973 was specifically passed to pave the way for trials of genocide, war crimes, and crimes against humanity during the 1971 Liberation War.",
        wrongOptions: [
          "দ্বিতীয় সংশোধনীতে জরুরি অবস্থা ও নিবর্তনমূলক আটক আদেশ সংবিধানে যুক্ত করা হয়।",
          "চতুর্থ সংশোধনীর মাধ্যমে সংসদীয় শাসন ব্যবস্থার পরিবর্তে রাষ্ট্রপতিশাসিত ব্যবস্থা এবং বাকশাল গঠিত হয়েছিল।"
        ]
      }
    }
  ],
  international: [
    {
      text: "১৯৪৪ সালের ঐতিহাসিক জাতিসংঘ মুদ্রা ও আর্থিক সম্মেলনের (Bretton Woods Conference) মাধ্যমে কোন দুটি অত্যন্ত প্রভাবশালী বৈশ্বিক আর্থিক প্রতিষ্ঠান বা 'ব্রেটন উডস ইনস্টিটিউশনস' গড়ে উঠেছিল?",
      options: [
        "বিশ্বব্যাংক (IBRD) ও আন্তর্জাতিক মুদ্রা তহবিল (IMF)",
        "বিশ্ব বাণিজ্য সংস্থা (WTO) ও আঙ্কটাড (UNCTAD)",
        "এশীয় অবকাঠামো বিনিয়োগ ব্যাংক (AIIB) ও নিউ ডেভেলপমেন্ট ব্যাংক (NDB)",
        "ইউরোপীয় কেন্দ্রীয় ব্যাংক (ECB) ও ফেডারেল রিজার্ভ সিস্টেম"
      ],
      correctIndex: 0,
      subject: "৪. আন্তর্জাতিক বিষয়াবলি",
      topic: "আন্তর্জাতিক আর্থিক ও বাণিজ্য সংগঠনসমূহ",
      difficulty: "Medium",
      explanations: {
        bn: "১৯৪৪ সালের জুলাই মাসে যুক্তরাষ্ট্রের নিউ হ্যাম্পশায়ারের ব্রেটন উডসে ৪৪টি দেশের প্রতিনিধি দল মুদ্রা ও আর্থিক সম্মেলনে মিলিত হয়। সেখানে আলোচনার ভিত্তিতে বিশ্বব্যাংক (IBRD) এবং আন্তর্জাতিক মুদ্রা তহবিল (IMF) প্রতিষ্ঠিত হয়, যার কারণে এদের ব্রেটন উডস টুইনস বা ইনস্টিটিউশনস বলা হয়।",
        en: "The Bretton Woods Conference in 1944 established the International Bank for Reconstruction and Development (now part of World Bank Group) and the International Monetary Fund (IMF).",
        wrongOptions: [
          "WTO প্রতিষ্ঠিত হয় ১৯৯৫ সালে মারাক্কেশ চুক্তির মাধ্যমে, ব্রেটন উডসের বহু পরে।"
        ]
      }
    },
    {
      text: "জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব মোকাবেলায় এবং বৈশ্বিক গ্রিনহাউস গ্যাস নির্গমন হ্রাসের আইনি বাধ্যবাধকতা নিশ্চিত করতে ১৯৯৭ সালে কোন আন্তর্জাতিক প্রোটোকলটি স্বাক্ষরিত হয়েছিল?",
      options: ["Kyoto Protocol", "Montreal Protocol", "Cartagena Protocol", "Paris Agreement"],
      correctIndex: 0,
      subject: "৪. আন্তর্জাতিক বিষয়াবলি",
      topic: "পরিবেশ ও বৈশ্বিক জলবায়ু চুক্তি",
      difficulty: "Medium",
      explanations: {
        bn: "১৯৯৭ সালে জাপানের কিয়োটো শহরে 'কিয়োটো প্রোটোকল' স্বাক্ষরিত হয়, যার লক্ষ্য ছিল উন্নত দেশসমূহে শিল্পোৎপাদন থেকে উৎপন্ন ক্ষতিকর গ্রিনহাউস গ্যাসের নির্গমন হ্রাস করা। এটি ২০০৫ সাল থেকে আনুষ্ঠানিকভাবে কার্যকর হয়।",
        en: "The Kyoto Protocol was adopted in Kyoto, Japan, in 1997, aiming to commit state parties to reduce greenhouse gas emissions based on the scientific consensus on global warming.",
        wrongOptions: [
          "Montreal Protocol (১৯৮৭) ওজোন স্তর রক্ষায় ও সিএফসি গ্যাস নিয়ন্ত্রণ সংক্রান্ত চুক্তি।",
          "Cartagena Protocol হলো বায়োসেফটি বা জীবনিরাপত্তা সংক্রান্ত একটি বিশেষ চুক্তি।"
        ]
      }
    }
  ],
  math: [
    {
      text: "ক একটি কাজ ১০ দিনে শেষ করতে পারে এবং খ একই কাজ ১৫ দিনে শেষ করতে পারে। তারা একসাথে কাজটি করা শুরু করার ৩ দিন পর ক চলে গেল। বাকি কাজ খ একা কত দিনে শেষ করতে পারবে?",
      options: ["৭.৫ দিনে", "৪.৫ দিনে", "৬ দিনে", "৯ দিনে"],
      correctIndex: 0,
      subject: "৮. গাণিতিক যুক্তি",
      topic: "১. পাটিগণিত",
      difficulty: "Hard",
      explanations: {
        bn: "ক ও খ একসাথে ১ দিনে করে = (১/১০ + ১/১৫) = ১/৬ অংশ।\nঅতএব, ৩ দিনে তারা সম্পন্ন করে = ৩ * (১/৬) = ১/২ অংশ কাজ।\nবাকি থাকে = (১ - ১/২) = ১/২ অংশ কাজ।\nখ সম্পূর্ণ কাজ একা করে ১৫ দিনে।\nঅতএব, বাকি ১/২ অংশ কাজ করতে খ-এর সময় লাগবে = ১৫ * (১/২) = ৭.৫ দিন।",
        en: "A's 1 day work = 1/10, B's 1 day work = 1/15. Combined 1 day work = 1/10 + 1/15 = 1/6. In 3 days they complete 3 * 1/6 = 1/2 of the work. Remaining work = 1 - 1/2 = 1/2. B completes 1 unit work in 15 days, so 1/2 unit work takes 15 * 1/2 = 7.5 days.",
        wrongOptions: [
          "৪.৫ দিন সাধারণ হিসাবের ভুলে ক এর অবদানের দ্বিগুণ ধরলে আসতে পারে।"
        ]
      }
    },
    {
      text: "A manufacturer increases the price of an electronic device by 20%. Due to weak market demand, he then offers a 20% discount on the newly set price. What is the net percentage change in the price of the device?",
      options: ["4% decrease", "No change", "2% decrease", "4% increase"],
      correctIndex: 0,
      subject: "৩. Mathematics & Quantitative Aptitude",
      topic: "Arithmetic Numerical Abilities",
      difficulty: "Hard",
      explanations: {
        bn: "ধরি ডিভাইসটির প্রাথমিক মূল্য ১০০ টাকা। ২০% বৃদ্ধির পর নতুন মূল্য হবে ১২০ টাকা।\nএবার ১২০ টাকার উপর ২০% ছাড় দিলে ছাড়ের পরিমাণ = ১২০ * (২০/১০০) = ২৪ টাকা।\nঅতএব, চূড়ান্ত মূল্য = ১২০ - ২৪ = ৯৬ টাকা।\nসুতরাং, নেট পরিবর্তন = ১০০ - ৯৬ = ৪ টাকা হ্রাস (বা ৪% হ্রাস)।\nসহজ সূত্র: x + y + xy/100 = 20 - 20 + (20 * -20)/100 = -4% (হ্রাস)।",
        en: "Let initial price be 100. After 20% increase, it becomes 120. A 20% discount on 120 is 120 * 0.20 = 24. Final price = 120 - 24 = 96. This represents a 4% decrease. Using percentage change formula: a + b + ab/100 = 20 - 20 + (20 * -20)/100 = -4%.",
        wrongOptions: [
          "অনেকে মনে করেন ২০% বৃদ্ধি এবং ২০% হ্রাস পরস্পর কাটাকাটি হয়ে 'No change' হবে, যা একটি সাধারণ ভুল ধারণা।"
        ]
      }
    },
    {
      text: "৫টি সংখ্যার গড় ৪৫। প্রথম ৩টি সংখ্যার গড় ৪২ এবং শেষ ৩টি সংখ্যার গড় ৪৮ হলে, তৃতীয় সংখ্যাটির সুনির্দিষ্ট মান কত?",
      options: ["৪৫", "৪৩", "৪৭", "৪১"],
      correctIndex: 0,
      subject: "৮. গাণিতিক যুক্তি",
      topic: "১. পাটিগণিত",
      difficulty: "Medium",
      explanations: {
        bn: "ধরি সংখ্যাগুলো হলো a, b, c, d, e।\n৫টি সংখ্যার সমষ্টি = ৫ * ৪৫ = ২২৫।\nপ্রথম ৩টি সংখ্যার সমষ্টি (a+b+c) = ৩ * ৪২ = ১২৬।\nশেষ ৩টি সংখ্যার সমষ্টি (c+d+e) = ৩ * ৪৮ = ১৪৪।\nউভয় সমষ্টির যোগফল = ১২৬ + ১৪৪ = ২৭০ (এখানে c সংখ্যাটি দুবার গণনা করা হয়েছে)।\nঅতএব, ৩য় সংখ্যাটি (c) = ২৭০ - ২২৫ = ৪৫।",
        en: "Sum of 5 numbers = 5 * 45 = 225. Sum of first 3 numbers = 3 * 42 = 126. Sum of last 3 numbers = 3 * 48 = 144. Summing both gives 126 + 144 = 270. Since the third number 'c' is included in both subgroups, c = 270 - 225 = 45.",
        wrongOptions: [
          "অন্য বিকল্পগুলো হিসাবের সময় যোগ বা গুণ ভুল করলে চলে আসতে পারে।"
        ]
      }
    }
  ],
  it: [
    {
      text: "IPv4 এবং IPv6 ইন্টারনেট প্রোটোকল অ্যাড্রেস বা নেটওয়ার্ক অ্যাড্রেসগুলো যথাক্রমে কত বিট (Bits) নিয়ে গঠিত হয়?",
      options: ["৩২ বিট এবং ১২৮ বিট", "১৬ বিট এবং ৬৪ বিট", "৬৪ বিট এবং ১২৮ বিট", "৩২ বিট এবং ৬৪ বিট"],
      correctIndex: 0,
      subject: "৭. কম্পিউটার ও তথ্যপ্রযুক্তি",
      topic: "তথ্যপ্রযুক্তি (নেটওয়ার্ক ও যোগাযোগ)",
      difficulty: "Medium",
      explanations: {
        bn: "IPv4 (Internet Protocol version 4) অ্যাড্রেস ৩২ বিটের হয়ে থাকে যা ডটেড-ডেসিমেল পদ্ধতিতে প্রকাশ পায়। অন্যদিকে IPv6 (Internet Protocol version 6) অ্যাড্রেস ১২৮ বিটের হয়ে থাকে যা কোলন-হেক্সাডেসিমেল ফরম্যাটে প্রকাশিত হয় বৈশ্বিক আইপি সংকট মোকাবেলায়।",
        en: "IPv4 addresses are 32-bit numbers structured in octets, whereas IPv6 addresses are 128-bit hexadecimal numbers designed to replace IPv4 due to address exhaustion.",
        wrongOptions: [
          "৬৪ বিট মূলত আধুনিক প্রসেসরের আর্কিটেকচার রেজিস্টার হিসেবে ব্যবহৃত হয়, আইপি অ্যাড্রেস নয়।"
        ]
      }
    },
    {
      text: "কম্পিউটারের প্রসেসর বা সিপিইউ (CPU) এবং প্রধান মেমোরির (RAM) মধ্যে গতির বিশালাকার অসঙ্গতি দূর করার জন্য নিচের কোন বিশেষ দ্রুতগতির মেমোরি ইন্টারফেস বা বাফার ব্যবহার করা হয়?",
      options: ["Cache Memory", "Registers", "Virtual Memory", "Magnetic Disk Buffer"],
      correctIndex: 0,
      subject: "৭. কম্পিউটার ও তথ্যপ্রযুক্তি",
      topic: "কম্পিউটার (অঙ্গসংগঠন ও পেরিফেরালস)",
      difficulty: "Medium",
      explanations: {
        bn: "ক্যাশ মেমোরি (Cache Memory) অত্যন্ত দ্রুতগতিসম্পন্ন একটি স্ট্যাটিক র্যাম (SRAM) যা সিপিইউ এবং মূল মেমোরির মাঝে বাফার হিসেবে কাজ করে। ঘন ঘন প্রয়োজনীয় ডাটা এখানে জমা রেখে প্রসেসরের কার্যক্ষমতা বহুগুণ বাড়িয়ে দেওয়া হয়।",
        en: "Cache memory is high-speed Static RAM (SRAM) placed between the CPU and the main Dynamic RAM (DRAM) to reduce the latency of memory accesses.",
        wrongOptions: [
          "রেজিস্টার হলো প্রসেসরের ভেতরের অতি ক্ষুদ্র মেমোরি যা সরাসরি গাণিতিক ও যৌক্তিক অপারেশনের ডাটা ধারণ করে, র্যাম-সিপিইউ বাফার নয়।",
          "ভার্চুয়াল মেমোরি হলো হার্ডডিস্কের কিছু অংশ যা র্যাম পূর্ণ হয়ে গেলে ব্যাকআপ মেমোরি হিসেবে কাজ করে।"
        ]
      }
    }
  ],
  science: [
    {
      text: "হৃদপিণ্ডের অলিন্দ বা নিলয় যখন স্বতঃস্ফূর্তভাবে সংকুচিত হয়ে ধমনীর রক্তনালীতে উচ্চচাপে রক্ত প্রেরণ করে, তখন রক্তচাপের এই অবস্থাকে চিকিৎসাবিজ্ঞানের ভাষায় কী বলা হয়?",
      options: ["Systole (সিস্টোল)", "Diastole (ডায়াস্টোল)", "Arteriosclerosis (ধমনীকাঠিন্য)", "Cardiomegaly"],
      correctIndex: 0,
      subject: "৬. সাধারণ বিজ্ঞান",
      topic: "জীব বিজ্ঞান",
      difficulty: "Medium",
      explanations: {
        bn: "হৃদপিণ্ডের সংকোচন অবস্থাকে 'সিস্টোল' (Systole) বলা হয় এবং প্রসারণ অবস্থাকে 'ডায়াস্টোল' (Diastole) বলা হয়। সিস্টোলের সময় ধমনীতে রক্তের সর্বোচ্চ চাপ পরিমাপ করা হয় যা স্বাভাবিক মানুষের ক্ষেত্রে প্রায় ১২০ মিমি পারদ চাপ।",
        en: "Systole is the phase of the heartbeat when the heart muscle contracts and pumps blood from the chambers into the arteries. Diastole is the resting phase.",
        wrongOptions: [
          "ডায়াস্টোল হলো হৃদপিণ্ডের অলিন্দ ও নিলয়ের প্রসারণের সময় রক্তচাপ।"
        ]
      }
    },
    {
      text: "কার্বনের অত্যন্ত পরিচিত রূপভেদ গ্রাফাইট (Graphite) সম্পর্কে নিচের কোন বৈজ্ঞানিক তথ্যটি সর্বৈব সত্য?",
      options: [
        "এটি বিদ্যুৎ ও তাপের সুপরিবাহী",
        "এটি পৃথিবীর কঠিনতম প্রাকৃতিক পদার্থ",
        "এর পারমাণবিক বিন্যাস হীরক অপেক্ষা ঘন ও অভেদ্য",
        "এটি সাধারণ কক্ষ তাপমাত্রায় রাসায়নিকভাবে তীব্র বিক্রিয়াশীল"
      ],
      correctIndex: 0,
      subject: "৬. সাধারণ বিজ্ঞান",
      topic: "ভৌত বিজ্ঞান",
      difficulty: "Medium",
      explanations: {
        bn: "গ্রাফাইটে প্রতিটি কার্বন পরমাণু অন্য তিনটি কার্বন পরমাণুর সাথে সমযোজী বন্ধনে আবদ্ধ হয়ে ষড়ভুজাকার স্তরে বিন্যস্ত থাকে। এতে প্রতিটি কার্বনের একটি করে ইলেকট্রন মুক্ত বা পাই-ইলেক্ট্রন হিসেবে মুক্তভাবে চলাচল করতে পারে। ফলে গ্রাফাইট বিদ্যুৎ ও তাপের অত্যন্ত সুপরিবাহী।",
        en: "Graphite has free, delocalized electrons that can move freely through its layers, making it an excellent conductor of electricity and heat.",
        wrongOptions: [
          "হীরা (Diamond) পৃথিবীর কঠিনতম প্রাকৃতিক পদার্থ, গ্রাফাইট নরম ও পিচ্ছিল প্রকৃতির।"
        ]
      }
    }
  ],
  geography: [
    {
      text: "ভৌগোলিক ও মানচিত্রীয় অক্ষাংশের হিসাব অনুযায়ী, বিখ্যাত 'কর্কটক্রান্তি রেখা' (Tropic of Cancer) বাংলাদেশের কোন অঞ্চলের উপর দিয়ে আড়াআড়িভাবে চলে গেছে?",
      options: ["প্রায় মধ্যভাগ দিয়ে", "উত্তরের সীমান্ত ঘেঁষে", "দক্ষিণের উপকূলীয় সুন্দরবন দিয়ে", "পূর্বের পার্বত্য সীমানা দিয়ে"],
      correctIndex: 0,
      subject: "৫. ভূগোল (বাংলাদেশ ও বিশ্ব), পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
      topic: "১. বাংলাদেশের ভৌগোলিক অবস্থান ও সীমানা",
      difficulty: "Easy",
      explanations: {
        bn: "কর্কটক্রান্তি রেখা (২৩.৫° উত্তর অক্ষাংশ) বাংলাদেশের প্রায় মাঝখান দিয়ে আড়াআড়িভাবে অতিক্রম করেছে। এটি বাংলাদেশের মোট কয়েকটি জেলার ওপর দিয়ে গেছে, যার মধ্যে ফরিদপুর, মুন্সিগঞ্জ ও ঢাকা অন্যতম।",
        en: "The Tropic of Cancer (23.5 degrees North latitude) runs approximately through the middle of Bangladesh horizontally.",
        wrongOptions: [
          "উত্তরের সীমান্ত ঘেঁষে হিমালয়ের কাছাকাছি তেঁতুলিয়া রয়েছে যা অনেক দূরে।"
        ]
      }
    }
  ],
  ethics: [
    {
      text: "সুশাসনের (Good Governance) মূল স্তম্ভসমূহ (স্বচ্ছতা, জবাবদিহিতা, আইনের শাসন এবং অংশগ্রহণ) সর্বপ্রথম কোন আন্তর্জাতিক ঋণদাতা সংস্থা আনুষ্ঠানিকভাবে তাদের এক পলিসি পেপারে সংজ্ঞায়িত করেছিল?",
      options: ["বিশ্বব্যাংক (World Bank)", "আন্তর্জাতিক মুদ্রা তহবিল (IMF)", "জাতিসংঘ উন্নয়ন কর্মসূচি (UNDP)", "এশীয় উন্নয়ন ব্যাংক (ADB)"],
      correctIndex: 0,
      subject: "১০. নৈতিকতা, মূল্যবোধ ও সুশাসন",
      topic: "মূল্যবোধ ও সুশাসনের সংজ্ঞায়ন ও সম্পর্ক",
      difficulty: "Medium",
      explanations: {
        bn: "বিশ্বব্যাংক (World Bank) ১৯৮৯ সালে আফ্রিকার সাব-সাহারা অঞ্চলে উন্নয়ন ব্যাহত হওয়ার কারণ হিসেবে সুশাসনের অভাবকে দায়ী করে এবং ১৯৯২ সালে 'Governance and Development' নামক নীতিপত্রে সুশাসনের মূল ৪টি স্তম্ভ আনুষ্ঠানিকভাবে সংজ্ঞায়িত করে।",
        en: "The World Bank first introduced the concept and indicators of 'Good Governance' in its reports published in 1989 and 1992, highlighting accountability, information disclosure, and legal frameworks.",
        wrongOptions: [
          "UNDP পরবর্তীতে ১৯৯৭ সালে সুশাসনের আরও ব্যাপক আটটি বৈশিষ্ট্য তালিকাভুক্ত করেছিল।"
        ]
      }
    }
  ],
  gk: [
    {
      text: "What is the name of the official system in Bangladesh Bank that processes interbank electronic clearing and real-time fund transfers representing large values across the banking system?",
      options: ["RTGS (Real Time Gross Settlement)", "EFT (Electronic Funds Transfer)", "BACPS", "NPSB"],
      correctIndex: 0,
      subject: "৪. General Knowledge (GK)",
      topic: "Bangladesh Affairs (বাংলাদেশ বিষয়)",
      difficulty: "Medium",
      explanations: {
        bn: "RTGS (Real Time Gross Settlement) হল বাংলাদেশ ব্যাংকের উচ্চ-মূল্যের বা তাৎক্ষণিক আন্তঃব্যাংক বড় আকারের তহবিল স্থানান্তরের একটি রিয়েল-টাইম সিস্টেম, যা ২০১৫ সাল থেকে সচল রয়েছে।",
        en: "RTGS (Real Time Gross Settlement) provides instant clearing and settlement of large-value transactions in Bangladesh's banking sector.",
        wrongOptions: [
          "EFT মূলত ব্যাচভিত্তিক এবং কিছুটা ধীর প্রক্রিয়ার লেনদেন যা ছোট মানের স্যালারি বা ইউটিলিটি বিলের জন্য ব্যবহৃত হয়।"
        ]
      }
    }
  ]
};

export function getProceduralQuestionsForSubject(subject: string, count: number, topic?: string, difficulty?: string, seedOffset = 0): any[] {
  const norm = (subject || "").toLowerCase();
  let key = "gk"; // Default fallback
  
  if (norm.includes("bangla") || norm.includes("বাংলা")) {
    key = "bangla";
  } else if (norm.includes("english") || norm.includes("ইংরেজি")) {
    key = "english";
  } else if (norm.includes("math") || norm.includes("গাণিতিক") || norm.includes("quantitative") || norm.includes("বীজগণিত") || norm.includes("পাটিগণিত")) {
    key = "math";
  } else if (norm.includes("computer") || norm.includes("তথ্যপ্রযুক্তি") || norm.includes("it") || norm.includes("ict")) {
    key = "it";
  } else if (norm.includes("science") || norm.includes("বিজ্ঞান")) {
    key = "science";
  } else if (norm.includes("bangladesh") || norm.includes("বাংলাদেশ")) {
    key = "bangladesh";
  } else if (norm.includes("international") || norm.includes("আন্তর্জাতিক")) {
    key = "international";
  } else if (norm.includes("geography") || norm.includes("ভূগোল") || norm.includes("দুর্যোগ")) {
    key = "geography";
  } else if (norm.includes("mental") || norm.includes("মানসিক")) {
    key = "math"; // combine under math logic
  } else if (norm.includes("moral") || norm.includes("নৈতিকতা") || norm.includes("সুশাসন")) {
    key = "ethics";
  } else {
    key = "gk";
  }

  const pool = SYLLABUS_CORPUS[key] || SYLLABUS_CORPUS.gk;
  const qs: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const rawIdx = (seedOffset + i) % pool.length;
    let selectedQ = pool[rawIdx];

    // If we're generating mathematical questions dynamically, we can introduce procedural algebra
    if (key === "math" && i % 2 === 1) {
      const idx = (seedOffset + i) % 10;
      const multipliers = [3, 4, 5, 2, 6, 7, 8, 9, 10, 12];
      const m = multipliers[idx];
      const s = m * 5;
      const d = m * 1;
      const x = m * 3;
      const y = m * 2;
      const ans = x * y;
      
      const opts = [
        `${ans}`,
        `${ans + m}`,
        `${ans - m}`,
        `${ans * 2}`
      ];

      selectedQ = {
        text: `দুটি সংখ্যার যোগফল = ${s} এবং বিয়োগফল = ${d} হলে, সংখ্যা দুটির গুণফল (xy) এর সঠিক মান কত হবে? (IBA/PSC Algebra Style)`,
        options: opts,
        correctIndex: 0,
        subject: "৮. গাণিতিক যুক্তি",
        topic: "২. বীজগণিত",
        difficulty: "Medium",
        explanations: {
          bn: `সহজ বীজগণিতীয় প্রতিস্থাপন ও সমাধান:\nসমীকরণ দুটি যোগ করলে পাই, 2x = ${s + d} => x = ${x}।\nএবং সমীকরণ দুটি বিয়োগ করলে পাই, 2y = ${s - d} => y = ${y}।\nঅতএব সংখ্যা দুটির গুণফল xy এর মান = ${x} * ${y} = ${ans}।`,
          en: `Solving the linear system of equations x + y = ${s} and x - y = ${d} simultaneously yields x = ${x} and y = ${y}. Thus, xy = ${x} * ${y} = ${ans}.`,
          wrongOptions: ["অন্যান্য বিকল্পগুলো গাণিতিক প্রতীক বা সমীকরণ ভুলভাবে সাজালে আসতে পারে যা অসঙ্গত।"]
        }
      };
    }

    qs.push({
      id: `procedural-${key}-${Math.random().toString(36).substring(7)}-${i}`,
      text: selectedQ.text,
      options: selectedQ.options,
      correctIndex: selectedQ.correctIndex,
      subject: selectedQ.subject,
      topic: topic || selectedQ.topic,
      difficulty: difficulty || selectedQ.difficulty,
      explanations: selectedQ.explanations
    });
  }

  return qs;
}

export function generateProceduralQuestions(allocations: any[], difficulty: string): any[] {
  const finalizedQs: any[] = [];
  let seedOffset = 0;
  for (const alloc of allocations) {
    const count = parseInt(alloc.count) || 0;
    if (count <= 0) continue;
    const subjectQs = getProceduralQuestionsForSubject(alloc.subject, count, alloc.topic, difficulty || "Medium", seedOffset);
    finalizedQs.push(...subjectQs);
    seedOffset += count;
  }
  return finalizedQs;
}
