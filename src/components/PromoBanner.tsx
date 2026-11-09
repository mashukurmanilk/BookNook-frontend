import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white min-h-[300px] flex items-center justify-center p-8 sm:p-12 text-center">
          {/* Whimsical decorative shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-200 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Curated Wonderland</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
              Children Books
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-lg mx-auto">
              Explore books that entertain, educate, and inspire children of all ages. From bedtime
              fairytales to thrilling young adventures.
            </p>

            <div className="pt-2">
              <Link
                href="/books?category=Kids"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-emerald-950 text-sm font-semibold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:scale-105"
              >
                <span>Visit Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
