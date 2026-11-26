export type Language = "english" | "hindi" | "punjabi" | "marathi";
export type TutorType = "english" | "krutidev" | "mangal";
export type ToolType = "converter" | "keyboard" | "translator";
export type ExamCategory = "all" | "central" | "railway" | "court" | "state" | "institute" | "police";

export interface ExamPattern {
  id: string;
  name: string;
  category: "central" | "railway" | "court" | "state" | "institute" | "police";
  duration: number;
  speed: string;
  language: string;
  font: string;
  note: string;
  icon: string;
  minSpeedEnglish?: number;
  minSpeedHindi?: number;
  qualification?: string;
  defaultOfficialUrl: string;
}

export interface ExamHistoryItem {
  id: number;
  examId: string;
  examName: string;
  date: string;
  duration: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  words: number;
  required: number | null;
  status: string;
  language: string;
}

export interface TestStats {
  typedText: string;
  correctChars: number;
  errors: number;
  wordsTyped: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  elapsedSec: number;
}

export interface IPortalItem {
  title: string;
  slug?: string;
  officialUrl: string;
  url?: string;
  badge?: string;
  bgColor?: string;
}

export interface ISarkariCategories {
  result: IPortalItem[];
  admitCard: IPortalItem[];
  latestJob: IPortalItem[];
  answerKey: IPortalItem[];
  syllabus: IPortalItem[];
  admission: IPortalItem[];
  certificate: IPortalItem[];
  important: IPortalItem[];
  outsourcing: IPortalItem[];
}

export interface IVersionSummary {
  version: number;
  syncedAt: string;
  isActive: boolean;
}

export interface PortalDataResponse {
  success: boolean;
  snapshot: {
    version: number;
    syncedAt: string;
    isActive: boolean;
    hotUpdates: IPortalItem[];
    categories: ISarkariCategories;
  } | null;
  versions: IVersionSummary[];
}

export const sampleParagraphs: Record<Language, string> = {
  english:
    "Typing speed is an essential asset in the modern digital era. Whether you are working in a corporate office or preparing for government competitive examinations, having good speed and accuracy saves enormous time and increases productivity. Consistent daily practice on structured paragraphs builds keyboard muscle memory effortlessly.",
  hindi:
    "कंप्यूटर पर हिंदी टाइपिंग आज के समय में सरकारी और गैर-सरकारी नौकरियों के लिए एक अत्यंत महत्वपूर्ण कौशल बन चुका है। नियमित अभ्यास से आपकी गति और शुद्धता दोनों में सुधार होता है।",
  punjabi:
    "ਪੰਜਾਬੀ ਟਾਈਪਿੰਗ ਸਿੱਖਣਾ ਬਹੁਤ ਆਸਾਨ ਹੈ ਜਦੋਂ ਤੁਹਾਡੇ ਕੋਲ ਸਹੀ ਟੂਲ ਅਤੇ ਨਿਯਮਤ ਅਭਿਆਸ ਹੋਵੇ। ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ ਨਾਲ ਗਤੀ ਵਧਦੀ ਹੈ।",
  marathi:
    "मराठी टायपिंग कौशल्य आजच्या डिजिटल युगात अत्यंत महत्त्वाचे आहे. नियमित सरावाने टायपिंगचा वेग आणि अचूकता दोन्ही वाढवता येतात.",
};

