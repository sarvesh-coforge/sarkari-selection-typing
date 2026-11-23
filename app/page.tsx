"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";

type TabId = "home" | "test" | "test-result" | "exam" | "tutor" | "tools" | "game" | "blog";
type Language = "english" | "hindi" | "punjabi" | "marathi";
type ExamCategory = "all" | "central" | "railway" | "court" | "state" | "institute" | "police";

interface ExamPattern {
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
}

interface ExamHistoryItem {
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

interface TestStats {
  typedText: string;
  correctChars: number;
  errors: number;
  wordsTyped: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  elapsedSec: number;
}

const sampleParagraphs: Record<Language, string> = {
  english:
    "Typing speed is an essential asset in the modern digital era. Whether you are working in a corporate office or preparing for government competitive examinations, having good speed and accuracy saves enormous time and increases productivity. Consistent daily practice on structured paragraphs builds keyboard muscle memory effortlessly.",
  hindi:
    "कंप्यूटर पर हिंदी टाइपिंग आज के समय में सरकारी और गैर-सरकारी नौकरियों के लिए एक अत्यंत महत्वपूर्ण कौशल बन चुका है। नियमित अभ्यास से आपकी गति और शुद्धता दोनों में सुधार होता है।",
  punjabi:
    "ਪੰਜਾਬੀ ਟਾਈਪਿੰਗ ਸਿੱਖਣਾ ਬਹੁਤ ਆਸਾਨ ਹੈ ਜਦੋਂ ਤੁਹਾਡੇ ਕੋਲ ਸਹੀ ਟੂਲ ਅਤੇ ਨਿਯਮਤ ਅਭਿਆਸ ਹੋਵੇ। ਰੋਜ਼ਾਨਾ ਅਭਿਆਸ ਨਾਲ ਗਤੀ ਵਧਦੀ ਹੈ।",
  marathi:
    "मराठी टायपिंग कौशल्य आजच्या डिजिटल युगात अत्यंत महत्त्वाचे आहे. नियमित सरावाने टायपिंगचा वेग आणि अचूकता दोन्ही वाढवता येतात.",
};

const examParagraphTemplates = {
  english: `India's public administration depends on accurate records, timely communication, and careful handling of information. In offices across the country, clerks, assistants, typists, and other staff members prepare letters, maintain registers, update digital records, process applications, and communicate decisions to citizens. A typing skill test measures more than speed alone. Candidates must maintain accuracy while entering continuous text under a fixed time limit. Good performance requires correct spelling, proper spacing, punctuation, capitalization, and steady keyboard control. During regular practice, candidates should first develop accuracy and then increase speed gradually. It is useful to practise with passages containing ordinary administrative vocabulary, names of departments, dates, numbers, public services, and formal sentences. The objective is to reproduce the passage correctly without unnecessary pauses. A candidate who learns to look ahead by a few words can reduce hesitation and maintain a consistent rhythm. Regular practice also helps the fingers become familiar with common letter combinations and reduces dependence on looking at the keyboard. Government offices increasingly use digital systems for correspondence, applications, records, and reporting. Therefore, efficient computer typing remains an important workplace skill for many clerical and administrative positions. Candidates preparing for a recruitment typing test should understand the exact rules of the relevant notification, including the duration, language, minimum speed, font, permitted facilities, and method of error calculation. Practice tests should reproduce these conditions as closely as possible so that the candidate can identify weak areas before the actual examination. Accuracy, consistency, concentration, and disciplined practice together create dependable typing performance.`,
  hindi: `भारत में सरकारी कार्यालयों में कंप्यूटर आधारित कार्य तेजी से बढ़ा है। आवेदन पत्रों की जानकारी दर्ज करना, पत्र तैयार करना, कार्यालयी अभिलेखों को व्यवस्थित करना, रिपोर्ट बनाना और नागरिकों से संबंधित सूचनाओं को डिजिटल प्रणाली में सुरक्षित रखना आज अनेक पदों की जिम्मेदारी का हिस्सा है। इसी कारण हिंदी और अंग्रेजी कंप्यूटर टाइपिंग का नियमित अभ्यास उम्मीदवारों के लिए उपयोगी है। टाइपिंग परीक्षा में केवल गति ही महत्वपूर्ण नहीं होती, बल्कि सही शब्द, उचित विराम चिह्न, सही वर्तनी और लगातार ध्यान बनाए रखना भी आवश्यक है। निश्चित समय में दिए गए अनुच्छेद को सही ढंग से टाइप करने के लिए उम्मीदवार को पहले शुद्धता पर ध्यान देना चाहिए और फिर धीरे-धीरे गति बढ़ानी चाहिए। नियमित अभ्यास से उंगलियों की गति बेहतर होती है और कीबोर्ड पर अनावश्यक रुकावट कम होती है। सरकारी कार्यों में विभागों के नाम, तिथियां, संख्याएं, स्थानों के नाम और औपचारिक भाषा का प्रयोग सामान्य रूप से किया जाता है। इसलिए अभ्यास के दौरान अलग-अलग प्रकार के अनुच्छेदों को टाइप करना उपयोगी रहता है। उम्मीदवार को संबंधित भर्ती की आधिकारिक सूचना में दी गई अवधि, न्यूनतम गति, भाषा, फॉन्ट और त्रुटि गणना की विधि अवश्य देखनी चाहिए। अलग-अलग भर्ती और पद के नियम अलग हो सकते हैं। परीक्षा के समय शांत रहकर लगातार टाइप करना, पहले से अभ्यास किए हुए तरीके को बनाए रखना और अनावश्यक सुधार से बचना प्रदर्शन को बेहतर कर सकता है। नियमित अभ्यास से गति और शुद्धता दोनों में सुधार संभव है।`,
  punjabi: `Government offices increasingly use computers for records, correspondence, applications, reports and public services. A typing skill test checks whether a candidate can enter a continuous passage accurately within a fixed period. Regular practice helps improve keyboard control, spelling, punctuation and steady typing rhythm. Candidates should understand the exact instructions of the recruitment notice before appearing in a skill test. During practice, it is useful to work with formal passages that contain common office words, dates, names and numbers. Accuracy should be developed before attempting very high speed. A consistent rhythm reduces unnecessary pauses and helps the candidate complete more text during the available time.`,
  marathi: `सरकारी आणि प्रशासकीय कार्यालयांमध्ये संगणकावर माहिती नोंदविणे, पत्रव्यवहार करणे, अहवाल तयार करणे आणि विविध नोंदी अद्ययावत ठेवणे ही नियमित कामे आहेत. त्यामुळे संगणक टायपिंगचे कौशल्य अनेक भरती प्रक्रियांमध्ये महत्त्वाचे ठरते. टायपिंग चाचणीमध्ये ठराविक वेळेत दिलेला उतारा अचूकपणे टाइप करणे अपेक्षित असते. वेगाबरोबरच शब्दांची शुद्धता, योग्य अंतर, विरामचिन्हे आणि सातत्यपूर्ण टायपिंग याकडे लक्ष देणे आवश्यक आहे. नियमित सरावामुळे कीबोर्डवरील नियंत्रण सुधारते आणि अनावश्यक थांबे कमी होतात. संबंधित भरतीच्या अधिकृत सूचनेतील वेळ, भाषा, किमान वेग आणि चुका मोजण्याची पद्धत उमेदवाराने आधी समजून घ्यावी.`,
};

const examPatterns: ExamPattern[] = [
  { id: "ssc_chsl", minSpeedEnglish: 35, minSpeedHindi: 30, qualification: "Minimum 35 WPM English / 30 WPM Hindi", name: "SSC CHSL – LDC / JSA", category: "central", duration: 10, speed: "35 WPM English / 30 WPM Hindi", language: "English / Hindi", font: "Hindi: Mangal / as notified", note: "Typing Test • 10 min", icon: "fa-building-columns" },
  { id: "ssc_cgl_dest", name: "SSC CGL – DEST (selected posts)", category: "central", duration: 15, speed: "DEST / 15-minute test", language: "English", font: "Computer", note: "DEST for applicable posts", icon: "fa-chart-column" },
  { id: "ssc_steno", name: "SSC Stenographer Grade C & D", category: "central", duration: 10, speed: "100 WPM Grade C / 80 WPM Grade D dictation", language: "English / Hindi", font: "Computer transcription", note: "Stenography + transcription", icon: "fa-keyboard" },
  { id: "ssc_selection", name: "SSC Selection Post – typing posts", category: "central", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Post-dependent skill test", icon: "fa-list-check" },
  { id: "rrb_ntpc", minSpeedEnglish: 30, minSpeedHindi: 25, qualification: "Minimum 30 WPM English / 25 WPM Hindi", name: "RRB NTPC – JAA-cum-Typist / Sr. Clerk-cum-Typist", category: "railway", duration: 10, speed: "30 WPM English / 25 WPM Hindi", language: "English / Hindi", font: "Hindi: KrutiDev / Mangal", note: "CBTST • 1 min practice + 30 sec break + 10 min test", icon: "fa-train" },
  { id: "rrb_ministerial", name: "RRB Ministerial & Isolated Categories – typing posts", category: "railway", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Post-dependent typing/skill test", icon: "fa-train-subway" },
  { id: "india_post_pa_sa", name: "India Post – Postal Assistant / Sorting Assistant", category: "central", duration: 10, speed: "Typing/skill standard as notified", language: "English / Hindi", font: "Computer", note: "Skill test where prescribed", icon: "fa-envelope" },
  { id: "epfo_ssa", name: "EPFO Social Security Assistant (SSA)", category: "central", duration: 10, speed: "Computer typing standard as notified", language: "English / Hindi", font: "Computer", note: "Computer skill / typing", icon: "fa-landmark" },
  { id: "esic_udc", name: "ESIC UDC / clerical typing posts", category: "institute", duration: 10, speed: "35 WPM English / 30 WPM Hindi", language: "English / Hindi", font: "Computer", note: "Typing Skill Test", icon: "fa-hospital" },
  { id: "aiims_cre_ja", name: "AIIMS CRE – JAA / LDC / UDC", category: "institute", duration: 10, speed: "35 WPM English / 30 WPM Hindi", language: "English / Hindi", font: "Computer", note: "Qualifying typing skill", icon: "fa-hospital-user" },
  { id: "dsssb_ja_ldc", minSpeedEnglish: 35, minSpeedHindi: 30, qualification: "Reference standard: 35 WPM English / 30 WPM Hindi", name: "DSSSB – Grade IV / Junior Assistant / LDC", category: "state", duration: 10, speed: "Post-specific typing standard", language: "English / Hindi", font: "Computer", note: "Typing Skill Test", icon: "fa-city" },
  { id: "delhi_police_hcm", minSpeedEnglish: 30, minSpeedHindi: 25, qualification: "Minimum speed depends on the notified test/post", name: "Delhi Police Head Constable (Ministerial)", category: "police", duration: 10, speed: "Typing / computer standard as notified", language: "English / Hindi", font: "Computer", note: "Typing-related skill test", icon: "fa-shield-halved" },
  { id: "delhi_hc_jja", minSpeedEnglish: 40, qualification: "Reference pattern: 40 WPM English", name: "Delhi High Court – Junior Judicial Assistant / Restorer", category: "court", duration: 10, speed: "40 WPM English (pattern reference)", language: "English", font: "Computer", note: "Typing Test", icon: "fa-scale-balanced" },
  { id: "allahabad_hc", name: "Allahabad High Court – RO / ARO & typing posts", category: "court", duration: 15, speed: "Post-specific; English/Hindi requirements vary", language: "English / Hindi", font: "KrutiDev / Mangal where prescribed", note: "Computer/typing test", icon: "fa-scale-balanced" },
  { id: "upsssc_ja", name: "UPSSSC Junior Assistant", category: "state", duration: 15, speed: "Post/notification-specific Hindi typing", language: "Hindi / English", font: "Computer", note: "Typing Test", icon: "fa-flag" },
  { id: "uppsc_computer_assistant", name: "UPPSC Computer Assistant", category: "state", duration: 15, speed: "Type Test as notified", language: "English / Hindi", font: "Computer", note: "Type Test", icon: "fa-keyboard" },
  { id: "up_police_asi_clerk", name: "UP Police ASI (Clerk) / ministerial posts", category: "police", duration: 10, speed: "Typing/skill standard as notified", language: "Hindi / English", font: "Computer", note: "Typing-related skill test", icon: "fa-shield" },
  { id: "punjab_hc_clerk", name: "Punjab & Haryana High Court – Clerk", category: "court", duration: 10, speed: "Typing/Computer Test", language: "English", font: "Computer", note: "Typing/Computer Test", icon: "fa-scale-balanced" },
  { id: "phhc_steno_typist", name: "Punjab & Haryana High Court – Steno Typist", category: "court", duration: 10, speed: "Steno/typing standard as notified", language: "English", font: "Computer", note: "Steno + typing", icon: "fa-keyboard" },
  { id: "bihar_clerk", name: "Bihar – Clerk / LDC typing recruitments", category: "state", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Typing/skill test where prescribed", icon: "fa-flag" },
  { id: "rajasthan_lsa", name: "Rajasthan – LDC / Junior Assistant", category: "state", duration: 10, speed: "Hindi/English typing standard as notified", language: "Hindi / English", font: "Computer", note: "Typing Test", icon: "fa-flag" },
  { id: "haryana_clerk", name: "Haryana – Clerk / Typist recruitments", category: "state", duration: 10, speed: "Post-specific", language: "English / Hindi", font: "Computer", note: "Typing/skill test where prescribed", icon: "fa-flag" },
  { id: "punjab_sssb_clerk", name: "Punjab SSSB – Clerk / typing posts", category: "state", duration: 10, speed: "Post-specific", language: "English / Punjabi", font: "Computer", note: "Typing/skill test where prescribed", icon: "fa-flag" },
  { id: "mp_high_court_ag3", name: "MP High Court – Assistant Grade-3 / typing posts", category: "court", duration: 10, speed: "Typing standard as notified", language: "Hindi / English", font: "Computer", note: "Typing Test", icon: "fa-scale-balanced" },
  { id: "mp_cpct", name: "Madhya Pradesh – CPCT-based clerical recruitments", category: "state", duration: 15, speed: "CPCT typing/skill standard", language: "English / Hindi", font: "Computer", note: "CPCT / typing", icon: "fa-keyboard" },
  { id: "nvs_junior_secretariat", name: "NVS – Junior Secretariat Assistant", category: "institute", duration: 10, speed: "Typing standard as notified", language: "English / Hindi", font: "Computer", note: "Typing/skill test", icon: "fa-school" },
  { id: "kvs_junior_secretariat", name: "KVS – Junior Secretariat Assistant", category: "institute", duration: 10, speed: "Typing standard as notified", language: "English / Hindi", font: "Computer", note: "Typing/skill test", icon: "fa-school" },
  { id: "csir_jsa", name: "CSIR – Junior Secretariat Assistant (JSA)", category: "institute", duration: 10, speed: "Computer typing proficiency as notified", language: "English / Hindi", font: "Hindi: Mangal where prescribed", note: "Qualifying typing test", icon: "fa-flask" },
  { id: "court_clerical", name: "District Courts – Clerk / JJA / Typist recruitments", category: "court", duration: 10, speed: "Court-specific typing standard", language: "English / Hindi / regional", font: "Computer", note: "Typing Test", icon: "fa-gavel" },
  { id: "departmental_ldc", name: "Central Govt Departmental – LDC / JSA / UDC tests", category: "central", duration: 10, speed: "35 WPM English / 30 WPM Hindi where prescribed", language: "English / Hindi", font: "Computer", note: "Departmental typewriting test", icon: "fa-folder-open" },
];

const tutorLessons: Record<"english" | "krutidev" | "mangal", string[]> = {
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

const EXAM_HISTORY_KEY = "rvTypingMasterExamHistoryV2";

export default function RootTypingPortalPage() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth & Subscription Modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "pricing">("login");
  const [authButtonText, setAuthButtonText] = useState("Login / Subscribe");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Feedback Modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  // Typing Test States
  const [testLang, setTestLangState] = useState<Language>("english");
  const [testDuration, setTestDuration] = useState<number>(5);
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(300);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(false);
  const [testParagraph, setTestParagraph] = useState<string>(sampleParagraphs.english);
  const [typedInput, setTypedInput] = useState<string>("");
  const [testStatusMsg, setTestStatusMsg] = useState<string>(
    "Click in the text area above or press Start to begin test."
  );
  const [examPracticeMode, setExamPracticeMode] = useState<boolean>(false);
  const [examPracticePattern, setExamPracticePattern] = useState<ExamPattern | null>(null);
  const [examPracticeParagraph, setExamPracticeParagraph] = useState<string>("");
  const [lastResultStats, setLastResultStats] = useState<TestStats | null>(null);
  const [lastResultQualified, setLastResultQualified] = useState<boolean | null>(null);
  const [lastResultRequired, setLastResultRequired] = useState<number | null>(null);

  const testTimerRef = useRef<NodeJS.Timeout | null>(null);
  const testInputRef = useRef<HTMLTextAreaElement>(null);

  // Exam Mode Filter States
  const [selectedExamId, setSelectedExamId] = useState<string>(examPatterns[0].id);
  const [examCategory, setExamCategory] = useState<ExamCategory>("all");
  const [examSearch, setExamSearch] = useState<string>("");
  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>([]);

  // Typing Tutor States
  const [tutorType, setTutorType] = useState<"english" | "krutidev" | "mangal">("english");
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string>(
    "Lesson 1: Home Row Keys (asdf jkl;)"
  );
  const [tutorPrompt, setTutorPrompt] = useState<string>("asdf jkl; asdf jkl; asdf jkl;");
  const [tutorInput, setTutorInput] = useState<string>("");

  // Tools Tab States
  const [selectedTool, setSelectedTool] = useState<"converter" | "keyboard" | "translator">("converter");
  const [inputKrutiText, setInputKrutiText] = useState<string>("");
  const [outputUnicodeText, setOutputUnicodeText] = useState<string>("");
  const [virtualKeyInput, setVirtualKeyInput] = useState<string>("");
  const [sourceTransText, setSourceTransText] = useState<string>("");
  const [outputTransText, setOutputTransText] = useState<string>("");

  // Word Blaster Arcade Game States
  const gameWordsList = useMemo(
    () => [
      "KEYBOARD", "SPEED", "ACCURACY", "PRACTICE", "EXAM", "SUCCESS", "PYTHON", "REACT",
      "TYPING", "MASTER", "DEVELOP", "FUTURE", "LEARN", "DIGITAL", "OFFICE"
    ],
    []
  );
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameMissed, setGameMissed] = useState<number>(0);
  const [targetWord, setTargetWord] = useState<string>("READY?");
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameInput, setGameInput] = useState<string>("");

  // Toast / alert helper
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Hydrate exam history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(EXAM_HISTORY_KEY);
      if (saved) {
        setExamHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveExamHistoryItem = (item: ExamHistoryItem) => {
    const updated = [item, ...examHistory].slice(0, 100);
    setExamHistory(updated);
    try {
      localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearExamHistory = () => {
    if (confirm("Clear all saved typing test history?")) {
      setExamHistory([]);
      try {
        localStorage.removeItem(EXAM_HISTORY_KEY);
      } catch {
        // ignore
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getExamParagraph = (e: ExamPattern) => {
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
      base += " " + (lang.includes("hindi") && !lang.includes("english") ? examParagraphTemplates.hindi : examParagraphTemplates.english);
    }
    return base;
  };

  const getRequiredSpeed = (e: ExamPattern, typed: string) => {
    const isHindi = /hindi/i.test(e.language || "") && !/english/i.test(e.language || "");
    return isHindi ? e.minSpeedHindi || null : e.minSpeedEnglish || null;
  };

  // Typing Test Stats Calculation
  const calculateTestStats = (): TestStats => {
    const target = examPracticeMode ? examPracticeParagraph : sampleParagraphs[testLang];
    const typed = typedInput;

    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < typed.length; i++) {
      if (i < target.length) {
        if (typed[i] === target[i]) {
          correctChars++;
        } else {
          errors++;
        }
      } else {
        errors++;
      }
    }

    const durationMin = examPracticeMode && examPracticePattern ? examPracticePattern.duration : testDuration;
    const elapsedSec = Math.max(1, durationMin * 60 - testTimeRemaining);
    const elapsedMin = elapsedSec / 60;

    const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
    const grossWpm = Math.round(typed.length / 5 / elapsedMin);
    const netWpm = Math.max(0, Math.round(correctChars / 5 / elapsedMin));
    const accuracy = typed.length > 0 ? Math.max(0, Math.round((correctChars / typed.length) * 100)) : 100;

    return {
      typedText: typed,
      correctChars,
      errors,
      wordsTyped,
      grossWpm,
      netWpm,
      accuracy,
      elapsedSec: testStarted ? elapsedSec : 0,
    };
  };

  const liveStats = useMemo(() => {
    return calculateTestStats();
  }, [typedInput, testTimeRemaining, testLang, examPracticeMode, examPracticeParagraph, testDuration]);

  // Timer loop
  useEffect(() => {
    if (testStarted && testTimeRemaining > 0) {
      testTimerRef.current = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(testTimerRef.current!);
            finishTypingTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    }
    return () => {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, [testStarted, testTimeRemaining]);

  const resetTest = () => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    setTestStarted(false);
    setIsFullscreenActive(false);

    const durationMin = examPracticeMode && examPracticePattern ? examPracticePattern.duration : testDuration;
    setTestTimeRemaining(durationMin * 60);
    setTypedInput("");
    setTestParagraph(examPracticeMode ? examPracticeParagraph : sampleParagraphs[testLang] || sampleParagraphs.english);
    setTestStatusMsg(
      examPracticeMode && examPracticePattern
        ? `Ready for ${examPracticePattern.name}. Click Start Test or begin typing in full-screen mode.`
        : "Test ready. Type in the text area above or press Start Test for full-screen view."
    );
  };

  const startTypingTest = (preserveTyped = false) => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    const durationMin = examPracticeMode && examPracticePattern ? examPracticePattern.duration : testDuration;
    setTestTimeRemaining(durationMin * 60);

    setTestParagraph(examPracticeMode ? examPracticeParagraph : sampleParagraphs[testLang] || sampleParagraphs.english);
    if (!preserveTyped) setTypedInput("");
    setTestStatusMsg("Test in progress (Full-Screen Mode)...");
    setTestStarted(true);
    setIsFullscreenActive(true);

    setTimeout(() => {
      if (testInputRef.current) {
        testInputRef.current.focus();
      }
    }, 100);
  };

  const finishTypingTest = () => {
    const wasStarted = testStarted;
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    setTestStarted(false);
    setIsFullscreenActive(false);

    const stats = calculateTestStats();
    setLastResultStats(stats);

    const durationMin = examPracticeMode && examPracticePattern ? examPracticePattern.duration : testDuration;
    const timeUsed = wasStarted ? stats.elapsedSec : 0;

    if (examPracticeMode && examPracticePattern) {
      const e = examPracticePattern;
      const required = getRequiredSpeed(e, stats.typedText);
      const qualified = required ? wasStarted && stats.netWpm >= required : null;
      const status = qualified === null ? "Practice / Cutoff varies" : qualified ? "QUALIFIED" : "NOT QUALIFIED";

      setLastResultRequired(required);
      setLastResultQualified(qualified);

      saveExamHistoryItem({
        id: Date.now(),
        examId: e.id,
        examName: e.name,
        date: new Date().toLocaleString("en-IN"),
        duration: timeUsed,
        grossWpm: wasStarted ? stats.grossWpm : 0,
        netWpm: wasStarted ? stats.netWpm : 0,
        accuracy: stats.accuracy,
        errors: stats.errors,
        words: stats.wordsTyped,
        required,
        status,
        language: e.language,
      });
    } else {
      setLastResultRequired(null);
      setLastResultQualified(null);
    }

    setActiveTab("test-result");
  };

  const switchTab = (tab: TabId) => {
    if (tab !== "test") {
      setIsFullscreenActive(false);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setTestLangFromDropdown = (lang: Language) => {
    setExamPracticeMode(false);
    setExamPracticePattern(null);
    setExamPracticeParagraph("");
    setTestLangState(lang);
    setTestParagraph(sampleParagraphs[lang]);
    resetTest();
    switchTab("test");
  };

  // Exam Selection
  const activeSelectedExam = useMemo(() => {
    return examPatterns.find((e) => e.id === selectedExamId) || examPatterns[0];
  }, [selectedExamId]);

  const filteredExams = useMemo(() => {
    const q = examSearch.toLowerCase().trim();
    return examPatterns.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(q) || e.note.toLowerCase().includes(q) || e.speed.toLowerCase().includes(q);
      const matchCat = examCategory === "all" || e.category === examCategory;
      return matchSearch && matchCat;
    });
  }, [examSearch, examCategory]);

  const startOfficialExam = () => {
    const e = activeSelectedExam;
    if (!e) return;

    setExamPracticeMode(true);
    setExamPracticePattern(e);
    const p = getExamParagraph(e);
    setExamPracticeParagraph(p);
    setTestParagraph(p);

    const lang: Language = /hindi/i.test(e.language || "") && !/english/i.test(e.language || "") ? "hindi" : "english";
    setTestLangState(lang);
    setTestDuration(e.duration);

    setActiveTab("test");
    resetTest();
    setTestStatusMsg(`${e.name} selected. Click Start Test to begin typing in full-screen view.`);
  };

  // Converter Handlers
  const convertFontText = () => {
    const converted = inputKrutiText
      .replace(/d{k/g, "दक्ष")
      .replace(/Hkkjr/g, "भारत")
      .replace(/Ldwy/g, "स्कूल");
    setOutputUnicodeText(converted || "Converted Unicode Output: " + inputKrutiText);
  };

  const copyConvertedText = () => {
    navigator.clipboard.writeText(outputUnicodeText);
    triggerToast("Converted text copied to clipboard!");
  };

  const performTranslation = () => {
    setOutputTransText(sourceTransText ? "हिंदी अनुवाद: " + sourceTransText : "Please enter text to translate.");
  };

  // Word Blaster Arcade Logic
  const startWordGame = () => {
    setGameScore(0);
    setGameMissed(0);
    setGameActive(true);
    setGameInput("");
    const randomIndex = Math.floor(Math.random() * gameWordsList.length);
    setTargetWord(gameWordsList[randomIndex]);
  };

  const handleWordGameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedVal = e.target.value.trim().toUpperCase();
    setGameInput(e.target.value);
    if (typedVal === targetWord) {
      setGameScore((prev) => prev + 10);
      setGameInput("");
      const randomIndex = Math.floor(Math.random() * gameWordsList.length);
      setTargetWord(gameWordsList[randomIndex]);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 border border-slate-700 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER (Exact RV TypingMaster / Sarkari Selection Navigation Bar) */}
      <header className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div
              className="flex items-center space-x-3 cursor-pointer shrink-0 py-2"
              onClick={() => switchTab("home")}
            >
              <svg
                className="w-10 h-10 shrink-0 drop-shadow"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="100" height="100" rx="20" fill="#1e3a8a" />
                <rect x="12" y="24" width="76" height="52" rx="10" fill="#ffffff" />
                <path
                  d="M22 40H30M38 40H46M54 40H62M70 40H78M26 52H34M42 50H58M66 52H74"
                  stroke="#1e3a8a"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <rect x="35" y="62" width="30" height="8" rx="4" fill="#f59e0b" />
                <circle cx="82" cy="20" r="12" fill="#f59e0b" />
                <text x="82" y="24" fontSize="14" fontWeight="900" fill="#1e3a8a" textAnchor="middle">
                  RV
                </text>
              </svg>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white whitespace-nowrap">
                  RV <span className="text-amber-400">TypingMaster</span>
                </span>
                <span className="text-[11px] text-blue-200 tracking-wide font-medium whitespace-nowrap">
                  Sarkari Selection • India&apos;s Leading Typing &amp; Exam Portal
                </span>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden xl:flex items-center space-x-1 shrink-0">
              <button
                onClick={() => switchTab("home")}
                className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "home" ? "text-amber-300 font-bold" : "text-white"
                }`}
              >
                <i className="fa-solid fa-house"></i> Home
              </button>

              {/* Typing Test Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => switchTab("test")}
                  className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === "test" || activeTab === "test-result" ? "text-amber-300 font-bold" : "text-white"
                  }`}
                >
                  <i className="fa-solid fa-stopwatch"></i> Typing Test{" "}
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
                <div className="absolute left-0 mt-0 w-48 bg-white text-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block border border-slate-200 z-50">
                  <span
                    onClick={() => setTestLangFromDropdown("english")}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-globe mr-2 text-blue-600"></i> English Test
                  </span>
                  <span
                    onClick={() => setTestLangFromDropdown("hindi")}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-language mr-2 text-blue-600"></i> Hindi Test
                  </span>
                  <span
                    onClick={() => setTestLangFromDropdown("punjabi")}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-feather mr-2 text-blue-600"></i> Punjabi Test
                  </span>
                  <span
                    onClick={() => setTestLangFromDropdown("marathi")}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-pen-nib mr-2 text-blue-600"></i> Marathi Test
                  </span>
                </div>
              </div>

              {/* Exam Menu */}
              <button
                onClick={() => switchTab("exam")}
                className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "exam" ? "text-amber-300 font-bold" : "text-amber-300"
                }`}
              >
                <i className="fa-solid fa-graduation-cap"></i> Exam Mode
              </button>

              {/* Typing Tutor Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => switchTab("tutor")}
                  className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === "tutor" ? "text-amber-300 font-bold" : "text-white"
                  }`}
                >
                  <i className="fa-solid fa-chalkboard-user"></i> Typing Tutor{" "}
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
                <div className="absolute left-0 mt-0 w-52 bg-white text-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block border border-slate-200 z-50">
                  <span
                    onClick={() => {
                      setTutorType("english");
                      switchTab("tutor");
                    }}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    English Tutor
                  </span>
                  <span
                    onClick={() => {
                      setTutorType("krutidev");
                      switchTab("tutor");
                    }}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    KrutiDev Hindi Tutor
                  </span>
                  <span
                    onClick={() => {
                      setTutorType("mangal");
                      switchTab("tutor");
                    }}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    Mangal Inscript Tutor
                  </span>
                </div>
              </div>

              {/* Tools & Converters Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => switchTab("tools")}
                  className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === "tools" ? "text-amber-300 font-bold" : "text-white"
                  }`}
                >
                  <i className="fa-solid fa-screwdriver-wrench"></i> Tools{" "}
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
                <div className="absolute left-0 mt-0 w-56 bg-white text-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block border border-slate-200 z-50">
                  <span
                    onClick={() => {
                      setSelectedTool("converter");
                      switchTab("tools");
                    }}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-font mr-2 text-indigo-600"></i> Krutidev to Unicode
                  </span>
                  <span
                    onClick={() => {
                      setSelectedTool("keyboard");
                      switchTab("tools");
                    }}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-keyboard mr-2 text-indigo-600"></i> Virtual Keyboard
                  </span>
                  <span
                    onClick={() => {
                      setSelectedTool("translator");
                      switchTab("tools");
                    }}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-language mr-2 text-indigo-600"></i> Translator
                  </span>
                </div>
              </div>

              {/* Games Menu */}
              <button
                onClick={() => switchTab("game")}
                className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "game" ? "text-amber-300 font-bold" : "text-white"
                }`}
              >
                <i className="fa-solid fa-gamepad"></i> Word Blaster Game
              </button>

              {/* Blog & Info */}
              <button
                onClick={() => switchTab("blog")}
                className={`px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "blog" ? "text-amber-300 font-bold" : "text-white"
                }`}
              >
                <i className="fa-solid fa-blog"></i> Blog &amp; FAQ
              </button>
            </nav>

            {/* Auth & Mobile Actions */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => {
                  setAuthMode("pricing");
                  setShowAuthModal(true);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-4 py-2 rounded-lg text-sm shadow transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <i className="fa-solid fa-crown text-amber-800"></i>
                <span>{authButtonText}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden text-white focus:outline-none p-2 rounded-md hover:bg-blue-800"
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-blue-900 border-t border-blue-800 px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => {
                switchTab("home");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              <i className="fa-solid fa-house mr-2"></i> Home
            </button>
            <button
              onClick={() => {
                switchTab("test");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              <i className="fa-solid fa-stopwatch mr-2"></i> Typing Tests
            </button>
            <button
              onClick={() => {
                switchTab("exam");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 text-amber-300"
            >
              <i className="fa-solid fa-graduation-cap mr-2"></i> Exam Mode
            </button>
            <button
              onClick={() => {
                switchTab("tutor");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              <i className="fa-solid fa-chalkboard-user mr-2"></i> Typing Tutor
            </button>
            <button
              onClick={() => {
                switchTab("tools");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              <i className="fa-solid fa-screwdriver-wrench mr-2"></i> Tools &amp; Converters
            </button>
            <button
              onClick={() => {
                switchTab("game");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              <i className="fa-solid fa-gamepad mr-2"></i> Word Blaster Game
            </button>
            <button
              onClick={() => {
                switchTab("blog");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              <i className="fa-solid fa-blog mr-2"></i> Blog &amp; FAQ
            </button>
          </div>
        )}
      </header>

      {/* AUTH & SUBSCRIPTION MODAL (₹100/mo + 1 Week Free) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-slate-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl mx-auto shadow-sm">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Member Portal &amp; Subscriptions</h3>
              <p className="text-xs text-slate-500">Get unlimited exam simulations with 1 Week Free Trial!</p>
            </div>

            {/* Tab Switcher inside Modal */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setAuthMode("login")}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  authMode === "login" ? "bg-white shadow text-slate-900" : "text-slate-600"
                }`}
              >
                Login / Signup
              </button>
              <button
                onClick={() => setAuthMode("pricing")}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  authMode === "pricing" ? "bg-white shadow text-slate-900" : "text-slate-600"
                }`}
              >
                Subscription Plan
              </button>
            </div>

            {/* VIEW 1: LOGIN / SIGNUP FORM */}
            {authMode === "login" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!loginEmail) {
                      alert("Please enter your email address.");
                      return;
                    }
                    setAuthButtonText(loginEmail.split("@")[0]);
                    setShowAuthModal(false);
                    triggerToast(`Successfully logged in as ${loginEmail}!`);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition"
                >
                  Login to Account
                </button>
              </div>
            )}

            {/* VIEW 2: MONTHLY SUBSCRIPTION PLAN (₹100/mo with 1 Week Free) */}
            {authMode === "pricing" && (
              <div className="space-y-4">
                <div className="border-2 border-amber-500 bg-amber-50/40 p-5 rounded-2xl space-y-3 relative shadow-sm">
                  <span className="absolute -top-3 right-4 bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase shadow">
                    1 Week Free Trial
                  </span>
                  <div className="font-black text-slate-900 text-lg">RV TypingMaster Pro Pass</div>
                  <div className="text-3xl font-black text-blue-600">
                    ₹100 <span className="text-xs text-slate-500 font-normal">/ month</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unlock all official competitive exam boards (SSC, High Court, Banking), advanced analytics, and
                    ad-free practice.
                  </p>
                  <button
                    onClick={() => {
                      triggerToast("Congratulations! Your 1-Week Free Trial (₹100/mo after) has been activated!");
                      setShowAuthModal(false);
                      setAuthButtonText("Pro (Free Trial)");
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl text-sm shadow transition"
                  >
                    Start 1-Week Free Trial Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-slate-200">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl mx-auto shadow-sm">
                <i className="fa-solid fa-comments"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Share Your Feedback</h3>
              <p className="text-xs text-slate-500">We value your review to improve our typing platform.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Review / Message</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write your experience with RV TypingMaster..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <button
                onClick={() => {
                  if (!feedbackName || !feedbackText) {
                    alert("Please fill in both your name and feedback message.");
                    return;
                  }
                  triggerToast(`Thank you, ${feedbackName}! Your feedback has been submitted.`);
                  setFeedbackName("");
                  setFeedbackText("");
                  setShowFeedbackModal(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ============================================================== */}
        {/* TAB 1: HOME VIEW (EXACT MATCH TO THE UPLOADED SCREENSHOT) */}
        {/* ============================================================== */}
        {activeTab === "home" && (
          <section className="space-y-12">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl">
                <i className="fa-solid fa-keyboard"></i>
              </div>
              <div className="max-w-3xl space-y-4 relative z-10">
                <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  India&apos;s #1 Typing Suite
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Master Your Speed with <span className="text-amber-400">RV TypingMaster</span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg">
                  Comprehensive typing tests, government exam simulations, multilingual tutors, and typing arcade
                  games in one lightning-fast platform.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => switchTab("test")}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-play"></i> Start Typing Test
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("pricing");
                      setShowAuthModal(true);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-gift"></i> Claim 1-Week Free Trial (₹100/mo)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Access Tool Cards */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-th-large text-blue-600"></i> Explore Our Suite of Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  onClick={() => switchTab("test")}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                    <i className="fa-solid fa-stopwatch"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Typing Tests</h3>
                  <p className="text-sm text-slate-600">
                    Practice tests in English, Hindi, Punjabi &amp; Marathi with instant speed analytics.
                  </p>
                </div>

                <div
                  onClick={() => switchTab("exam")}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4 group-hover:bg-amber-500 group-hover:text-slate-900 transition">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Exam Mode</h3>
                  <p className="text-sm text-slate-600">
                    Official exam pattern simulation for SSC, Banking, and State Govt recruitment.
                  </p>
                </div>

                <div
                  onClick={() => switchTab("tutor")}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl mb-4 group-hover:bg-green-600 group-hover:text-white transition">
                    <i className="fa-solid fa-chalkboard-user"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Typing Tutors</h3>
                  <p className="text-sm text-slate-600">
                    Step-by-step lessons for English, KrutiDev Hindi, and Mangal Inscript layouts.
                  </p>
                </div>

                <div
                  onClick={() => switchTab("game")}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 cursor-pointer transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                    <i className="fa-solid fa-gamepad"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Word Blaster Game</h3>
                  <p className="text-sm text-slate-600">
                    Play our exciting typing game to boost your reflexes and keyboard muscle memory.
                  </p>
                </div>
              </div>
            </div>

            {/* ABOUT US SECTION */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  About RV TypingMaster
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Empowering Aspirants Across India with Precision Typing
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-sm leading-relaxed">
                <p>
                  <strong>RV TypingMaster</strong> was engineered with a singular mission: to provide candidates
                  preparing for competitive government examinations and corporate careers with the most accurate,
                  reliable, and user-friendly typing practice environment. Whether you are aiming for SSC CHSL,
                  Allahabad High Court RO/ARO, or banking positions, our platform matches exact government examination
                  evaluation algorithms.
                </p>
                <p>
                  We combine cutting-edge web technologies with clean interfaces to ensure zero input lag. From
                  multilingual transliteration tools to legacy font converters (KrutiDev to Unicode) and arcade typing
                  games, everything you need to transform from a novice to a professional touch-typist is available in
                  one place.
                </p>
              </div>
            </div>

            {/* WHY CHOOSE US SECTION */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Our Core Strengths
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Choose RV TypingMaster?</h2>
                <p className="text-sm text-slate-600">
                  Discover what makes our platform the preferred choice for over 50,000 aspirants.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    <i className="fa-solid fa-bullseye"></i>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Exam-Accurate Evaluation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our speed and error calculation formulas replicate exact standard guidelines used by recruitment
                    boards.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Affordable Pricing with Trial</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enjoy a 1-week free trial with full Pro access, followed by just ₹100/month for unlimited practice.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    <i className="fa-solid fa-language"></i>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Multilingual Support</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Comprehensive support for English, Hindi (KrutiDev &amp; Mangal Inscript), Punjabi, and Marathi
                    layouts.
                  </p>
                </div>
              </div>
            </div>

            {/* CUSTOMER FEEDBACK & TESTIMONIALS SECTION */}
            <div className="bg-slate-100 rounded-2xl p-8 sm:p-10 border border-slate-200 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    User Reviews
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">What Our Aspirants Say</h2>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow text-sm transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-comment-dots"></i> Submit Your Feedback
                </button>
              </div>

              {/* Testimonial Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                  <div className="flex text-amber-400 text-sm">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    “I cleared my SSC CHSL typing test with ease thanks to the exact exam simulation mode here. Highly
                    recommended!”
                  </p>
                  <div className="font-bold text-slate-900 text-xs">— Rakesh Kumar, Lucknow</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                  <div className="flex text-amber-400 text-sm">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    “The KrutiDev to Unicode converter and Hindi tutors are top-notch. Best platform for government exam
                    prep.”
                  </p>
                  <div className="font-bold text-slate-900 text-xs">— Priya Sharma, Delhi</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                  <div className="flex text-amber-400 text-sm">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    “At just ₹100/mo with a free trial, it&apos;s unbelievable value. The word blaster game makes
                    practicing fun!”
                  </p>
                  <div className="font-bold text-slate-900 text-xs">— Amit Verma, Kanpur</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TYPING TEST VIEW */}
        {/* ============================================================== */}
        {activeTab === "test" && (
          <section
            id="tab-test"
            className={`space-y-6 ${isFullscreenActive ? "test-fullscreen-active" : ""}`}
          >
            <div className="test-card-wrapper bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {examPracticeMode && examPracticePattern ? examPracticePattern.name : "Interactive Typing Test"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {examPracticeMode && examPracticePattern
                      ? `${examPracticePattern.duration} min • ${examPracticePattern.speed} • ${examPracticePattern.language}`
                      : "Select language, duration, and test mode to evaluate your typing speed."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    disabled={examPracticeMode}
                    value={testLang}
                    onChange={(e) => {
                      const newLang = e.target.value as Language;
                      setTestLangState(newLang);
                      setTestParagraph(sampleParagraphs[newLang]);
                      resetTest();
                    }}
                    className="bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi (Mangal)</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="marathi">Marathi</option>
                  </select>
                  <select
                    disabled={examPracticeMode}
                    value={testDuration}
                    onChange={(e) => {
                      setTestDuration(Number(e.target.value));
                      resetTest();
                    }}
                    className="bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={1}>1 Minute</option>
                    <option value={2}>2 Minutes</option>
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                  </select>
                  <button
                    onClick={resetTest}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center gap-1.5 shadow"
                  >
                    <i className="fa-solid fa-rotate-right"></i> Reset Test
                  </button>
                  {isFullscreenActive && (
                    <button
                      onClick={finishTypingTest}
                      title="Close & Exit Test"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold w-9 h-9 rounded-lg shadow transition flex items-center justify-center"
                    >
                      <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Live Dashboard Stats */}
              <div id="testStatsGrid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Time Left</span>
                  <div className="text-2xl font-black text-blue-600 mt-0.5">{formatTime(testTimeRemaining)}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Speed (WPM)</span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{liveStats.netWpm}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Accuracy</span>
                  <div className="text-2xl font-black text-green-600 mt-0.5">{liveStats.accuracy}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Errors</span>
                  <div className="text-2xl font-black text-red-600 mt-0.5">{liveStats.errors}</div>
                </div>
              </div>

              {/* Flexible Paragraph Box */}
              <div
                id="testParagraphBox"
                className="bg-slate-100 border border-slate-300 rounded-xl p-5 max-h-96 overflow-y-auto font-mono text-lg text-slate-700 leading-relaxed custom-scrollbar select-none mb-4"
              >
                {testParagraph.split("").map((ch, i) => {
                  let cls = "text-slate-700";
                  if (i < typedInput.length) {
                    cls = typedInput[i] === ch ? "text-emerald-700 font-bold bg-emerald-100" : "text-red-700 font-bold bg-red-100";
                  } else if (i === typedInput.length) {
                    cls = "bg-amber-300 animate-pulse text-black font-bold";
                  }
                  return (
                    <span key={i} className={cls}>
                      {ch}
                    </span>
                  );
                })}
              </div>

              {/* Flexible Typing Input Area */}
              <div className="shrink-0">
                <textarea
                  ref={testInputRef}
                  id="testInputArea"
                  rows={3}
                  value={typedInput}
                  onChange={(e) => {
                    if (!testStarted) {
                      startTypingTest(true);
                    }
                    setTypedInput(e.target.value);
                  }}
                  disabled={!testStarted && typedInput.length > 0 && testTimeRemaining === 0}
                  placeholder="Click here and start typing the above paragraph..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-4 font-mono text-lg text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar resize-y"
                ></textarea>
              </div>

              <div className="flex justify-between items-center mt-3 shrink-0">
                <span className="text-sm font-semibold text-amber-600">{testStatusMsg}</span>
                <div className="flex items-center gap-2">
                  {testStarted && (
                    <button
                      onClick={finishTypingTest}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl shadow transition"
                    >
                      Finish &amp; View Result
                    </button>
                  )}
                  {!testStarted && (
                    <button
                      onClick={() => startTypingTest()}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition"
                    >
                      Start Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 2B: DEDICATED TYPING TEST RESULT VIEW */}
        {/* ============================================================== */}
        {activeTab === "test-result" && lastResultStats && (
          <section className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Typing Test Result Scorecard</h2>
                    <p className="text-xs text-slate-500">
                      {examPracticeMode && examPracticePattern
                        ? `Exam Pattern Report: ${examPracticePattern.name}`
                        : "Complete performance evaluation summary."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    switchTab("test");
                    resetTest();
                  }}
                  className="text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-sm transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-xmark"></i> Close Result
                </button>
              </div>

              {/* Main Speed & Accuracy Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Gross Speed</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{lastResultStats.grossWpm} WPM</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Net Speed</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">{lastResultStats.netWpm} WPM</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Accuracy</span>
                  <div className="text-2xl font-black text-green-600 mt-1">{lastResultStats.accuracy}%</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Errors</span>
                  <div className="text-2xl font-black text-red-600 mt-1">{lastResultStats.errors}</div>
                </div>
              </div>

              {/* Qualifying Status Box */}
              {examPracticeMode && examPracticePattern && (
                <div
                  className={`rounded-xl border p-4 ${
                    lastResultQualified === true
                      ? "bg-green-50 border-green-200"
                      : lastResultQualified === false
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">Qualifying Status</div>
                      <div className="text-lg font-black text-slate-900">
                        {lastResultQualified === null
                          ? "Practice / Cutoff varies"
                          : lastResultQualified
                          ? "QUALIFIED"
                          : "NOT QUALIFIED"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-500 uppercase">Required Speed</div>
                      <div className="text-sm font-bold text-slate-700">
                        {lastResultRequired ? `${lastResultRequired} WPM minimum` : "Notification-specific"}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {lastResultRequired
                      ? `${examPracticePattern.name}: practice qualification is based on ${lastResultRequired} WPM minimum for this configured pattern.`
                      : `${examPracticePattern.name}: cutoff depends on the official post notification.`}
                  </p>
                </div>
              )}

              {/* Secondary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Words Typed</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{lastResultStats.wordsTyped}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Correct Chars</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{lastResultStats.correctChars}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Time Used</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {formatTime(lastResultStats.elapsedSec)}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Language / Mode</span>
                  <div className="text-sm font-black text-slate-900 mt-1 truncate">
                    {examPracticeMode && examPracticePattern
                      ? examPracticePattern.name
                      : `${testLang.toUpperCase()} (${testDuration} min)`}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    switchTab("test");
                    resetTest();
                    startTypingTest();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-rotate-right"></i> Retake Test
                </button>
                <button
                  onClick={() => {
                    switchTab("test");
                    resetTest();
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-3 rounded-xl transition"
                >
                  Back to Typing Test
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 3: EXAM MODE VIEW */}
        {/* ============================================================== */}
        {activeTab === "exam" && (
          <section className="space-y-3">
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight truncate">
                    Government Exam Typing Test Mode — Select Examination Pattern
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Select from official competitive exam boards mirroring government recruitment rules (exact rules
                    may vary by post and notification).
                  </p>
                </div>
                <input
                  type="search"
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  placeholder="Search exam / board..."
                  className="w-full lg:w-64 shrink-0 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "all", label: "All Exams" },
                        { id: "central", label: "Central Govt." },
                        { id: "railway", label: "Railways" },
                        { id: "court", label: "Courts" },
                        { id: "state", label: "State Govt." },
                        { id: "institute", label: "Institutes / Depts" },
                        { id: "police", label: "Police / Security" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setExamCategory(cat.id as ExamCategory)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            examCategory === cat.id
                              ? "bg-amber-500 text-slate-900 shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-amber-50"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={startOfficialExam}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-1.5 rounded-lg shadow transition flex items-center gap-1.5 text-xs shrink-0"
                    >
                      <i className="fa-solid fa-play"></i> Proceed to Exam Test
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[620px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredExams.map((e) => (
                      <label
                        key={e.id}
                        onClick={() => setSelectedExamId(e.id)}
                        className={`border p-3.5 rounded-xl cursor-pointer hover:border-amber-500 hover:shadow-sm bg-slate-50 flex items-start gap-3 transition ${
                          selectedExamId === e.id ? "ring-2 ring-amber-500 border-amber-500" : "border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="examBoardRadio"
                          checked={selectedExamId === e.id}
                          onChange={() => setSelectedExamId(e.id)}
                          className="mt-1 accent-amber-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-slate-900 text-sm leading-snug">{e.name}</div>
                            <i className={`fa-solid ${e.icon} text-amber-600 mt-0.5`}></i>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {e.duration} min • {e.speed}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              {e.note}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                              {e.language}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {filteredExams.length === 0 && (
                    <div className="text-center py-6 text-sm text-slate-500">
                      No matching exam found. Try another search or category.
                    </div>
                  )}

                  {/* Typing Test History */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          <i className="fa-solid fa-clock-rotate-left mr-2 text-blue-600"></i>
                          My Typing Test History
                        </h3>
                        <p className="text-xs text-slate-500">Your exam attempts are saved in this browser.</p>
                      </div>
                      <button
                        type="button"
                        onClick={clearExamHistory}
                        className="text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        Clear History
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Attempts</div>
                        <div className="text-lg font-black text-slate-900">{examHistory.length}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Qualified</div>
                        <div className="text-lg font-black text-slate-900">
                          {examHistory.filter((x) => x.status === "QUALIFIED").length}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Avg Net WPM</div>
                        <div className="text-lg font-black text-slate-900">
                          {examHistory.length
                            ? Math.round(examHistory.reduce((a, x) => a + (x.netWpm || 0), 0) / examHistory.length)
                            : 0}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Best Net WPM</div>
                        <div className="text-lg font-black text-slate-900">
                          {examHistory.length ? Math.max(...examHistory.map((x) => x.netWpm || 0)) : 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                      {examHistory.length === 0 ? (
                        <div className="text-center text-xs text-slate-400 py-4">
                          No attempts yet. Complete an Exam Mode test to see your history.
                        </div>
                      ) : (
                        examHistory.map((x) => (
                          <div
                            key={x.id}
                            className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-slate-900 truncate">{x.examName}</div>
                              <div className="text-[10px] text-slate-500">
                                {x.date} • {x.language}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-right">
                              <div>
                                <div className="text-[10px] text-slate-500">Net</div>
                                <div className="font-black text-sm">{x.netWpm} WPM</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500">Accuracy</div>
                                <div className="font-black text-sm">{x.accuracy}%</div>
                              </div>
                              <span
                                className={`text-[10px] font-black px-2 py-1 rounded-full ${
                                  x.status === "QUALIFIED"
                                    ? "bg-green-100 text-green-700"
                                    : x.status === "NOT QUALIFIED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {x.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                    <h3 className="font-bold text-amber-900 text-base">
                      <i className="fa-solid fa-triangle-exclamation mr-2"></i> Exam Guidelines &amp; Rules
                    </h3>
                    <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                      <li>
                        <strong>Practice simulation:</strong> This tool is for preparation and does not reproduce an
                        official recruitment test centre.
                      </li>
                      <li>
                        <strong>Pattern:</strong> Duration, language, speed, font, error calculation and qualifying
                        rules are loaded for the selected exam pattern.
                      </li>
                      <li>
                        Exact eligibility and test rules can change by recruitment year, post and official notification.
                        Always verify the latest notice.
                      </li>
                      <li>Once started, the timer cannot be paused. Ensure your keyboard is functioning properly.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 4: TYPING TUTOR VIEW */}
        {/* ============================================================== */}
        {activeTab === "tutor" && (
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Step-by-Step Typing Tutor</h2>
                  <p className="text-sm text-slate-500">
                    Master home rows, key combinations, and finger placement technique.
                  </p>
                </div>
                <div className="flex gap-2">
                  {(["english", "krutidev", "mangal"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTutorType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                        tutorType === type ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {type === "english" ? "English Tutor" : type === "krutidev" ? "KrutiDev Hindi" : "Mangal Inscript"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                    Lesson Library ({tutorType.toUpperCase()})
                  </h3>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                    {tutorLessons[tutorType].map((lesson, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentLessonTitle(lesson);
                          setTutorPrompt(
                            lesson.includes("Home")
                              ? "asdf jkl; asdf jkl; asdf jkl;"
                              : "qwer tyuiop qwer tyuiop qwer tyuiop"
                          );
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                          currentLessonTitle === lesson
                            ? "bg-blue-600 text-white font-bold"
                            : "bg-white border border-slate-200 hover:bg-blue-50 text-slate-700"
                        }`}
                      >
                        {lesson}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                        {currentLessonTitle}
                      </span>
                      <p className="text-xs text-blue-600 mt-0.5">Keep fingers resting on ASDF and JKL; keys.</p>
                    </div>
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Interactive Guide
                    </span>
                  </div>

                  <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 font-mono text-xl tracking-widest text-center text-slate-800 select-none">
                    {tutorPrompt}
                  </div>

                  <textarea
                    value={tutorInput}
                    onChange={(e) => setTutorInput(e.target.value)}
                    placeholder="Click here and practice the lesson..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-4 font-mono text-slate-800 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 5: TOOLS & CONVERTERS VIEW */}
        {/* ============================================================== */}
        {activeTab === "tools" && (
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                <button
                  onClick={() => setSelectedTool("converter")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    selectedTool === "converter"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <i className="fa-solid fa-font mr-1.5"></i> Krutidev to Unicode
                </button>
                <button
                  onClick={() => setSelectedTool("keyboard")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    selectedTool === "keyboard"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <i className="fa-solid fa-keyboard mr-1.5"></i> Virtual Keyboard
                </button>
                <button
                  onClick={() => setSelectedTool("translator")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    selectedTool === "translator"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <i className="fa-solid fa-language mr-1.5"></i> Language Translator
                </button>
              </div>

              {/* TOOL 1: FONT CONVERTER */}
              {selectedTool === "converter" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">KrutiDev / Chanakya to Unicode Converter</h3>
                  <p className="text-sm text-slate-600">
                    Convert legacy Hindi font text instantly into modern standard Unicode (Mangal) format.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Input KrutiDev Text</label>
                      <textarea
                        value={inputKrutiText}
                        onChange={(e) => setInputKrutiText(e.target.value)}
                        placeholder="Paste KrutiDev text here..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-sm h-48 focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Converted Unicode (Mangal)</label>
                      <textarea
                        value={outputUnicodeText}
                        readOnly
                        placeholder="Unicode output appears here..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-sm h-48 focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={convertFontText}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition"
                    >
                      Convert Now
                    </button>
                    <button
                      onClick={copyConvertedText}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2.5 rounded-xl transition"
                    >
                      Copy Result
                    </button>
                  </div>
                </div>
              )}

              {/* TOOL 2: VIRTUAL KEYBOARD */}
              {selectedTool === "keyboard" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Online Multilingual Virtual Keyboard</h3>
                  <p className="text-sm text-slate-600">
                    Type in regional Indian languages directly using mouse clicks or your physical keyboard.
                  </p>
                  <textarea
                    value={virtualKeyInput}
                    onChange={(e) => setVirtualKeyInput(e.target.value)}
                    placeholder="Click virtual keys below to type..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>

                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 grid grid-cols-10 gap-2 text-center font-bold">
                    {["क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ"].map((k) => (
                      <button
                        key={k}
                        onClick={() => setVirtualKeyInput((prev) => prev + k)}
                        className="bg-white p-3 rounded shadow hover:bg-blue-50 border"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TOOL 3: TRANSLATOR */}
              {selectedTool === "translator" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Instant Language Translator</h3>
                  <p className="text-sm text-slate-600">
                    Translate sentences between English and Indian regional languages effortlessly.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Source Text (English)</label>
                      <textarea
                        value={sourceTransText}
                        onChange={(e) => setSourceTransText(e.target.value)}
                        placeholder="Type text to translate..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm h-36 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Translated Output (Hindi / Regional)
                      </label>
                      <textarea
                        value={outputTransText}
                        readOnly
                        placeholder="Translation appears here..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm h-36 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={performTranslation}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition"
                    >
                      Translate Text
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 6: WORD BLASTER TYPING GAME VIEW */}
        {/* ============================================================== */}
        {activeTab === "game" && (
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
              <div>
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Arcade Typing Game
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">Word Blaster Typing Challenge</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Type the falling words correctly before they hit the bottom line to score points!
                </p>
              </div>

              <div className="bg-slate-900 rounded-2xl h-96 relative overflow-hidden flex flex-col items-center justify-between p-6 border-4 border-slate-800 shadow-inner">
                {!gameActive && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
                    <div className="text-amber-400 text-5xl font-black">WORD BLASTER</div>
                    <p className="text-slate-300 text-sm max-w-md">
                      Improve your typing speed and reflexes with this fast-paced word game!
                    </p>
                    <button
                      onClick={startWordGame}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-xl shadow-lg transition text-lg"
                    >
                      <i className="fa-solid fa-play mr-2"></i> Start Game
                    </button>
                  </div>
                )}

                <div className="w-full flex justify-between text-white font-bold text-base z-10">
                  <span>
                    Score: <span className="text-amber-400">{gameScore}</span>
                  </span>
                  <span>
                    Missed: <span className="text-red-400">{gameMissed} / 5</span>
                  </span>
                </div>

                <div className="my-auto text-center space-y-2 z-10">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Target Word</span>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tracking-wider">
                    {targetWord}
                  </div>
                </div>

                <div className="w-full max-w-md z-10">
                  <input
                    type="text"
                    value={gameInput}
                    onChange={handleWordGameInput}
                    disabled={!gameActive}
                    placeholder="Type word and press space/enter..."
                    className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-xl p-3 text-center font-mono text-lg font-bold uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* TAB 7: BLOG & FAQ VIEW */}
        {/* ============================================================== */}
        {activeTab === "blog" && (
          <section className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
              <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Resources &amp; Knowledge
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">
                  Typing Guides, Tips &amp; Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Frequently Asked Questions</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">Q: How does the 1-Week Free Trial work?</h4>
                  <p className="text-sm text-slate-600">
                    A: You get full access to all Pro features for 7 days absolutely free. After the trial, the plan is
                    ₹100 monthly. You can cancel anytime.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">Q: How is typing speed (WPM) calculated?</h4>
                  <p className="text-sm text-slate-600">
                    A: Speed is calculated based on standard industry formulas where 5 characters/keystrokes equal 1
                    word. Net WPM subtracts error penalties from Gross WPM.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-8 h-8 shrink-0"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" rx="20" fill="#f59e0b" />
                  <rect x="12" y="24" width="76" height="52" rx="10" fill="#1e3a8a" />
                  <text x="50" y="58" fontSize="32" fontWeight="900" fill="#ffffff" textAnchor="middle">
                    RV
                  </text>
                </svg>
                <span className="text-xl font-black text-white">
                  RV <span className="text-amber-400">TypingMaster</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                India&apos;s leading platform for typing speed tests, government exam preparation, multilingual tutors,
                and font tools.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <button onClick={() => switchTab("home")} className="hover:text-white transition">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => switchTab("test")} className="hover:text-white transition">
                    Typing Tests
                  </button>
                </li>
                <li>
                  <button onClick={() => switchTab("exam")} className="hover:text-white transition">
                    Exam Mode
                  </button>
                </li>
                <li>
                  <button onClick={() => switchTab("tutor")} className="hover:text-white transition">
                    Typing Tutor
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Tools &amp; Converters</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <button onClick={() => switchTab("tools")} className="hover:text-white transition">
                    KrutiDev to Unicode
                  </button>
                </li>
                <li>
                  <button onClick={() => switchTab("tools")} className="hover:text-white transition">
                    Virtual Keyboard
                  </button>
                </li>
                <li>
                  <button onClick={() => switchTab("tools")} className="hover:text-white transition">
                    Language Translator
                  </button>
                </li>
                <li>
                  <button onClick={() => switchTab("game")} className="hover:text-white transition">
                    Word Blaster Game
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Support &amp; Legal</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <button onClick={() => switchTab("blog")} className="hover:text-white transition">
                    FAQ &amp; Help
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowFeedbackModal(true)} className="hover:text-white transition">
                    Submit Feedback
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} RV TypingMaster / Sarkari Selection. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Designed for Speed, Accuracy &amp; Excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
