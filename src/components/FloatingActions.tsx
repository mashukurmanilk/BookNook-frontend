"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="pointer-events-auto p-3 rounded-full bg-card border border-border shadow-lg text-foreground hover:bg-muted hover:border-foreground/30 transition-all duration-300 animate-in fade-in"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Floating Chat with Us Button (matching screenshot aesthetic) */}
      <a
        href="https://wa.me/18005556665?text=Hello%20BookNook%20Support,%20I%20have%20a%20question!"
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 font-medium text-xs sm:text-sm"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>Chat with Us</span>
      </a>
    </div>
  );
}
