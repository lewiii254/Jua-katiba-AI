export type PracticeArea =
  | "Constitutional & Human Rights"
  | "Land, Property & Conveyancing"
  | "Criminal Defense & Bail"
  | "Family, Succession & Probate"
  | "Employment & Labour Relations"
  | "Commercial & Corporate"
  | "Public Interest & Environmental"
  | "Tech, Media & Data Protection";

export interface Advocate {
  id: string;
  name: string;
  title: string;
  firm: string;
  lskNumber: string;
  avatarBg: string;
  initials: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  county: string;
  officeLocation: string;
  practiceAreas: PracticeArea[];
  consultationFee: string;
  hourlyRate: string;
  proBono: boolean;
  languages: string[];
  consultationModes: ("video" | "in-person" | "phone")[];
  bio: string;
  notableMatters: string[];
  phone: string;
  email: string;
  officeHours: string;
  verified: boolean;
  isUserAdded?: boolean;
}

export interface ClientRequest {
  id: string;
  clientName: string;
  category: PracticeArea;
  county: string;
  title: string;
  description: string;
  urgency: "Immediate (24 hrs)" | "Within a week" | "Flexible";
  consultationPreference: "Video / Phone" | "In-Person" | "Any";
  budget: string;
  createdAt: string;
  responsesCount: number;
}

