"use client";

/**
 * src/app/tutor/page.tsx
 * ──────────────────────
 * AI Tutor Page grounded in Retrieval-Augmented Generation (RAG) & Vision AI Image Question Solver.
 * Features:
 *   - Grounded educational explanations with step-by-step reasoning & worked examples.
 *   - YouTube Video Resources from top K-12 channels (Physics Wallah, Khan Academy, Dear Sir, Vedantu).
 *   - Multilingual explanation selection (English 🇬🇧, Hindi 🇮🇳, Hinglish 🇮🇳).
 *   - 📷 Scan Question (Vision AI multimodal solver for printed & handwritten math questions).
 *   - Structured solution rendering: Problem, Concept, Steps, Answer, Verification, Similar Question.
 *   - Light SaaS Theme with high contrast dark slate typography.
 */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Brain, Send, Sparkles, BookOpen, ArrowLeft, Wand2, Lightbulb,
  CheckCircle2, FileText, AlertTriangle, ShieldCheck,
  ChevronDown, ChevronUp, Globe, Camera, Upload, X, Image as ImageIcon,
  Check, PlayCircle, ExternalLink
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { TutorChatResponse, SourceCitation, WeakTopicItem, ImageQuestionSolverResponse, VideoResource } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

interface ChatBubble {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  response?: TutorChatResponse;
  visionResponse?: ImageQuestionSolverResponse;
  imageUrl?: string;
  timestamp: string;
}

export default function AITutorPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AITutorContent />
    </ProtectedRoute>
  );
}

