// Interactive Gamification, Real-World Dilemmas ("Wewe Ni Jaji"), Sheng Translations, and Quizzes

export type DilemmaOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  points: number;
};

export type CaseDilemma = {
  scenarioTitle: string;
  scenario: string;
  character: string;
  question: string;
  options: DilemmaOption[];
  articleAnchor: string;
  tip: string;
};

export type LessonQuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type LessonGamification = {
  shengSummary: string;
  simpleSummary: string;
  realWorldImpact: string;
  keyCase: {
    title: string;
    citation: string;
    takeaway: string;
  };
  dilemma: CaseDilemma;
  quiz: LessonQuizQuestion[];
};

export const lessonGamificationData: Record<string, LessonGamification> = {
  "foundations-1": {
    shengSummary:
      "Form ni hivi: Power yote kwa hii nchi ni ya raia! Rais, MP, Governor na judges ni watu tumewa-loan hiyo power. Wakileta maringo au wakivunja sheria, wewe mwananchi una haki ya kuwatoa ama kuwashitaki court under Article 1!",
    simpleSummary:
      "You are the true boss of Kenya. The President, Governors, MPs, and police officers only borrow their authority from you. Power starts with you and returns to you.",
    realWorldImpact:
      "When a leader tells citizens 'I have power over you', Article 1 reminds you they are public servants who work for you. You have the right to attend barazas, sign petitions, and challenge unconstitutional acts.",
    keyCase: {
      title: "Building Bridges Initiative (BBI) Judgment",
      citation: "Supreme Court of Kenya, 2022",
      takeaway:
        "The Supreme Court ruled that sovereign power belongs directly to the people, and the President cannot initiate a popular constitutional amendment under Article 257.",
    },
    dilemma: {
      scenarioTitle: "The Arrogant MCA at the Chief's Baraza",
      character: "Amina, a 24-year-old youth leader in Kisumu County",
      scenario:
        "Amina attends a local public participation forum where her Member of County Assembly (MCA) announces that the market fund was spent on luxury committee trips. When Amina stands up to demand receipts, the MCA shouts: 'I am the elected leader here, sit down or I will have police arrest you!'",
      question: "Under Article 1 & 3 of the Constitution, what should Amina and the residents do?",
      articleAnchor: "Article 1 & 3",
      tip: "Elected officials are trustees of your delegated sovereign power, not rulers.",
      options: [
        {
          id: "a",
          text: "Sit down quietly because elected leaders have absolute power until next election.",
          isCorrect: false,
          explanation:
            "Incorrect! Sovereign power never permanently transfers to leaders. Article 1(1) states all power belongs to the people.",
          points: 0,
        },
        {
          id: "b",
          text: "Assert her constitutional right to public participation (Article 1 & 10) and document the incident for a formal petition.",
          isCorrect: true,
          explanation:
            "Spot on! (+25 XP) Under Article 1(2) and Article 3, citizens have direct sovereign power and an active obligation to demand transparency and defend public resources.",
          points: 25,
        },
        {
          id: "c",
          text: "Start throwing stones and break the chief's office windows.",
          isCorrect: false,
          explanation:
            "Incorrect. Article 3 requires defending the Constitution lawfully and peaceably, not destroying public infrastructure.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "Who actually owns sovereign power in the Republic of Kenya?",
        options: ["The Head of Public Service", "The People of Kenya", "The Armed Forces", "Foreign Donors"],
        answer: 1,
        explain: "Article 1(1) specifically commands: All sovereign power belongs to the people of Kenya.",
      },
      {
        q: "What is your constitutional duty under Article 3?",
        options: [
          "To respect, uphold and defend the Constitution",
          "To obey any police order without question",
          "To vote only for ruling party candidates",
          "To pay taxes and remain quiet",
        ],
        answer: 0,
        explain: "Article 3 obligates every individual to defend and protect constitutional supremacy.",
      },
    ],
  },

  "foundations-2": {
    shengSummary:
      "Katiba ndio kusema! Kama Parliament au President wapitishe sheria yoyote inagongana na Katiba, hiyo sheria yao ni hewa (void). Hakuna mtu — hata awe nani — yuko juu ya Katiba ya Kenya!",
    simpleSummary:
      "The Constitution is Kenya's supreme law. If any Act of Parliament, presidential directive, or county by-law contradicts it, the Constitution wins and that bad law is cancelled.",
    realWorldImpact:
      "When Parliament passed controversial Finance Bill clauses or curfew rules that breached fundamental rights, the High Court struck them down because the Constitution sits higher than any politician's decree.",
    keyCase: {
      title: "Okiya Omtatah & Others v The National Assembly",
      citation: "High Court of Kenya, 2023",
      takeaway:
        "The High Court declared sections of the Housing Levy unconstitutional because laws passed without fair legislative procedure violate Article 2 supremacy.",
    },
    dilemma: {
      scenarioTitle: "The Unconstitutional Midnight Curfew Order",
      character: "Kevin, a small business operator in Mombasa",
      scenario:
        "A regional County Commissioner issues a verbal order on TV declaring that all shops must close at 7 PM and pay an emergency levy to county rangers without any law passed by Parliament or the County Assembly. Anyone found outside will be detained.",
      question: "According to Article 2(4) on Constitutional Supremacy, is this directive valid?",
      articleAnchor: "Article 2(4)",
      tip: "Any decree inconsistent with the Constitution is void from the start.",
      options: [
        {
          id: "a",
          text: "Yes, because whatever a County Commissioner says on TV automatically becomes enforceable law.",
          isCorrect: false,
          explanation:
            "Wrong! Decrees cannot override constitutional rights to liberty and property without legislation.",
          points: 0,
        },
        {
          id: "b",
          text: "No, under Article 2(4), any act or directive inconsistent with the Constitution is void and cannot limit fundamental rights without statutory law.",
          isCorrect: true,
          explanation:
            "Excellent! (+25 XP) Under Article 2(4), any law or conduct inconsistent with the Constitution is void to the extent of the inconsistency.",
          points: 25,
        },
        {
          id: "c",
          text: "Only valid if the Commissioner is accompanied by armed officers.",
          isCorrect: false,
          explanation: "Force does not create legality. Force used without constitutional authority is illegal.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "What happens if an Act of Parliament contradicts an Article of the Constitution?",
        options: [
          "The Act of Parliament overrides the Constitution",
          "The Act is void to the extent of the inconsistency",
          "The President decides which one to follow",
          "The law remains in effect for 5 years",
        ],
        answer: 1,
        explain: "Article 2(4) declares that any law that contradicts the Constitution is completely void.",
      },
      {
        q: "Are ratified international treaties part of Kenyan law?",
        options: [
          "No, treaties have zero effect in Kenya",
          "Yes, Article 2(6) binds Kenya to ratified treaties",
          "Only if approved by a referendum",
          "Only in the East African Community",
        ],
        answer: 1,
        explain: "Article 2(6) states any treaty or convention ratified by Kenya forms part of the law of Kenya.",
      },
    ],
  },

  "foundations-3": {
    shengSummary:
      "Article 10 ndio roho ya Kenya: uzalendo (patriotism), utawala wa sheria (rule of law), usawa (equity), na transparency. Hakuna kiongozi anaeza fanya project au kupitisha tender kisiri-siri bila kuhusisha wananchi!",
    simpleSummary:
      "Article 10 lists our national values: honesty, public involvement, human dignity, social justice, and accountability. Any government official making a decision MUST follow these values.",
    realWorldImpact:
      "Whenever county governments plan budgets or national ministries procure infrastructure, Article 10 forces them to conduct genuine public hearings — not cosmetic photo-ops.",
    keyCase: {
      title: "Mui Coal Basin Community v Ministry of Energy",
      citation: "High Court of Kenya, 2015",
      takeaway:
        "The court held that public participation under Article 10 must be real, meaningful, and provided with accessible information, not just a tick-the-box exercise.",
    },
    dilemma: {
      scenarioTitle: "The Secret Stadium Tender",
      character: "Juma, an investigative citizen in Nakuru",
      scenario:
        "The county government announces that a 500-million shilling sports complex contract has been awarded to the Governor's cousin in private. No advertisements, no public notices, and no town hall meetings were ever held.",
      question: "Which constitutional principle in Article 10 has been violated?",
      articleAnchor: "Article 10(2)",
      tip: "Article 10 guarantees public participation, transparency, and accountability in all state actions.",
      options: [
        {
          id: "a",
          text: "None, governors have discretion to award contracts without public scrutiny.",
          isCorrect: false,
          explanation: "Completely false! Article 10 specifically binds every state organ to transparency and rule of law.",
          points: 0,
        },
        {
          id: "b",
          text: "Article 10 national values: Transparency, accountability, integrity, and mandatory public participation.",
          isCorrect: true,
          explanation:
            "Bingo! (+25 XP) Under Article 10(2), public participation, transparency, and good governance are non-negotiable legal imperatives.",
          points: 25,
        },
        {
          id: "c",
          text: "Only the county football association can challenge this decision.",
          isCorrect: false,
          explanation: "Any citizen has legal standing under Article 22 & 258 to enforce Article 10 values in court.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "When do the Article 10 national values apply?",
        options: [
          "Only during national holidays like Mashujaa Day",
          "Whenever any state organ or public officer applies or interprets the law",
          "Only when judges are wearing ceremonial robes",
          "Only in primary schools",
        ],
        answer: 1,
        explain: "Article 10(1) commands that national values bind all State organs and public officers whenever applying any law.",
      },
    ],
  },

  "bor-1": {
    shengSummary:
      "Life yako na dignity yako ni vitu haziwezi chukuliwa kirahisi. Polisi hawana ruhusa ya kuua suspect ovyo ovyo ('shoot to kill' ni haramu!). Kila mwanadamu ana haki ya kuishi na kuheshimiwa kikatiba.",
    simpleSummary:
      "Every person has an inherent right to life and dignity. The state and police are forbidden from executing suspects without trial or treating anyone inhumanely.",
    realWorldImpact:
      "This protects citizens against extrajudicial killings, police brutality, and forced strip searches. It forms the legal basis for holding rogue officers personally accountable in court.",
    keyCase: {
      title: "Muruatetu & Another v Republic",
      citation: "Supreme Court of Kenya, 2017",
      takeaway:
        "The Supreme Court declared the mandatory death sentence for murder unconstitutional because it violates human dignity and removes judicial discretion.",
    },
    dilemma: {
      scenarioTitle: "The Midnight Protest Encounter",
      character: "Wanjiku, a university student in Nairobi",
      scenario:
        "Wanjiku is peacefully walking home during a citizen picket when two officers grab her phone, slap her across the face, and threaten to shoot her in the foot if she asks for their service badge numbers.",
      question: "What fundamental rights have been violated under Chapter 4?",
      articleAnchor: "Articles 26, 28 & 29",
      tip: "Freedom from torture and degrading treatment is completely non-derogable under Article 25.",
      options: [
        {
          id: "a",
          text: "Right to human dignity (Art 28), freedom from cruel/degrading treatment (Art 29), and freedom of security of person.",
          isCorrect: true,
          explanation:
            "Spot on! (+25 XP) Cruel, inhumane, or degrading treatment is never allowed — even during state emergencies (Article 25).",
          points: 25,
        },
        {
          id: "b",
          text: "Police have the right to slap suspects if they consider the suspect stubborn.",
          isCorrect: false,
          explanation: "Police officers are bound by the National Police Service Act and the Constitution. Physical abuse is a crime.",
          points: 0,
        },
        {
          id: "c",
          text: "No right was breached because streets belong to security agents at night.",
          isCorrect: false,
          explanation: "Human rights protect everyone 24 hours a day, everywhere on Kenyan soil.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "Can the right to freedom from torture ever be suspended during a state of emergency?",
        options: [
          "Yes, if the President signs an order",
          "No, Article 25 makes freedom from torture absolutely non-derogable",
          "Yes, for terrorism investigations only",
          "Yes, for 30 days max",
        ],
        answer: 1,
        explain: "Article 25 strictly forbids derogating from the freedom from torture and cruel, inhuman, or degrading treatment.",
      },
    ],
  },

  "bor-3": {
    shengSummary:
      "Una haki ya kuongea, kublog, kuchora cartoons, na kupeana mawazo yako. Lakini kumbuka: hate speech, propaganda ya vita, na kuchochea violence haziko kwa hii haki!",
    simpleSummary:
      "You have the constitutional right to express your thoughts, criticize public policies, create art, and share information. The only limits are hate speech, war incitement, and direct violence.",
    realWorldImpact:
      "Protects journalists, social media creators, whistleblowers, and everyday citizens from being jailed for criticizing bad governance.",
    keyCase: {
      title: "Geoffrey Andare v Attorney General",
      citation: "High Court of Kenya, 2016",
      takeaway:
        "The High Court invalidated Section 29 of the Kenya Information and Communication Act (criminalizing 'grossly offensive' posts) for violating Article 33 freedom of expression.",
    },
    dilemma: {
      scenarioTitle: "The Whistleblower Tweet",
      character: "Brian, a blogger in Eldoret",
      scenario:
        "Brian posts official tender documents on X (Twitter) showing that the local hospital purchased mosquito nets for 10 times the market price. The County Secretary calls him and threatens to have him arrested for 'annoying the county leadership'.",
      question: "Is Brian protected by the Constitution of Kenya?",
      articleAnchor: "Article 33 & 35",
      tip: "Freedom of expression and access to public information protect anti-corruption exposés.",
      options: [
        {
          id: "a",
          text: "No, criticizing county leadership online is illegal.",
          isCorrect: false,
          explanation: "False! In Kenya, 'annoying a public officer' is not a valid criminal offense.",
          points: 0,
        },
        {
          id: "b",
          text: "Yes, under Article 33 (Freedom of expression) and Article 35 (Access to information), citizens have the right to expose misuse of public funds.",
          isCorrect: true,
          explanation:
            "Correct! (+25 XP) Article 33 guarantees freedom to seek, receive and impart information. Anti-corruption speech is protected civic action.",
          points: 25,
        },
        {
          id: "c",
          text: "Brian must pay a fine to the county government within 24 hours.",
          isCorrect: false,
          explanation: "Fines can only be levied by a court of law after a fair trial.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "Which of the following is NOT protected under Article 33 (Freedom of expression)?",
        options: [
          "Criticizing government fiscal policies",
          "Hate speech and advocacy of hatred",
          "Drawing political satire cartoons",
          "Publishing factual investigative reports",
        ],
        answer: 1,
        explain: "Article 33(2) explicitly excludes hate speech, incitement to violence, and war propaganda.",
      },
    ],
  },

  "bor-5": {
    shengSummary:
      "Ukikamatwa na karao, jua haki zako: 1) Ni lazima wakuambie reason ya arrest. 2) Usilazimishwe ku-confess. 3) Haki ya kupiga simu kwa wakili au family. 4) Kufikishwa court within 24 hours! 5) Haki ya kupewa bail/bond!",
    simpleSummary:
      "If you are arrested, you must be told the reason immediately, allowed to call a lawyer or family, brought before a court within 24 hours, and you have the right to bail or bond unless compelling reasons exist.",
    realWorldImpact:
      "Stops illegal Friday arrests where police detain suspects over the weekend to extort bribes. You can demand police bond immediately under Article 49.",
    keyCase: {
      title: "Republic v Inspector General of Police ex-parte Boniface Mwangi",
      citation: "High Court of Kenya, 2021",
      takeaway:
        "The court reaffirmed that detaining suspects beyond 24 hours without court production violates Article 49(1)(f) and triggers heavy state compensation.",
    },
    dilemma: {
      scenarioTitle: "The 'Kamata Kamata' Friday Night Drama",
      character: "Dennis, an accountant arrested at a matatu stage in Nairobi West",
      scenario:
        "Police arrest Dennis at 9 PM on Friday, refuse to tell him why he is being detained, confiscate his smartphone, and lock him in a cell saying: 'You will stay here until Monday morning unless your family brings KES 20,000 cash.'",
      question: "Which rights under Article 49 have the police violated?",
      articleAnchor: "Article 49",
      tip: "Article 49 gives you the right to be told the reason, make a call, apply for bail, and be brought to court in 24 hours.",
      options: [
        {
          id: "a",
          text: "The right to be informed promptly of the reason for arrest, the right to communicate with an advocate/family, and the right to bail/bond.",
          isCorrect: true,
          explanation:
            "Outstanding! (+25 XP) Under Article 49(1), Dennis is entitled to know why he was arrested, contact family/counsel, and be released on reasonable bond.",
          points: 25,
        },
        {
          id: "b",
          text: "None, police have total authority to hold suspects over the weekend without bond.",
          isCorrect: false,
          explanation: "Completely untrue. The 24-hour clock does not stop because it is a weekend or holiday.",
          points: 0,
        },
        {
          id: "c",
          text: "Dennis is only allowed to speak if he confesses in writing first.",
          isCorrect: false,
          explanation: "Article 49(1)(d) guarantees the right to remain silent and not be compelled to make confessions.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "Within how many hours must an arrested person be brought before a court of law?",
        options: ["Within 12 hours", "Within 24 hours", "Within 72 hours", "Within 7 days"],
        answer: 1,
        explain: "Article 49(1)(f) dictates that an arrested person must be brought before a court within 24 hours.",
      },
      {
        q: "Does an arrested person have the right to remain silent?",
        options: [
          "No, silence is treated as a guilty admission",
          "Yes, Article 49(1)(b) guarantees the right to remain silent",
          "Only if they have a Senior Counsel present",
          "Only in traffic offenses",
        ],
        answer: 1,
        explain: "Article 49(1)(b) guarantees the right to remain silent, and to be informed of the consequences of speaking.",
      },
    ],
  },

  "dev-1": {
    shengSummary:
      "Devolution ililetwa ili pesa na maendeleo yasiishie Nairobi pekee. Sasa tuko na 47 counties, na kila county ina Governor na Bunge yake (MCA). Pesa za hospitali za mashinani, masoko, na feeder roads ziko mikononi mwa county!",
    simpleSummary:
      "Devolution brought government closer to the people by creating 47 county governments. It decentralized resources from Nairobi so communities determine their own local development priorities.",
    realWorldImpact:
      "Instead of traveling to Nairobi to get healthcare, agricultural extension services, or local trade permits, your county government handles them right in your home sub-county.",
    keyCase: {
      title: "Council of Governors v Attorney General & Senate",
      citation: "Supreme Court of Kenya, Advisory Opinion, 2013",
      takeaway:
        "The Supreme Court ruled that county governments are distinct and interdependent governments, not subordinate departments of the national executive.",
    },
    dilemma: {
      scenarioTitle: "The Abandoned Sub-County Dispensary",
      character: "Mama Zawadi in Kitui County",
      scenario:
        "The local health dispensary has had no medicine for 4 months while maternal health funds were diverted to purchase executive SUVs for county executives. The local chief claims only the President in Nairobi can fix county hospitals.",
      question: "According to the Fourth Schedule on Devolution, who is responsible for county health facilities?",
      articleAnchor: "Fourth Schedule & Article 186",
      tip: "County health services and pharmacies are fully devolved county functions.",
      options: [
        {
          id: "a",
          text: "The County Government is constitutionally responsible for county health facilities and pharmacies under Part 2 of the 4th Schedule.",
          isCorrect: true,
          explanation:
            "Spot on! (+25 XP) Under the Fourth Schedule, county health services (including dispensaries and pharmacies) are devolved functions. Citizens should petition the County Governor and MCA.",
          points: 25,
        },
        {
          id: "b",
          text: "Only the National Ministry of Health in Nairobi controls local dispensaries.",
          isCorrect: false,
          explanation: "False. National government only manages national referral facilities (like Kenyatta National Hospital) and health policy.",
          points: 0,
        },
        {
          id: "c",
          text: "Hospitals must be funded entirely by church donations.",
          isCorrect: false,
          explanation: "Public healthcare is a fundamental economic right under Article 43 funded by taxes.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "How many county governments does the Constitution establish in Kenya?",
        options: ["8", "12", "47", "52"],
        answer: 2,
        explain: "Article 6 and the First Schedule establish 47 distinct county governments.",
      },
    ],
  },

  "elec-2": {
    shengSummary:
      "Public participation si picha ya Facebook! Serikali ikipanga kuweka ushuru mpya au kujenga project, ni LAZIMA washirikishe raia mapema, wapeane info wazi, na wasikize maoni ya wakenya. Vinginevyo, court itaitupilia mbali!",
    simpleSummary:
      "Public participation is not a mere formality or PR photo. Before any law, budget, or major policy is passed, citizens must be given adequate time, notice, and genuine opportunity to shape the decision.",
    realWorldImpact:
      "Dozens of county finance bills and national levies have been quashed by the High Court because leaders held meetings on 24 hours notice or failed to disclose project documents.",
    keyCase: {
      title: "Law Society of Kenya & Others v The Cabinet Secretary for Finance",
      citation: "Court of Appeal of Kenya, 2024",
      takeaway:
        "The Court reiterated that public participation without providing accessible, timely information to citizens makes the entire legislative process unconstitutional.",
    },
    dilemma: {
      scenarioTitle: "The Secret 24-Hour Tax Baraza",
      character: "Fatuma, a small trader in Garissa Town",
      scenario:
        "On Friday at 5 PM, the County Assembly publishes a notice in an obscure newspaper announcing a new 200% market stall fee public hearing at 8 AM on Saturday morning, with no copies of the proposed bill provided to traders.",
      question: "Is this constitutionally adequate public participation under Article 10 & 118?",
      articleAnchor: "Articles 10, 118 & 196",
      tip: "Courts require reasonable notice, accessible draft copies, and meaningful opportunity to be heard.",
      options: [
        {
          id: "a",
          text: "No! Meaningful public participation requires reasonable notice, accessible documents, and realistic opportunity for the public to analyze and submit input.",
          isCorrect: true,
          explanation:
            "Spot on! (+25 XP) In multiple landmark decisions, Kenyan courts have ruled that 24-hour weekend notices without bill copies are unconstitutional charades.",
          points: 25,
        },
        {
          id: "b",
          text: "Yes, as long as any newspaper notice was printed, it meets the law.",
          isCorrect: false,
          explanation: "Tokenism or 'window-dressing' public participation is consistently rejected by Kenyan courts.",
          points: 0,
        },
        {
          id: "c",
          text: "Traders have no right to question tax rates set by assemblies.",
          isCorrect: false,
          explanation: "All taxation requires democratic public participation under Articles 10 and 201.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: "Which constitutional Article requires Parliament and County Assemblies to conduct business in an open manner and facilitate public participation?",
        options: ["Article 118 and 196", "Article 5", "Article 245", "Article 88"],
        answer: 0,
        explain: "Article 118 binds Parliament, and Article 196 binds County Assemblies to facilitate public participation.",
      },
    ],
  },
};

// Generic fallback generator for lessons without dedicated manual overrides
export function getLessonGamification(lessonSlug: string, lessonTitle: string): LessonGamification {
  if (lessonGamificationData[lessonSlug]) {
    return lessonGamificationData[lessonSlug];
  }

  return {
    shengSummary: `Hapa kwa hii lesson ya ${lessonTitle}, point kubwa ni kuelewa haki zako na vile Katiba inakulinda kama mwananchi. Usikubali kubembelezwa na watu wa serikali bila kufuata sheria!`,
    simpleSummary: `This lesson explores ${lessonTitle}. It reveals your constitutional entitlements, checks and balances on public officers, and practical tools to exercise your citizenship with confidence.`,
    realWorldImpact: `Directly impacts how public services are delivered to you, how public funds are audited, and how citizens hold authorities accountable under the 2010 Constitution.`,
    keyCase: {
      title: "Constitutional Petitions on Civic Enforcement",
      citation: "High Court of Kenya Jurisprudence",
      takeaway:
        "Every citizen has the legal standing (locus standi) under Article 258 to petition any court against violations of constitutional provisions.",
    },
    dilemma: {
      scenarioTitle: `Real-World Citizen Challenge: ${lessonTitle}`,
      character: "A patriotic Kenyan citizen seeking accountability",
      scenario: `You observe a public officer violating established constitutional rules while performing official duties under ${lessonTitle}. When confronted, they claim citizens have no power to question official state decisions.`,
      question: "What is your best constitutional course of action?",
      articleAnchor: "Article 3 & 10",
      tip: "Defending the Constitution is an active duty for every person in Kenya.",
      options: [
        {
          id: "a",
          text: "Accept that citizens cannot question public decisions.",
          isCorrect: false,
          explanation: "Incorrect! Sovereign power belongs to the people of Kenya under Article 1.",
          points: 0,
        },
        {
          id: "b",
          text: "Invoke Article 3 (Defend the Constitution) and request formal reasons in writing under Article 47 (Fair Administrative Action).",
          isCorrect: true,
          explanation: "Excellent! (+25 XP) Citizens have the explicit right to written reasons and administrative fairness.",
          points: 25,
        },
        {
          id: "c",
          text: "Leave the country and renounce your citizenship.",
          isCorrect: false,
          explanation: "Patriotism and civic engagement build stronger democratic institutions.",
          points: 0,
        },
      ],
    },
    quiz: [
      {
        q: `What is the core takeaway of ${lessonTitle}?`,
        options: [
          "Constitutional principles bind all public actors and empower citizens",
          "Rules are made to be ignored",
          "Only high-ranking politicians matter",
          "Public decisions should always be secret",
        ],
        answer: 0,
        explain: "The Constitution ensures rule of law, transparency, and civic power across all governance structures.",
      },
    ],
  };
}