export const examParagraphTemplates = {
  english: `India's public administration depends on accurate records, timely communication, and careful handling of information. In offices across the country, clerks, assistants, typists, and other staff members prepare letters, maintain registers, update digital records, process applications, and communicate decisions to citizens. A typing skill test measures more than speed alone. Candidates must maintain accuracy while entering continuous text under a fixed time limit. Good performance requires correct spelling, proper spacing, punctuation, capitalization, and steady keyboard control. During regular practice, candidates should first develop accuracy and then increase speed gradually. It is useful to practise with passages containing ordinary administrative vocabulary, names of departments, dates, numbers, public services, and formal sentences. The objective is to reproduce the passage correctly without unnecessary pauses. A candidate who learns to look ahead by a few words can reduce hesitation and maintain a consistent rhythm. Regular practice also helps the fingers become familiar with common letter combinations and reduces dependence on looking at the keyboard. Government offices increasingly use digital systems for correspondence, applications, records, and reporting. Therefore, efficient computer typing remains an important workplace skill for many clerical and administrative positions. Candidates preparing for a recruitment typing test should understand the exact rules of the relevant notification, including the duration, language, minimum speed, font, permitted facilities, and method of error calculation. Practice tests should reproduce these conditions as closely as possible so that the candidate can identify weak areas before the actual examination. Accuracy, consistency, concentration, and disciplined practice together create dependable typing performance.`,
  hindi: `भारत में सरकारी कार्यालयों में कंप्यूटर आधारित कार्य तेजी से बढ़ा है। आवेदन पत्रों की जानकारी दर्ज करना, पत्र तैयार करना, कार्यालयी अभिलेखों को व्यवस्थित करना, रिपोर्ट बनाना और नागरिकों से संबंधित सूचनाओं को डिजिटल प्रणाली में सुरक्षित रखना आज अनेक पदों की जिम्मेदारी का हिस्सा है। इसी कारण हिंदी और अंग्रेजी कंप्यूटर टाइपिंग का नियमित अभ्यास उम्मीदवारों के लिए उपयोगी है। टाइपिंग परीक्षा में केवल गति ही महत्वपूर्ण नहीं होती, बल्कि सही शब्द, उचित विराम चिह्न, सही वर्तनी और लगातार ध्यान बनाए रखना भी आवश्यक है। निश्चित समय में दिए गए अनुच्छेद को सही ढंग से टाइप करने के लिए उम्मीदवार को पहले शुद्धता पर ध्यान देना चाहिए और फिर धीरे-धीरे गति बढ़ानी चाहिए। नियमित अभ्यास से उंगलियों की गति बेहतर होती है और कीबोर्ड पर अनावश्यक रुकावट कम होती है। सरकारी कार्यों में विभागों के नाम, तिथियां, संख्याएं, स्थानों के नाम और औपचारिक भाषा का प्रयोग सामान्य रूप से किया जाता है। इसलिए अभ्यास के दौरान अलग-अलग प्रकार के अनुच्छेदों को टाइप करना उपयोगी रहता है। उम्मीदवार को संबंधित भर्ती की आधिकारिक सूचना में दी गई अवधि, न्यूनतम गति, भाषा, फॉन्ट और त्रुटि गणना की विधि अवश्य देखनी चाहिए। अलग-अलग भर्ती और पद के नियम अलग हो सकते हैं। परीक्षा के समय शांत रहकर लगातार टाइप करना, पहले से अभ्यास किए हुए तरीके को बनाए रखना और अनावश्यक सुधार से बचना प्रदर्शन को बेहतर कर सकता है। नियमित अभ्यास से गति और शुद्धता दोनों में सुधार संभव है।`,
  punjabi: `Government offices increasingly use computers for records, correspondence, applications, reports and public services. A typing skill test checks whether a candidate can enter a continuous passage accurately within a fixed period. Regular practice helps improve keyboard control, spelling, punctuation and steady typing rhythm. Candidates should understand the exact instructions of the recruitment notice before appearing in a skill test. During practice, it is useful to work with formal passages that contain common office words, dates, names and numbers. Accuracy should be developed before attempting very high speed. A consistent rhythm reduces unnecessary pauses and helps the candidate complete more text during the available time.`,
  marathi: `सरकारी आणि प्रशासकीय कार्यालयांमध्ये संगणकावर माहिती नोंदविणे, पत्रव्यवहार करणे, अहवाल तयार करणे आणि विविध नोंदी अद्ययावत ठेवणे ही नियमित कामे आहेत. त्यामुळे संगणक टायपिंगचे कौशल्य अनेक भरती प्रक्रियांमध्ये महत्त्वाचे ठरते. टायपिंग चाचणीमध्ये ठराविक वेळेत दिलेला उतारा अचूकपणे टाइप करणे अपेक्षित असते. वेगाबरोबरच शब्दांची शुद्धता, योग्य अंतर, विरामचिन्हे आणि सातत्यपूर्ण टायपिंग याकडे लक्ष देणे आवश्यक आहे. नियमित सरावामुळे कीबोर्डवरील नियंत्रण सुधारते आणि अनावश्यक थांबे कमी होतात. संबंधित भरतीच्या अधिकृत सूचनेतील वेळ, भाषा, किमान वेग आणि चुका मोजण्याची पद्धत उमेदवाराने आधी समजून घ्यावी.`,
};

