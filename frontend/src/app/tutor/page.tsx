"use client";

/**
 * src/app/tutor/page.tsx
 * ──────────────────────
 * AI Tutor Page grounded in Retrieval-Augmented Generation (RAG).
 * Features:
 *   - Grounded educational explanations with step-by-step reasoning & worked examples.
 *   - Source citations linking to trusted NCERT knowledge chunks.
 *   - Quick modifier controls: "Explain simpler", "Explain deeper", "Give me an example", "Give me a practice question".
 *   - Weak topic awareness & suggested follow-up chips.
 */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Brain, Send, Sparkles, BookOpen, ArrowLeft, Wand2, Lightbulb,
  CheckCircle2, HelpCircle, FileText, AlertTriangle, ShieldCheck,
  ChevronDown, ChevronUp, RefreshCw, Bookmark, MessageSquare
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { TutorChatResponse, SourceCitation, WeakTopicItem } from "@/types";

interface ChatBubble {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  response?: TutorChatResponse;
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

  const [inputMessage, setInputMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Quadratic Equations");
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [weakTopics, setWeakTopics] = useState<WeakTopicItem[]>([]);
  const [showSourcesForMsg, setShowSourcesForMsg] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: `Hello ${user?.full_name?.split(" ")[0] || "there"}! I'm your AI Mathematics Tutor. Ask me anything about Algebra, Quadratic Equations, Trigonometry, Geometry, or Statistics!`,
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    fetchWeakTopics();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
                  <ShieldCheck className="w-3 h-3" /> Grounded RAG Knowledge Engine
                </p>
              </div>
            </div>
          </div>

          {/* Topic Selector */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Topic:</span>
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
                  className="max-w-xl p-4 rounded-2xl text-sm font-medium text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "20px 20px 4px 20px" }}
                >
                  {bubble.text}
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
                  {/* Grounded Explanation */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Grounded Explanation
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed font-medium">
                      {bubble.response.explanation}
                    </p>
                  </div>

                  {/* Step-by-step Reasoning Cards */}
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

                  {/* Worked Example */}
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

                  {/* Source Citations & References */}
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

                  {/* Suggested Follow-up Chips */}
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
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl glass w-max">
              <div className="w-5 h-5 rounded-full animate-spin border-2 border-indigo-500 border-t-transparent" />
              <span className="text-xs text-muted">Retrieving knowledge chunks & generating grounded explanation...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Controls & Input Section */}
        <div className="sticky bottom-4 z-30 space-y-3">
          {/* Quick Modifier Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-xs font-semibold text-muted mr-1">Quick Modifiers:</span>
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
            <button
              onClick={() => handleSendMessage(inputMessage || `Give me a practice question for ${selectedTopic}`, "practice")}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-full"
            >
              <FileText className="w-3 h-3 text-rose-400" /> Give me a practice question
            </button>
          </div>

          {/* Input Box */}
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
              placeholder={`Ask AI Tutor about ${selectedTopic} (e.g. How do I solve quadratic equations?)...`}
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm focus:outline-none"
              style={{ color: "var(--color-text)" }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="btn btn-primary p-3 rounded-xl flex items-center justify-center shrink-0"
              style={{ opacity: !inputMessage.trim() || loading ? 0.5 : 1 }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