function AITutorContent() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputMessage, setInputMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Quadratic Equations");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [weakTopics, setWeakTopics] = useState<WeakTopicItem[]>([]);
  const [showSourcesForMsg, setShowSourcesForMsg] = useState<Record<string, boolean>>({});

  // 📷 Vision Scan Question State
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: `Hello ${user?.full_name?.split(" ")[0] || "there"}! I'm your AI Mathematics Tutor. Ask me anything in English, Hindi (हिंदी), or Hinglish, or click "📷 Scan Question" to upload a printed or handwritten question photo!`,
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    fetchWeakTopics();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scanLoading]);

  const fetchWeakTopics = async () => {
    try {
      const data = await api.get<WeakTopicItem[]>("/student/weak-topics");
      setWeakTopics(data);
      if (data.length > 0) {
        setSelectedTopic(data[0].topic_name);
      }
    } catch {
      // Non-critical background fetch
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend?: string, modifier?: "simpler" | "deeper" | "example" | "practice", langOverride?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    let effectiveLang = langOverride || selectedLanguage;
    const lowerText = text.toLowerCase();
    if (lowerText.includes("in hindi") || lowerText.includes("hindi me")) {
      effectiveLang = "hi";
      setSelectedLanguage("hi");
    } else if (lowerText.includes("in hinglish") || lowerText.includes("hinglish me") || lowerText.includes("samjhao") || lowerText.includes("mujhe")) {
      effectiveLang = "hi-en";
      setSelectedLanguage("hi-en");
    }

    const userBubbleId = `user-${Date.now()}`;
    const newMessages: ChatBubble[] = [
      ...messages,
      {
        id: userBubbleId,
        sender: "user",
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(newMessages);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    try {
      const res = await api.post<TutorChatResponse>("/tutor/chat", {
        message: text,
        topic_name: selectedTopic,
        session_id: sessionId,
        modifier: modifier,
        language: effectiveLang,
      });

      setSessionId(res.session_id);

      const aiBubbleId = `ai-${Date.now()}`;
      setMessages([
        ...newMessages,
        {
          id: aiBubbleId,
          sender: "assistant",
          response: res,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not connect to AI Tutor. Please try again.";

      setMessages([
        ...newMessages,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: `⚠️ ${errorMsg}`,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 📷 Handle Image File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // 📷 Handle Image Question Upload & Vision Solving
  const handleScanImageUpload = async () => {
    if (!selectedImageFile || scanLoading) return;

    setScanLoading(true);
    const userImgBubbleId = `user-img-${Date.now()}`;
    const previewUrl = imagePreviewUrl || undefined;

    const newMsgs: ChatBubble[] = [
      ...messages,
      {
        id: userImgBubbleId,
        sender: "user",
        text: "📷 Scanned question image uploaded for step-by-step solution.",
        imageUrl: previewUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setMessages(newMsgs);
    setShowScanModal(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedImageFile);
      formData.append("topic_name", selectedTopic);
      formData.append("language", selectedLanguage);

      const res = await api.postForm<ImageQuestionSolverResponse>("/tutor/scan-question", formData);

      const aiVisionBubbleId = `ai-vis-${Date.now()}`;
      setMessages([
        ...newMsgs,
        {
          id: aiVisionBubbleId,
          sender: "assistant",
          visionResponse: res,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not analyze question image. Please upload a clear image of a math question.";

      setMessages([
        ...newMsgs,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: `⚠️ Vision AI Error: ${errorMsg}`,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setScanLoading(false);
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const toggleSources = (msgId: string) => {
    setShowSourcesForMsg((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const isWeakTopicSelected = weakTopics.some((wt) => wt.topic_name === selectedTopic);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation Header */}
      <header className="navbar sticky top-0 z-40 px-6 py-3.5 border-b border-slate-200">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 text-decoration-none">
              <ArrowLeft className="w-4 h-4 text-slate-600" /> Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #5b4cf5, #7c6ff9)" }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-base leading-none text-slate-900">
                  Shiksha<span className="text-gradient">AI</span> Tutor
                </h1>
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Grounded Multilingual RAG Engine
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* 📷 Scan Question Button */}
            <button
              onClick={() => setShowScanModal(true)}
              className="btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1.5 shadow-md"
              style={{ background: "#059669" }}
            >
              <Camera className="w-4 h-4" /> 📷 Scan Question
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <Globe className="w-4 h-4 text-indigo-600" />
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user")?.text;
                  if (lastUserMsg) {
                    handleSendMessage(lastUserMsg, undefined, e.target.value);
                  }
                }}
                className="bg-white border border-slate-200 rounded-xl text-xs py-1.5 px-3 font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selector */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl text-xs py-1.5 px-3 font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="Algebra">Algebra & Polynomials</option>
                <option value="Quadratic Equations">Quadratic Equations</option>
                <option value="Linear Equations">Linear Equations</option>
                <option value="Trigonometry">Trigonometry</option>
                <option value="Geometry">Geometry & Triangles</option>
                <option value="Force & Pressure">Force & Pressure</option>
                <option value="Cell Structure">Cell Structure</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Layout */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
        {/* Weak Topic Alert Banner */}
        {isWeakTopicSelected && (
          <div className="mb-6 p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-extrabold">Focus Topic: {selectedTopic}</span> is identified as one of your weak areas. The AI tutor will provide extra step-by-step guidance!
              </div>
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 space-y-6 mb-6">
          {messages.map((bubble) => (
            <div
              key={bubble.id}
              className={`flex flex-col ${bubble.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 font-semibold">
                {bubble.sender === "assistant" ? (
                  <span className="font-extrabold text-indigo-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Tutor
                  </span>
                ) : (
                  <span className="font-extrabold text-emerald-700">You</span>
                )}
                <span>&bull; {bubble.timestamp}</span>
              </div>

              {/* User Bubble */}
              {bubble.sender === "user" && (
                <div
                  className="max-w-xl p-4 rounded-2xl text-sm font-medium text-white shadow-md space-y-2"
                  style={{ background: "#5b4cf5", borderRadius: "20px 20px 4px 20px" }}
                >
                  {bubble.imageUrl && (
                    <img src={bubble.imageUrl} alt="Uploaded math question" className="rounded-xl max-h-48 border border-white/20 object-cover" />
                  )}
                  <div className="leading-relaxed">{bubble.text}</div>
                </div>
              )}

              {/* Assistant Simple Text Bubble */}
              {bubble.sender === "assistant" && bubble.text && (
                <div className="bg-white border border-slate-200 max-w-2xl p-5 rounded-2xl text-sm leading-relaxed text-slate-800 shadow-sm">
                  {bubble.text}
                </div>
              )}

              {/* Assistant Structured RAG Response */}
              {bubble.sender === "assistant" && bubble.response && (
                <div className="bg-white border border-slate-200 max-w-3xl w-full p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" /> Grounded Explanation
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed font-semibold text-slate-900">
                      {bubble.response.explanation}
                    </p>
                  </div>

                  {/* Step by Step Reasoning */}
                  {bubble.response.step_by_step.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step-by-Step Reasoning
                      </h4>
                      <div className="space-y-2">
                        {bubble.response.step_by_step.map((step: string, idx: number) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Worked Example */}
                  {bubble.response.example && (
                    <div className="p-4 rounded-2xl border bg-indigo-50/70 border-indigo-200 text-xs md:text-sm space-y-1">
                      <h4 className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-indigo-600" /> Worked Example
                      </h4>
                      <div className="font-mono text-xs leading-relaxed text-indigo-950 font-semibold">
                        {bubble.response.example}
                      </div>
                    </div>
                  )}

                  {/* 📺 YouTube Video Resources */}
                  {bubble.response.video_resources && bubble.response.video_resources.length > 0 && (
                    <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200 space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <PlayCircle className="w-4 h-4 text-red-600" /> Top Educational Video Lessons
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bubble.response.video_resources.map((vid: VideoResource, vIdx: number) => (
                          <a
                            key={vIdx}
                            href={vid.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-sm transition-all group text-decoration-none"
                          >
                            {vid.thumbnail_url ? (
                              <img src={vid.thumbnail_url} alt={vid.title} className="w-16 h-12 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                <PlayCircle className="w-6 h-6" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                                {vid.title}
                              </div>
                              <div className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                                <span>{vid.channel_name}</span>
                                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources & Citations */}
                  {bubble.response.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleSources(bubble.id)}
                        className="flex items-center justify-between w-full text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" /> NCERT Chapter Sources & Citations ({bubble.response.sources.length})
                        </span>
                        {showSourcesForMsg[bubble.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {showSourcesForMsg[bubble.id] && (
                        <div className="mt-3 space-y-2">
                          {bubble.response.sources.map((src: SourceCitation, sIdx: number) => (
                            <div key={sIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                              <div className="flex items-center justify-between font-extrabold text-slate-900">
                                <span>{src.title}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                                  {Math.round(src.relevance_score * 100)}% Match
                                </span>
                              </div>
                              <p className="text-slate-600 italic font-medium leading-relaxed">{src.chunk_text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  {bubble.response.follow_up.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-slate-500 w-full font-bold mb-1">Suggested Follow-up Questions:</span>
                      {bubble.response.follow_up.map((fu: string, fIdx: number) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSendMessage(fu)}
                          className="px-3 py-1.5 rounded-full text-xs bg-slate-50 border border-slate-200 font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all text-left flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" /> {fu}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 📷 Assistant Vision Solution Card */}
              {bubble.sender === "assistant" && bubble.visionResponse && (
                <div className="bg-emerald-50/70 border border-emerald-200 max-w-3xl w-full p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" /> Extracted Question (Vision AI)
                    </div>
                    <div className="text-sm font-bold text-slate-900 italic">
                      "{bubble.visionResponse.extracted_question}"
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">Problem Formulation</div>
                      <div className="text-xs font-semibold text-slate-800">{bubble.visionResponse.problem}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700">Core Mathematical Concept</div>
                      <div className="text-xs font-semibold text-amber-900">{bubble.visionResponse.concept}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step-by-Step Resolution
                    </h4>
                    <div className="space-y-2">
                      {bubble.visionResponse.steps.map((st: string, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border bg-white border-emerald-300 space-y-3 shadow-xs">
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 mb-1">Calculated Final Answer</div>
                      <div className="text-lg font-black text-emerald-700 font-mono">{bubble.visionResponse.answer}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1">
                        <Check className="w-4 h-4 text-emerald-600" /> Step-by-Step Verification:
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed font-medium">
                        {bubble.visionResponse.verification}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(loading || scanLoading) && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm w-max">
              <div className="w-5 h-5 rounded-full animate-spin border-2 border-indigo-600 border-t-transparent" />
              <span className="text-xs text-slate-600 font-semibold">
                {scanLoading ? "Extracting math text & solving question using Vision AI..." : "Retrieving NCERT chunks & generating grounded explanation..."}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Controls & Input Section */}
        <div className="sticky bottom-4 z-30 space-y-3">
          {/* Language Switcher Buttons & Prompt Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 px-2">
            <button
              onClick={() => setShowScanModal(true)}
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-full shadow-md"
              style={{ background: "#059669" }}
            >
              <Camera className="w-3.5 h-3.5" /> 📷 Scan Question
            </button>

            <span className="text-xs font-bold text-slate-400 mx-1">|</span>

            {/* Quick Language Toggle Buttons */}
            <button
              onClick={() => handleSendMessage(`Explain ${selectedTopic} in English`, undefined, "en")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedLanguage === "en" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => handleSendMessage(`Explain ${selectedTopic} in Hindi`, undefined, "hi")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedLanguage === "hi" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              🇮🇳 Hindi (हिंदी)
            </button>
            <button
              onClick={() => handleSendMessage(`Explain ${selectedTopic} in Hinglish`, undefined, "hi-en")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedLanguage === "hi-en" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              🇮🇳 Hinglish
            </button>

            <span className="text-xs font-bold text-slate-400 mx-1">|</span>

            <button
              onClick={() => handleSendMessage(inputMessage || `Explain ${selectedTopic} in simpler terms`, "simpler")}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-full"
            >
              <Wand2 className="w-3 h-3 text-emerald-600" /> Simpler
            </button>
            <button
              onClick={() => handleSendMessage(inputMessage || `Give me a worked example for ${selectedTopic}`, "example")}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-full"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" /> Worked Example
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="bg-white rounded-2xl p-2 flex items-center gap-2 border border-slate-200 shadow-xl"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask AI Tutor about ${selectedTopic} in English, Hindi, or Hinglish...`}
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm focus:outline-none text-slate-900 font-semibold"
            />
            <button
              type="button"
              onClick={() => setShowScanModal(true)}
              className="p-3 rounded-xl hover:bg-slate-100 text-emerald-600 transition-colors shrink-0"
              title="Upload question photo"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading || scanLoading}
              className="btn-primary p-3 rounded-xl flex items-center justify-center shrink-0"
              style={{ opacity: !inputMessage.trim() || loading || scanLoading ? 0.5 : 1 }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* 📷 Scan Question Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-6 relative">
            <button
              onClick={() => {
                setShowScanModal(false);
                setSelectedImageFile(null);
                setImagePreviewUrl(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-600" /> 📷 Scan Math Question
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Upload or photograph a printed or handwritten mathematics question. Vision AI will extract and solve it step-by-step!
              </p>
            </div>

            {/* Dropzone & File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!imagePreviewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-500 transition-all bg-slate-50 space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900">Click to upload question photo</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">Supports printed & handwritten math questions (PNG, JPG, WebP)</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-60 flex items-center justify-center bg-slate-900">
                  <img src={imagePreviewUrl} alt="Selected math question" className="max-h-56 object-contain" />
                  <button
                    onClick={() => {
                      setSelectedImageFile(null);
                      setImagePreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> {selectedImageFile?.name} ({Math.round((selectedImageFile?.size || 0)/1024)} KB)
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowScanModal(false);
                  setSelectedImageFile(null);
                  setImagePreviewUrl(null);
                }}
                className="btn-secondary py-2.5 px-4 text-xs font-bold flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleScanImageUpload}
                disabled={!selectedImageFile || scanLoading}
                className="btn-primary py-2.5 px-4 text-xs font-bold flex-1 flex items-center justify-center gap-2"
                style={{ background: "#059669", opacity: !selectedImageFile || scanLoading ? 0.5 : 1 }}
              >
                {scanLoading ? "Analyzing Vision..." : "Scan & Solve Question"} <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