export const examPatterns: ExamPattern[] = [
  { id: "ssc_chsl", minSpeedEnglish: 35, minSpeedHindi: 30, qualification: "Minimum 35 WPM English / 30 WPM Hindi", name: "SSC CHSL – LDC / JSA", category: "central", duration: 10, speed: "35 WPM English / 30 WPM Hindi", language: "English / Hindi", font: "Hindi: Mangal / as notified", note: "Typing Test • 10 min", icon: "fa-building-columns", defaultOfficialUrl: "https://ssc.gov.in/" },
  { id: "ssc_cgl_dest", name: "SSC CGL – DEST (selected posts)", category: "central", duration: 15, speed: "DEST / 15-minute test", language: "English", font: "Computer", note: "DEST for applicable posts", icon: "fa-chart-column", defaultOfficialUrl: "https://ssc.gov.in/" },
  { id: "ssc_steno", name: "SSC Stenographer Grade C & D", category: "central", duration: 10, speed: "100 WPM Grade C / 80 WPM Grade D dictation", language: "English / Hindi", font: "Computer transcription", note: "Stenography + transcription", icon: "fa-keyboard", defaultOfficialUrl: "https://ssc.gov.in/" },
  { id: "ssc_selection", name: "SSC Selection Post – typing posts", category: "central", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Post-dependent skill test", icon: "fa-list-check", defaultOfficialUrl: "https://ssc.gov.in/" },
  { id: "rrb_ntpc", minSpeedEnglish: 30, minSpeedHindi: 25, qualification: "Minimum 30 WPM English / 25 WPM Hindi", name: "RRB NTPC – JAA-cum-Typist / Sr. Clerk-cum-Typist", category: "railway", duration: 10, speed: "30 WPM English / 25 WPM Hindi", language: "English / Hindi", font: "Hindi: KrutiDev / Mangal", note: "CBTST • 1 min practice + 30 sec break + 10 min test", icon: "fa-train", defaultOfficialUrl: "https://www.rrbcdg.gov.in/" },
  { id: "rrb_ministerial", name: "RRB Ministerial & Isolated Categories – typing posts", category: "railway", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Post-dependent typing/skill test", icon: "fa-train-subway", defaultOfficialUrl: "https://www.rrbcdg.gov.in/" },
  { id: "india_post_pa_sa", name: "India Post – Postal Assistant / Sorting Assistant", category: "central", duration: 10, speed: "Typing/skill standard as notified", language: "English / Hindi", font: "Computer", note: "Skill test where prescribed", icon: "fa-envelope", defaultOfficialUrl: "https://indiapostgdsonline.gov.in/" },
  { id: "epfo_ssa", name: "EPFO Social Security Assistant (SSA)", category: "central", duration: 10, speed: "Computer typing standard as notified", language: "English / Hindi", font: "Computer", note: "Computer skill / typing", icon: "fa-landmark", defaultOfficialUrl: "https://www.epfindia.gov.in/" },
  { id: "esic_udc", name: "ESIC UDC / clerical typing posts", category: "institute", duration: 10, speed: "35 WPM English / 30 WPM Hindi", language: "English / Hindi", font: "Computer", note: "Typing Skill Test", icon: "fa-hospital", defaultOfficialUrl: "https://www.esic.gov.in/" },
  { id: "aiims_cre_ja", name: "AIIMS CRE – JAA / LDC / UDC", category: "institute", duration: 10, speed: "35 WPM English / 30 WPM Hindi", language: "English / Hindi", font: "Computer", note: "Qualifying typing skill", icon: "fa-hospital-user", defaultOfficialUrl: "https://www.aiimsexams.ac.in/" },
  { id: "dsssb_ja_ldc", minSpeedEnglish: 35, minSpeedHindi: 30, qualification: "Reference standard: 35 WPM English / 30 WPM Hindi", name: "DSSSB – Grade IV / Junior Assistant / LDC", category: "state", duration: 10, speed: "Post-specific typing standard", language: "English / Hindi", font: "Computer", note: "Typing Skill Test", icon: "fa-city", defaultOfficialUrl: "https://dsssb.delhi.gov.in/" },
  { id: "delhi_police_hcm", minSpeedEnglish: 30, minSpeedHindi: 25, qualification: "Minimum speed depends on the notified test/post", name: "Delhi Police Head Constable (Ministerial)", category: "police", duration: 10, speed: "Typing / computer standard as notified", language: "English / Hindi", font: "Computer", note: "Typing-related skill test", icon: "fa-shield-halved", defaultOfficialUrl: "https://delhipolice.gov.in/" },
  { id: "delhi_hc_jja", minSpeedEnglish: 40, qualification: "Reference pattern: 40 WPM English", name: "Delhi High Court – Junior Judicial Assistant / Restorer", category: "court", duration: 10, speed: "40 WPM English (pattern reference)", language: "English", font: "Computer", note: "Typing Test", icon: "fa-scale-balanced", defaultOfficialUrl: "https://delhihighcourt.nic.in/" },
  { id: "allahabad_hc", name: "Allahabad High Court – RO / ARO & typing posts", category: "court", duration: 15, speed: "Post-specific; English/Hindi requirements vary", language: "English / Hindi", font: "KrutiDev / Mangal where prescribed", note: "Computer/typing test", icon: "fa-scale-balanced", defaultOfficialUrl: "https://www.allahabadhighcourt.in/" },
  { id: "upsssc_ja", name: "UPSSSC Junior Assistant", category: "state", duration: 15, speed: "Post/notification-specific Hindi typing", language: "Hindi / English", font: "Computer", note: "Typing Test", icon: "fa-flag", defaultOfficialUrl: "https://upsssc.gov.in/" },
  { id: "uppsc_computer_assistant", name: "UPPSC Computer Assistant", category: "state", duration: 15, speed: "Type Test as notified", language: "English / Hindi", font: "Computer", note: "Type Test", icon: "fa-keyboard", defaultOfficialUrl: "https://uppsc.up.nic.in/" },
  { id: "up_police_asi_clerk", name: "UP Police ASI (Clerk) / ministerial posts", category: "police", duration: 10, speed: "Typing/skill standard as notified", language: "Hindi / English", font: "Computer", note: "Typing-related skill test", icon: "fa-shield", defaultOfficialUrl: "https://uppbpb.gov.in/" },
  { id: "punjab_hc_clerk", name: "Punjab & Haryana High Court – Clerk", category: "court", duration: 10, speed: "Typing/Computer Test", language: "English", font: "Computer", note: "Typing/Computer Test", icon: "fa-scale-balanced", defaultOfficialUrl: "https://highcourtchd.gov.in/" },
  { id: "phhc_steno_typist", name: "Punjab & Haryana High Court – Steno Typist", category: "court", duration: 10, speed: "Steno/typing standard as notified", language: "English", font: "Computer", note: "Steno + typing", icon: "fa-keyboard", defaultOfficialUrl: "https://highcourtchd.gov.in/" },
  { id: "bihar_clerk", name: "Bihar – Clerk / LDC typing recruitments", category: "state", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Typing/skill test where prescribed", icon: "fa-flag", defaultOfficialUrl: "https://bssc.bihar.gov.in/" },
  { id: "rajasthan_lsa", name: "Rajasthan – LDC / Junior Assistant", category: "state", duration: 10, speed: "Hindi/English typing standard as notified", language: "Hindi / English", font: "Computer", note: "Typing Test", icon: "fa-flag", defaultOfficialUrl: "https://hcraj.nic.in/" },
  { id: "haryana_clerk", name: "Haryana – Clerk / Typist recruitments", category: "state", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Typing/skill test where prescribed", icon: "fa-flag", defaultOfficialUrl: "https://hssc.gov.in/" },
  { id: "punjab_sssb_clerk", name: "Punjab SSSB – Clerk / typing posts", category: "state", duration: 10, speed: "Post-specific", language: "English / Punjabi", font: "Computer", note: "Typing/skill test where prescribed", icon: "fa-flag", defaultOfficialUrl: "https://sssb.punjab.gov.in/" },
  { id: "mp_high_court_ag3", name: "MP High Court – Assistant Grade-3 / typing posts", category: "court", duration: 10, speed: "Typing standard as notified", language: "Hindi / English", font: "Computer", note: "Typing Test", icon: "fa-scale-balanced", defaultOfficialUrl: "https://mphc.gov.in/" },
  { id: "mp_cpct", name: "Madhya Pradesh – CPCT-based clerical recruitments", category: "state", duration: 15, speed: "CPCT typing/skill standard", language: "English / Hindi", font: "Computer", note: "CPCT / typing", icon: "fa-keyboard", defaultOfficialUrl: "https://www.cpct.mp.gov.in/" },
  { id: "nvs_junior_secretariat", name: "NVS – Junior Secretariat Assistant", category: "institute", duration: 10, speed: "Typing standard as notified", language: "English / Hindi", font: "Computer", note: "Typing/skill test", icon: "fa-school", defaultOfficialUrl: "https://navodaya.gov.in/" },
  { id: "kvs_junior_secretariat", name: "KVS – Junior Secretariat Assistant", category: "institute", duration: 10, speed: "Typing standard as notified", language: "English / Hindi", font: "Computer", note: "Typing/skill test", icon: "fa-school", defaultOfficialUrl: "https://kvsangathan.nic.in/" },
  { id: "csir_jsa", name: "CSIR – Junior Secretariat Assistant (JSA)", category: "institute", duration: 10, speed: "Computer typing proficiency as notified", language: "English / Hindi", font: "Hindi: Mangal where prescribed", note: "Qualifying typing test", icon: "fa-flask", defaultOfficialUrl: "https://www.csir.res.in/" },
  { id: "court_clerical", name: "District Courts – Clerk / JJA / Typist recruitments", category: "court", duration: 10, speed: "Court-specific typing standard", language: "English / Hindi / regional", font: "Computer", note: "Typing Test", icon: "fa-gavel", defaultOfficialUrl: "https://main.sci.gov.in/" },
  { id: "departmental_ldc", name: "Central Govt Departmental – LDC / JSA / UDC tests", category: "central", duration: 10, speed: "35 WPM English / 30 WPM Hindi where prescribed", language: "English / Hindi", font: "Computer", note: "Departmental typewriting test", icon: "fa-folder-open", defaultOfficialUrl: "https://ssc.gov.in/" },
];

export const tutorLessons: Record<TutorType, string[]> = {
  english: [
    "Lesson 1: Home Row Keys (asdf jkl;)",
    "Lesson 2: Top Row Keys (qwer tyuiop)",
    "Lesson 3: Bottom Row Keys (zxcv bnm)",
    "Lesson 4: Capital Letters & Shifts",
    "Lesson 5: Common English Words",
  ],
  krutidev: [
    "Lesson 1: होम रो कीबोर्ड अभ्यास (एस डी एफ)",
    "Lesson 2: उपरी पंक्ति अभ्यास (कुशल अभ्यास)",
    "Lesson 3: मात्रा और संयुक्त अक्षर अभ्यास",
  ],
  mangal: [
    "Lesson 1: Mangal Inscript Home Row",
    "Lesson 2: Mangal Inscript Top Row",
    "Lesson 3: Devanagari Half Characters",
  ],
};

export const EXAM_HISTORY_KEY = "sarkariSelectionExamHistoryV2";

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function getExamParagraph(e: ExamPattern): string {
  const lang = (e.language || "").toLowerCase();
  let base =
    lang.includes("hindi") && !lang.includes("english")
      ? examParagraphTemplates.hindi
      : lang.includes("punjabi")
      ? examParagraphTemplates.punjabi
      : lang.includes("marathi")
      ? examParagraphTemplates.marathi
      : examParagraphTemplates.english;
  while (base.length < Math.max(900, (e.duration || 10) * 42 * 5)) {
    base +=
      " " +
      (lang.includes("hindi") && !lang.includes("english")
        ? examParagraphTemplates.hindi
        : examParagraphTemplates.english);
  }
  return base;
}

export function getRequiredSpeed(e: ExamPattern): number | null {
  const isHindi = /hindi/i.test(e.language || "") && !/english/i.test(e.language || "");
  return isHindi ? e.minSpeedHindi || null : e.minSpeedEnglish || null;
}

export function getItemSlug(it: IPortalItem): string {
  if (it.slug) return it.slug;
  return it.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 100);
}

