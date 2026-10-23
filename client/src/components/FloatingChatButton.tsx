import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Bot, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import ChatDrawer from "./ChatDrawer.tsx";

export default function FloatingChatButton() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-label={open ? "Close chat assistant" : "Chat with EduReach AI Assistant"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-maroon via-maroon to-maroon-dark text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-gold/40 focus:outline-none focus:ring-4 focus:ring-gold/50 cursor-pointer"
      >
        {open ? (
          <>
            <X className="w-5 h-5 text-white" />
            <span className="font-heading font-semibold text-sm tracking-wide">Close</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Bot className="w-5 h-5 text-gold" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold" />
            </div>
            <span className="font-heading font-semibold text-sm tracking-wide">AI Assistant</span>
            <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/40">
              <Sparkles className="w-2.5 h-2.5" />
              RAG
            </span>
          </>
        )}
      </button>

      <ChatDrawer open={open} onClose={() => setOpen(false)} triggerRef={buttonRef} />
    </>
  );
}
