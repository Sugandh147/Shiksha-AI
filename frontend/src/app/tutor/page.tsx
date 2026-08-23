"use client";

/**
 * src/app/tutor/page.tsx
 * ──────────────────────
 * AI Tutor Page grounded in Retrieval-Augmented Generation (RAG) & Vision AI Image Question Solver.
 * Features:
 *   - Grounded educational explanations with step-by-step reasoning & worked examples.
 *   - Multilingual explanation selection (English, Hindi, Hinglish).
 *   - 📷 Scan Question (Vision AI multimodal solver for printed & handwritten math questions).
 *   - Structured solution rendering: Problem, Concept, Steps, Answer, Verification, Similar Question.
 */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Brain, Send, Sparkles, BookOpen, ArrowLeft, Wand2, Lightbulb,
  CheckCircle2, HelpCircle, FileText, AlertTriangle, ShieldCheck,
  ChevronDown, ChevronUp, RefreshCw, Bookmark, MessageSquare, Globe,
  Camera, Upload, X, Image as ImageIcon, Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { TutorChatResponse, SourceCitation, WeakTopicItem, ImageQuestionSolverResponse } from "@/types";
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
      text: `Hello ${user?.full_name?.split(" ")[0] || "there"}! I'm your AI Mathematics Tutor. Ask me anything in English, Hindi, or Hinglish, or click "📷 Scan Question" to upload a printed or handwritten question photo!`,
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

  const handleSendMessage = async (textToSend?: string, modifier?: "simpler" | "deeper" | "example" | "practice") => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    let effectiveLang = selectedLanguage;
    const lowerText = text.toLowerCase();
    if (lowerText.includes("in hindi") || lowerText.includes("hindi me")) {
      effectiveLang = "hi";
    } else if (lowerText.includes("in hinglish") || lowerText.includes("hinglish me") || lowerText.includes("samjhao") || lowerText.includes("mujhe")) {
      effectiveLang = "hi-en";
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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Top Navigation */}
      <header className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-none">
                  Shiksha<span className="gradient-text">AI</span> Tutor
                </h1>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Grounded Multilingual Vision Engine
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* 📷 Scan Question Button */}
            <button
              onClick={() => setShowScanModal(true)}
              className="btn btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1.5 shadow-lg"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
            >
              <Camera className="w-4 h-4" /> 📷 Scan Question
            </button>

            {/* Multilingual Language Selector */}
            <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: "var(--color-border)" }}>
              <Globe className="w-4 h-4 text-indigo-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-surface border rounded-xl text-xs py-1.5 px-3 font-semibold focus:outline-none focus:border-indigo-500"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selector */}
            <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: "var(--color-border)" }}>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-surface border rounded-xl text-xs py-1.5 px-3 font-semibold focus:outline-none focus:border-indigo-500"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                <option value="Algebra">Algebra</option>
                <option value="Quadratic Equations">Quadratic Equations</option>
                <option value="Trigonometry">Trigonometry</option>
                <option value="Geometry">Geometry</option>
                <option value="Statistics">Statistics</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Layout */}
      <main className="flex-1 container max-w-5xl mx-auto px-6 py-6 flex flex-col justify-between">
        {/* Weak Topic Alert Banner */}
        {isWeakTopicSelected && (
          <div className="mb-6 p-4 rounded-2xl border flex items-center justify-between gap-4 bg-amber-500/10 border-amber-500/30 text-amber-400 text-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold text-white">Focus Topic: {selectedTopic}</span> is currently identified as one of your weak areas. The tutor will provide extra step-by-step guidance!
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
              <div className="flex items-center gap-2 mb-1 text-xs text-muted">
                {bubble.sender === "assistant" ? (
                  <span className="font-bold text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Tutor
                  </span>
                ) : (
                  <span className="font-bold text-emerald-400">You</span>
                )}
                <span>&bull; {bubble.timestamp}</span>
              </div>

              {/* User Bubble */}
              {bubble.sender === "user" && (
                <div
                  className="max-w-xl p-4 rounded-2xl text-sm font-medium text-white shadow-md space-y-2"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "20px 20px 4px 20px" }}
                >
                  {bubble.imageUrl && (
                    <img src={bubble.imageUrl} alt="Uploaded math question" className="rounded-xl max-h-48 border border-white/20 object-cover" />
                  )}
                  <div>{bubble.text}</div>
                </div>
              )}

              {/* Assistant Simple Text Bubble */}
              {bubble.sender === "assistant" && bubble.text && (
                <div className="glass max-w-2xl p-5 rounded-2xl text-sm leading-relaxed border" style={{ borderColor: "var(--color-border)" }}>
                  {bubble.text}
                </div>
              )}

              {/* Assistant Structured RAG Response */}
              {bubble.sender === "assistant" && bubble.response && (
                <div className="glass max-w-3xl w-full p-6 md:p-8 rounded-3xl space-y-6 border shadow-xl" style={{ borderColor: "var(--color-border)" }}>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Grounded Explanation
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed font-medium">
                      {bubble.response.explanation}
                    </p>
                  </div>

                  {bubble.response.step_by_step.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Step-by-Step Reasoning
                      </h4>
                      <div className="space-y-2">
                        {bubble.response.step_by_step.map((step: string, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-surface border text-xs font-medium flex items-start gap-3" style={{ borderColor: "var(--color-border)" }}>
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {bubble.response.example && (
                    <div className="p-4 rounded-2xl border bg-indigo-500/10 border-indigo-500/30 text-xs md:text-sm space-y-1">
                      <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-indigo-400" /> Worked Example
                      </h4>
                      <div className="font-mono text-xs leading-relaxed text-indigo-100">
                        {bubble.response.example}
                      </div>
                    </div>
                  )}

                  {bubble.response.sources.length > 0 && (
                    <div className="pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                      <button
                        type="button"
                        onClick={() => toggleSources(bubble.id)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-muted hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" /> Trusted Sources & Citations ({bubble.response.sources.length})
                        </span>
                        {showSourcesForMsg[bubble.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {showSourcesForMsg[bubble.id] && (
                        <div className="mt-3 space-y-2">
                          {bubble.response.sources.map((src: SourceCitation, sIdx: number) => (
                            <div key={sIdx} className="p-3 rounded-xl bg-surface border text-xs space-y-1" style={{ borderColor: "var(--color-border)" }}>
                              <div className="flex items-center justify-between font-bold text-white">
                                <span>{src.title}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  {Math.round(src.relevance_score * 100)}% Match
                                </span>
                              </div>
                              <p className="text-muted italic">{src.chunk_text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {bubble.response.follow_up.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-muted w-full font-semibold mb-1">Suggested Follow-ups:</span>
                      {bubble.response.follow_up.map((fu: string, fIdx: number) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSendMessage(fu)}
                          className="px-3 py-1.5 rounded-full text-xs bg-surface border text-indigo-300 hover:border-indigo-500 transition-all text-left flex items-center gap-1.5"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <Sparkles className="w-3 h-3 text-indigo-400" /> {fu}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 📷 Assistant Vision Solution Response Card */}
              {bubble.sender === "assistant" && bubble.visionResponse && (
                <div className="glass max-w-3xl w-full p-6 md:p-8 rounded-3xl space-y-6 border shadow-2xl" style={{ borderColor: "rgba(16, 185, 129, 0.4)", background: "rgba(16, 185, 129, 0.04)" }}>
                  {/* Extracted Question Callout */}
                  <div className="p-4 rounded-2xl bg-surface border space-y-1" style={{ borderColor: "var(--color-border)" }}>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4" /> Extracted Question (Vision AI OCR)
                    </div>
                    <div className="text-sm font-semibold text-white italic">
                      "{bubble.visionResponse.extracted_question}"
                    </div>
                  </div>

                  {/* Problem & Core Concept */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-surface border space-y-1" style={{ borderColor: "var(--color-border)" }}>
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Problem Formulation</div>
                      <div className="text-xs font-medium text-white">{bubble.visionResponse.problem}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border space-y-1" style={{ borderColor: "var(--color-border)" }}>
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Core Mathematical Concept</div>
                      <div className="text-xs font-medium text-amber-200">{bubble.visionResponse.concept}</div>
                    </div>
                  </div>

                  {/* Step-by-Step Resolution */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Step-by-Step Resolution
                    </h4>
                    <div className="space-y-2">
                      {bubble.visionResponse.steps.map((st: string, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-surface border text-xs font-medium flex items-start gap-3" style={{ borderColor: "var(--color-border)" }}>
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Answer & Step-by-Step Verification */}
                  <div className="p-5 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 space-y-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">Calculated Final Answer</div>
                      <div className="text-lg font-extrabold text-emerald-400 font-mono">{bubble.visionResponse.answer}</div>
                    </div>
                    <div className="pt-2 border-t border-emerald-500/20">
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1 mb-1">
                        <Check className="w-4 h-4 text-emerald-400" /> Step-by-Step Verification:
                      </div>
                      <div className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                        {bubble.visionResponse.verification}
                      </div>
                    </div>
                  </div>

                  {/* Similar Practice Problem Reinforcement */}
                  <div className="p-5 rounded-2xl border bg-indigo-500/10 border-indigo-500/30 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" /> Similar Practice Question for Reinforcement
                    </div>
                    <p className="text-xs font-semibold text-white">
                      {bubble.visionResponse.similar_question}
                    </p>
                    <button
                      onClick={() => handleSendMessage(`Help me solve this similar question: ${bubble.visionResponse?.similar_question}`)}
                      className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/20"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Solve This Similar Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(loading || scanLoading) && (
            <div className="flex items-center gap-3 p-4 rounded-2xl glass w-max">
              <div className="w-5 h-5 rounded-full animate-spin border-2 border-indigo-500 border-t-transparent" />
              <span className="text-xs text-muted">
                {scanLoading ? "Extracting math text & solving question using Vision AI..." : "Retrieving knowledge chunks & generating grounded explanation..."}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Controls & Input Section */}
        <div className="sticky bottom-4 z-30 space-y-3">
          {/* Quick Action Buttons including Scan Question */}
          <div className="flex flex-wrap items-center gap-2 px-2">
            <button
              onClick={() => setShowScanModal(true)}
              className="btn btn-primary py-1.5 px-3.5 text-xs flex items-center gap-1.5 rounded-full shadow-lg"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
            >
              <Camera className="w-3.5 h-3.5" /> 📷 Scan Question
            </button>
            <span className="text-xs font-semibold text-muted mx-1">|</span>
            <button
              onClick={() => handleSendMessage(inputMessage || `Explain ${selectedTopic} in simpler terms`, "simpler")}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-full"
            >
              <Wand2 className="w-3 h-3 text-emerald-400" /> Explain simpler
            </button>
            <button
              onClick={() => handleSendMessage(inputMessage || `Explain ${selectedTopic} deeper with proofs`, "deeper")}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-full"
            >
              <Brain className="w-3 h-3 text-indigo-400" /> Explain deeper
            </button>
            <button
              onClick={() => handleSendMessage(inputMessage || `Give me a worked example for ${selectedTopic}`, "example")}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-full"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" /> Give me an example
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="glass rounded-2xl p-2 flex items-center gap-2 border shadow-2xl"
            style={{ borderColor: "var(--color-border)" }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask AI Tutor about ${selectedTopic} or click 📷 Scan Question to upload photo...`}
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm focus:outline-none"
              style={{ color: "var(--color-text)" }}
            />
            <button
              type="button"
              onClick={() => setShowScanModal(true)}
              className="p-3 rounded-xl hover:bg-surface text-emerald-400 transition-colors shrink-0"
              title="Upload question photo"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading || scanLoading}
              className="btn btn-primary p-3 rounded-xl flex items-center justify-center shrink-0"
              style={{ opacity: !inputMessage.trim() || loading || scanLoading ? 0.5 : 1 }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* 📷 Scan Question Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass max-w-lg w-full p-6 rounded-3xl border shadow-2xl space-y-6 relative" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={() => {
                setShowScanModal(false);
                setSelectedImageFile(null);
                setImagePreviewUrl(null);
              }}
              className="absolute top-4 right-4 p-2 text-muted hover:text-white rounded-full hover:bg-surface"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-400" /> 📷 Scan Math Question
              </h2>
              <p className="text-xs text-muted">
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
                className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-500 transition-all bg-surface/50 space-y-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Click to upload question photo</div>
                  <div className="text-xs text-muted mt-1">Supports printed & handwritten math questions (PNG, JPG, WebP)</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border max-h-60 flex items-center justify-center bg-black/40" style={{ borderColor: "var(--color-border)" }}>
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
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
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
                className="btn btn-secondary py-2.5 px-4 text-xs font-semibold flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleScanImageUpload}
                disabled={!selectedImageFile || scanLoading}
                className="btn btn-primary py-2.5 px-4 text-xs font-bold flex-1 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)", opacity: !selectedImageFile || scanLoading ? 0.5 : 1 }}
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