export const initialAdvocates: Advocate[] = [
  {
    id: "adv-1",
    name: "Adv. Faith Chebet Waweru",
    title: "Advocate of the High Court of Kenya",
    firm: "Chebet & Waweru Law Chambers",
    lskNumber: "P.105/16420/17",
    avatarBg: "from-emerald-600 to-teal-700",
    initials: "FC",
    rating: 4.9,
    reviewsCount: 48,
    experienceYears: 9,
    county: "Nairobi",
    officeLocation: "5th Floor, Landmark Plaza, Argwings Kodhek Rd, Upper Hill",
    practiceAreas: [
      "Constitutional & Human Rights",
      "Public Interest & Environmental",
      "Land, Property & Conveyancing",
    ],
    consultationFee: "KSh 3,000 / 30 min",
    hourlyRate: "KSh 6,000 / hr",
    proBono: true,
    languages: ["English", "Swahili", "Kalenjin"],
    consultationModes: ["video", "in-person", "phone"],
    bio: "Passionate human rights advocate with extensive experience in Article 22 & 23 petitions, public interest litigation, environmental justice, and community land restitution. Regular contributor to civic education initiatives.",
    notableMatters: [
      "Secured High Court conservatory orders halting unlawful community eviction in Kajiado",
      "Represented civil society coalitions in challenging county revenue bill public participation defects",
      "Successfully litigated over 40 fundamental rights enforcement petitions",
    ],
    phone: "+254 722 890 123",
    email: "fchebet@cwlaw.co.ke",
    officeHours: "Mon - Fri: 8:30 AM - 5:00 PM",
    verified: true,
  },
  {
    id: "adv-2",
    name: "Adv. Brian Otieno Omondi, SC",
    title: "Senior Counsel & Managing Partner",
    firm: "Otieno Omondi & Associates",
    lskNumber: "P.105/08214/09",
    avatarBg: "from-blue-600 to-indigo-800",
    initials: "BO",
    rating: 5.0,
    reviewsCount: 76,
    experienceYears: 16,
    county: "Kisumu",
    officeLocation: "Al-Imran Plaza, Oginga Odinga St, Milimani, Kisumu",
    practiceAreas: [
      "Land, Property & Conveyancing",
      "Commercial & Corporate",
      "Employment & Labour Relations",
    ],
    consultationFee: "KSh 4,500 / 45 min",
    hourlyRate: "KSh 8,500 / hr",
    proBono: false,
    languages: ["English", "Swahili", "Luo"],
    consultationModes: ["video", "in-person", "phone"],
    bio: "Senior practitioner focusing on complex land boundary disputes, title deed regularisation, commercial contracts, and employment rights. Trusted advisor to businesses, cooperatives, and families across Western Kenya.",
    notableMatters: [
      "Resolved 120-acre ancestral succession and title adjudication in Lake Region",
      "Lead counsel in collective bargaining agreement negotiations for regional agro-processing workers",
      "Arbitrated high-value commercial construction disputes under KIAM rules",
    ],
    phone: "+254 733 456 789",
    email: "otieno@omondilaw.com",
    officeHours: "Mon - Fri: 8:00 AM - 5:30 PM",
    verified: true,
  },
  {
    id: "adv-3",
    name: "Adv. Hassan Abdalla Said",
    title: "Advocate of the High Court of Kenya",
    firm: "Pwani Coastal Legal Defence Hub",
    lskNumber: "P.105/14392/15",
    avatarBg: "from-amber-600 to-orange-700",
    initials: "HA",
    rating: 4.8,
    reviewsCount: 39,
    experienceYears: 11,
    county: "Mombasa",
    officeLocation: "Links Plaza, Links Rd, Nyali, Mombasa",
    practiceAreas: [
      "Criminal Defense & Bail",
      "Constitutional & Human Rights",
      "Family, Succession & Probate",
    ],
    consultationFee: "Free 15-min discovery call (KSh 2,500 / hr thereafter)",
    hourlyRate: "KSh 5,000 / hr",
    proBono: true,
    languages: ["English", "Swahili", "Arabic"],
    consultationModes: ["video", "in-person", "phone"],
    bio: "Dedicated defense advocate focused on criminal trials, emergency bail & bond applications, Kadhis' Court family successions, and protecting citizens against arbitrary police harassment under Article 49 of the Constitution.",
    notableMatters: [
      "Over 180 successful emergency bail applications across Mombasa & Kilifi Law Courts",
      "Represented families in cross-jurisdictional Islamic succession and probate distribution",
      "Pro-bono counsel for grassroots youth groups on peaceful assembly rights",
    ],
    phone: "+254 710 987 654",
    email: "hassan@pwanilegal.org",
    officeHours: "Mon - Sat: 9:00 AM - 4:00 PM",
    verified: true,
  },
  {
    id: "adv-4",
    name: "Adv. Brenda Njeri Kamau",
    title: "Advocate & Tech Law Practitioner",
    firm: "Kamau & Partners CyberLex",
    lskNumber: "P.105/18501/19",
    avatarBg: "from-purple-600 to-indigo-700",
    initials: "BK",
    rating: 4.9,
    reviewsCount: 32,
    experienceYears: 7,
    county: "Nairobi",
    officeLocation: "Eden Square, Chiromo Rd, Westlands, Nairobi",
    practiceAreas: [
      "Tech, Media & Data Protection",
      "Commercial & Corporate",
      "Employment & Labour Relations",
    ],
    consultationFee: "KSh 3,500 / 30 min",
    hourlyRate: "KSh 7,000 / hr",
    proBono: false,
    languages: ["English", "Swahili", "Kikuyu"],
    consultationModes: ["video", "in-person"],
    bio: "Specialist in the Data Protection Act 2019, digital privacy rights, software contracts, startup equity structuring, and intellectual property. Helping Kenyan tech founders and digital workers navigate regulation.",
    notableMatters: [
      "Advised Kenyan fintech startups on Data Commissioner compliance audits and cross-border data transfer",
      "Successfully represented remote tech workers in unjust dismissal and severance arbitration",
      "Drafted standard IP licensing and vendor agreements for top East African SaaS firms",
    ],
    phone: "+254 721 345 999",
    email: "brenda@cyberlex.co.ke",
    officeHours: "Mon - Fri: 9:00 AM - 6:00 PM",
    verified: true,
  },
  {
    id: "adv-5",
    name: "Adv. Dennis Kipkemoi Korir",
    title: "Advocate of the High Court of Kenya",
    firm: "Rift Valley Legal Consortium",
    lskNumber: "P.105/12984/14",
    avatarBg: "from-red-600 to-rose-800",
    initials: "DK",
    rating: 4.9,
    reviewsCount: 54,
    experienceYears: 12,
    county: "Nakuru",
    officeLocation: "Gideon Moi St, Central Square, Nakuru City",
    practiceAreas: [
      "Land, Property & Conveyancing",
      "Family, Succession & Probate",
      "Criminal Defense & Bail",
    ],
    consultationFee: "KSh 2,500 / 30 min",
    hourlyRate: "KSh 5,000 / hr",
    proBono: true,
    languages: ["English", "Swahili", "Kalenjin"],
    consultationModes: ["video", "in-person", "phone"],
    bio: "Experienced litigator with strong roots in agricultural land transactions, succession grant petitions, title searches, and criminal defense in the Environment and Land Court (ELC) and Subordinate Courts.",
    notableMatters: [
      "Guided over 250 families through Letters of Administration and confirmation of grant processes",
      "Secured title cancellation for fraudulent land subdivision in Rongai sub-county",
      "Defended smallholder farmers in agricultural lease and easement disputes",
    ],
    phone: "+254 720 112 334",
    email: "dkorir@riftvalleylegal.co.ke",
    officeHours: "Mon - Fri: 8:30 AM - 5:00 PM",
    verified: true,
  },
  {
    id: "adv-6",
    name: "Adv. Grace Mwende Musyoka",
    title: "Advocate & Labour Arbitrator",
    firm: "Musyoka & Associates Advocates",
    lskNumber: "P.105/15729/16",
    avatarBg: "from-flag-green to-emerald-700",
    initials: "GM",
    rating: 4.8,
    reviewsCount: 41,
    experienceYears: 10,
    county: "Machakos",
    officeLocation: "Mwatu wa Ngoma St, Machakos Town (Branch in Nairobi CBD)",
    practiceAreas: [
      "Employment & Labour Relations",
      "Family, Succession & Probate",
      "Constitutional & Human Rights",
    ],
    consultationFee: "KSh 2,000 / 30 min",
    hourlyRate: "KSh 4,500 / hr",
    proBono: true,
    languages: ["English", "Swahili", "Kamba"],
    consultationModes: ["video", "in-person", "phone"],
    bio: "Dedicated champion of fair labour practices under Article 41, women's inheritance rights, and domestic worker protection. Empathetic legal counselor with high mediation settlement success.",
    notableMatters: [
      "Recovered KSh 3.2M in unlawful termination compensation for factory workers in Mavoko",
      "Defended widows against disinheritance in customary law inheritance conflicts",
      "Active legal aid volunteer with FIDA Kenya",
    ],
    phone: "+254 727 654 321",
    email: "grace@musyokaadvocates.co.ke",
    officeHours: "Mon - Fri: 8:30 AM - 5:00 PM",
    verified: true,
  },
];

