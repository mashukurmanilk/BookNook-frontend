"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { ArrowRight, Sparkles, BookMarked, CheckCircle2 } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface SlideData {
  id: string;
  category: string;
  title: string;
  author: string;
  description: string;
  highlights: string[];
  image: string;
  bgGradient: string;
}

const slides: SlideData[] = [
  {
    id: "1",
    category: "Science & Culinary",
    title: "THE SCIENCE OF SPICE",
    author: "By Dr. Stuart Farrimond",
    description:
      "This beautifully illustrated volume explores the chemistry, history, and culinary use of over 60 spices. Organized like a periodic table of flavor compounds, it reveals how to revolutionize your cooking.",
    highlights: [
      "Why spices taste the way they do",
      "How to combine them scientifically for superior flavor",
      "Cultural and regional heritage of world spices",
      "Formulate your own custom signature spice blends",
    ],
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
    bgGradient: "from-stone-900 via-amber-950/80 to-stone-900",
  },
  {
    id: "2",
    category: "Psychology & Growth",
    title: "THE PSYCHOLOGY OF MONEY",
    author: "By Morgan Housel",
    description:
      "Doing well with money isn’t necessarily about what you know. It’s about how you behave. Timeless lessons on wealth, greed, patience, and happiness across 19 engaging short stories.",
    highlights: [
      "The hidden difference between being rich and staying wealthy",
      "Why personal experience shapes 80% of our financial decisions",
      "The quiet compounding superpower of patience and calm",
      "Freedom: the highest dividend money can ever purchase",
    ],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    bgGradient: "from-slate-900 via-emerald-950/80 to-slate-900",
  },
  {
    id: "3",
    category: "Habits & Self-Development",
    title: "ATOMIC HABITS",
    author: "By James Clear",
    description:
      "No matter your goals, Atomic Habits offers a proven framework for improving every day. Learn how tiny changes can lead to remarkable, life-altering results over time.",
    highlights: [
      "The compound power of getting 1% better each day",
      "Why you should focus on your systems instead of goals",
      "The 4 Laws of Behavior Change for unbreakable habits",
      "How to shape your environment to make good habits effortless",
    ],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    bgGradient: "from-zinc-900 via-rose-950/80 to-zinc-900",
  },
];

export function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-stone-950 text-white">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        speed={900}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="w-full min-h-[580px] lg:min-h-[640px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative w-full min-h-[580px] lg:min-h-[640px] flex items-center py-12 lg:py-16 bg-gradient-to-r ${slide.bgGradient}`}
            >
              {/* Subtle background ambient overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column: Content */}
                  <div className="lg:col-span-7 space-y-5 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white/90 text-xs uppercase tracking-widest font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{slide.category}</span>
                    </div>

                    <div className="space-y-1">
                      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-sm leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-sm sm:text-base font-semibold tracking-wider uppercase text-amber-200/90 font-sans">
                        {slide.author}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    {/* Bullet Highlights (Inspired by uploaded screenshot) */}
                    <div className="space-y-2 pt-1 border-t border-white/10">
                      <p className="text-xs uppercase tracking-widest font-bold text-amber-400">
                        What You&apos;ll Discover:
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-200">
                        {slide.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3">
                      <Link
                        href="/books"
                        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-stone-900 font-semibold text-sm hover:bg-stone-200 transition-all duration-200 shadow-xl group hover:scale-105"
                      >
                        <BookMarked className="w-4 h-4 text-brand-600 group-hover:rotate-6 transition-transform" />
                        <span>Browse Books</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: 3D Book Showcase */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="relative group">
                      {/* Ambient book glow */}
                      <div className="absolute -inset-4 rounded-3xl bg-amber-500/20 blur-2xl group-hover:bg-amber-500/30 transition-all duration-500" />

                      {/* Standing 3D Book Cover Card */}
                      <div className="relative w-64 sm:w-72 lg:w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          priority
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                          <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                            BookNook Featured
                          </span>
                          <span className="text-lg font-serif font-bold text-white leading-tight">
                            {slide.title}
                          </span>
                          <span className="text-xs text-stone-300">{slide.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
