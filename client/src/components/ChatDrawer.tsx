import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { Bot, X, Send, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.tsx";
import { sendMessage } from "../services/chat.service.ts";

export interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  isError?: boolean;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  { label: "B.Tech CSE Fees", query: "What is the B.Tech CSE tuition fee?" },
  { label: "Admissions", query: "How does the admission process work?" },
  { label: "Placements", query: "What are the latest campus placement statistics?" },
  { label: "Programs Offered", query: "Which undergraduate and postgraduate courses are offered?" },
  { label: "Hostel & Facilities", query: "What are the hostel accommodations and facilities?" },
];

const createInitialGreeting = (name?: string): ChatMessage => ({
  id: "greeting-1",
  sender: "bot",
  text: `Hello ${name ? name.split(" ")[0] : "there"}! 👋 I'm the official EduReach Campus Assistant. Ask me anything about courses, fees, admissions, placements, scholarships, or campus hostels!`,
  timestamp: new Date(),
});

export default function ChatDrawer({ open, onClose, triggerRef }: ChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createInitialGreeting(user?.name),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle focus retention and Esc listener
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      const triggerEl = triggerRef?.current;

      // Focus the input textarea once drawer opens
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }

        // Trap focus inside drawer
        if (e.key === "Tab" && drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              last?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first?.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);

        // Return focus to trigger
        if (triggerEl) {
          triggerEl.focus();
        } else if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [open, onClose, triggerRef]);

  // Scroll to bottom on new message or loading change
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const messageContent = (textToSend ?? input).trim();
      if (!messageContent || loading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: messageContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      if (!textToSend) {
        setInput("");
      }
      setLoading(true);

      try {
        const data = await sendMessage(messageContent);
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (err: unknown) {
        const errorText =
          err && typeof err === "object" && "response" in err
            ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
              "The assistant is temporarily unavailable. Please try again.")
            : "The assistant is temporarily unavailable. Please try again.";

        toast.error(errorText);

        const errorMessage: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: errorText,
          isError: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading],
  );

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  // Has the user sent any message yet?
  const hasUserSentMessage = messages.some((m) => m.sender === "user");

  if (!open) return null;

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="EduReach Campus AI Assistant"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[440px] h-[580px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl border border-neutral-200/80 flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-maroon via-maroon-dark to-maroon text-white px-4 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-semibold text-base leading-tight">
                EduReach Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gold/20 text-gold border border-gold/30">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            </div>
            <p className="text-xs text-white/70 font-body">Official Campus Knowledge Base</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant drawer"
          className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message List */}
      <div
        aria-live="polite"
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-neutral-50/50 font-body text-sm"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-lg bg-maroon/10 border border-maroon/20 flex items-center justify-center shrink-0 mb-0.5">
                <Bot className="w-4 h-4 text-maroon" />
              </div>
            )}

            <div
              className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-maroon text-white rounded-br-sm shadow-sm"
                  : msg.isError
                    ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-sm"
                    : "bg-white text-neutral-800 border border-neutral-200/90 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.isError && (
                <div className="flex items-center gap-1.5 mb-1 text-red-600 font-medium text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Error</span>
                </div>
              )}
              {/* Bot messages must render with whitespace-pre-wrap and no dangerouslySetInnerHTML */}
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-lg bg-maroon/10 border border-maroon/20 flex items-center justify-center shrink-0 mb-0.5">
              <Bot className="w-4 h-4 text-maroon" />
            </div>
            <div
              role="status"
              aria-label="EduReach Assistant is typing"
              className="px-4 py-3 bg-white text-neutral-500 border border-neutral-200/90 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5"
            >
              <div className="w-2 h-2 rounded-full bg-maroon/60 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-maroon/60 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-maroon/60 animate-bounce" />
              <span className="sr-only">EduReach Assistant is formulating a response</span>
            </div>
          </div>
        )}

        {/* Quick Question Chips: Shown until user sends first message */}
        {!hasUserSentMessage && (
          <div className="pt-2 pb-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => void handleSend(chip.query)}
                  disabled={loading}
                  className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-maroon/5 text-maroon border border-maroon/20 hover:border-maroon/40 shadow-2xs transition-colors text-left focus:outline-none focus:ring-2 focus:ring-maroon disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSend();
        }}
        className="p-3 bg-white border-t border-neutral-200 flex items-end gap-2"
      >
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Ask about fees, admissions, courses..."
            maxLength={1000}
            aria-label="Type your message"
            className="w-full resize-none rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon max-h-24 font-body"
          />
        </div>

        <button
          type="submit"
          disabled={loading || input.trim().length === 0}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-maroon hover:bg-maroon-dark text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gold shrink-0 mb-0.5 shadow-sm"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </form>
    </div>
  );
}