export const initialClientRequests: ClientRequest[] = [
  {
    id: "req-1",
    clientName: "Samuel K.",
    category: "Land, Property & Conveyancing",
    county: "Kiambu",
    title: "Review of Ancestral Land Succession Grant and Transfer",
    description:
      "Our family has received the Confirmation of Grant from the court for our late father's 4-acre shamba in Limuru. We need an advocate to assist with official land registry subdivision, issuance of new title deeds, and stamp duty clearance.",
    urgency: "Within a week",
    consultationPreference: "In-Person",
    budget: "KSh 25,000 - 40,000",
    createdAt: "2 days ago",
    responsesCount: 3,
  },
  {
    id: "req-2",
    clientName: "Mercy A.",
    category: "Employment & Labour Relations",
    county: "Nairobi",
    title: "Unlawful Redundancy Termination & Unpaid Terminal Dues",
    description:
      "Dismissed from my regional logistics coordinator job without proper 30-day notice or statutory redundancy consultation required by the Employment Act 2007. Seeking representation to file a demand letter and claim before the ELRC.",
    urgency: "Immediate (24 hrs)",
    consultationPreference: "Video / Phone",
    budget: "Contingency / Flexible Retainer",
    createdAt: "Yesterday",
    responsesCount: 5,
  },
  {
    id: "req-3",
    clientName: "Kariuki W.",
    category: "Constitutional & Human Rights",
    county: "Mombasa",
    title: "Arbitrary County Trade License Seizure & Harassment",
    description:
      "County enforcement officers confiscated our small enterprise goods without an inventory or fair administrative action notice under Article 47. Need constitutional advocacy to compel restoration and prevent unlawful closure.",
    urgency: "Immediate (24 hrs)",
    consultationPreference: "Any",
    budget: "Pro-bono or Modest Fee",
    createdAt: "3 days ago",
    responsesCount: 2,
  },
];

export const allPracticeAreas: PracticeArea[] = [
  "Constitutional & Human Rights",
  "Land, Property & Conveyancing",
  "Criminal Defense & Bail",
  "Family, Succession & Probate",
  "Employment & Labour Relations",
  "Commercial & Corporate",
  "Public Interest & Environmental",
  "Tech, Media & Data Protection",
];

export const kenyanCounties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Uasin Gishu",
  "Machakos",
  "Kilifi",
  "Kajiado",
  "Nyeri",
  "Meru",
  "Kakamega",
  "Kericho",
  "Garissa",
  "Turkana",
];
