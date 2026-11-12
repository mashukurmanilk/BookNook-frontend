"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { BookOpen, Layers, ArrowUpRight, Clock } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { BookItem } from "@/components/BookCard";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Fallback curated titles if DB is empty on initial setup
const DEFAULT_FALLBACK_BOOKS: BookItem[] = [
  {
    _id: "seed-1",
    title: "The Science of Spice",
    author: "Dr. Stuart Farrimond",
    category: "Science",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
    description:
      "Explore the chemistry, history, and culinary use of over 60 spices. Organized like a periodic table of flavor compounds, it reveals how to revolutionize your cooking.",
    totalCopies: 5,
    availableCopies: 5,
  },
  {
    _id: "seed-2",
    title: "Still Me: A Novel",
    author: "Jojo Moyes",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    description:
      "Louisa Clark arrives in New York ready for adventures and confident that she can embrace her new life while keeping her relationship with Ambulance Sam alive.",
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    _id: "seed-3",
    title: "The Boyfriend: A Riveting Psychological Thriller",
    author: "Freida McFadden",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop",
    description:
      "Sydney Shaw thinks she has finally met the man of her dreams in a charming doctor. But when a brutal killer begins terrorizing the city, she starts wondering who he truly is.",
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    _id: "seed-4",
    title: "Facebook: The Inside Story",
    author: "Steven Levy",
    category: "Science",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    description:
      "The definitive history of the company that transformed human connection and society, based on unprecedented three years of access to company leadership.",
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    _id: "seed-5",
    title: "Throne of Nightmares",
    author: "Kerri Maniscalco",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3dd45?q=80&w=800&auto=format&fit=crop",
    description:
      "A thrilling fantasy filled with intoxicating magic, deadly court intrigue, and romantic suspense set within the shadows of an ancient mystical realm.",
    totalCopies: 4,
    availableCopies: 4,
  },
];

export function HeroSlider() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    async function loadHeroBooks() {
      try {
        setLoading(true);
        // Fetch first 5 books from the database
        const res = await apiRequest<BookItem[]>("/books?limit=5&sort=newest");
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setBooks(res.data.slice(0, 5));
        } else {
          setBooks(DEFAULT_FALLBACK_BOOKS);
        }
      } catch (err) {
        console.error("HeroSlider fetch failed, using fallback:", err);
        setBooks(DEFAULT_FALLBACK_BOOKS);
      } finally {
        setLoading(false);
      }
    }

    loadHeroBooks();
  }, []);

  const displayedBooks = books.length > 0 ? books.slice(0, 5) : DEFAULT_FALLBACK_BOOKS;

  return (
    <section className="relative w-full overflow-hidden bg-[#14151a] text-white border-b border-border/40">
      {/* 5-second progress bar showing the time completing for the active book */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/10">
        <div
          ref={progressBarRef}
          className="h-full bg-neutral-300 will-change-[width]"
          style={{ width: "0%" }}
        />
      </div>

      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={1000} // Smooth 1s crossfade transition
        autoplay={{
          delay: 10000, // 10 seconds per book
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={displayedBooks.length > 1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveSlideIndex(swiper.realIndex);
          if (progressBarRef.current) {
            progressBarRef.current.style.width = "0%";
          }
        }}
        onAutoplayTimeLeft={(_swiper, _timeLeft, percentage) => {
          if (progressBarRef.current) {
            // In Swiper, percentage goes from 1.0 to 0.0. (1 - percentage) goes from 0 to 100%
            const pct = Math.max(0, Math.min(100, (1 - percentage) * 100));
            progressBarRef.current.style.width = `${pct}%`;
          }
        }}
        className="w-full min-h-[560px] lg:min-h-[600px]"
      >
        {displayedBooks.map((book, index) => {
          const detailUrl = book._id.startsWith("seed-") ? "/books" : `/books/${book._id}`;

          return (
            <SwiperSlide key={book._id}>
              <div className="relative w-full min-h-[560px] lg:min-h-[600px] flex items-center py-8 sm:py-12 lg:py-16 bg-[#14151a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  {/* Grid layout: image is order-1 on mobile, text is order-2 on mobile */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    
                    {/* 1. Book Cover Showcase: IN MOBILE VIEW, IMAGE IS FIRST (order-1), on desktop it sits on the right (order-2) */}
                    <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center justify-center">
                      <div className="relative w-48 sm:w-60 lg:w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#1b1c23]">
                        {book.image ? (
                          <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400">
                            <BookOpen className="w-14 h-14 mb-2 text-stone-500" />
                            <span className="font-serif text-sm font-semibold text-white">
                              {book.title}
                            </span>
                          </div>
                        )}

                        {/* Top Stock Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/80 backdrop-blur text-emerald-400 border border-white/10">
                            {book.availableCopies} in stock
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Text Content: IN MOBILE VIEW, TEXT IS SECOND (order-2), on desktop it sits on the left (order-1) */}
                    <div className="order-2 lg:order-1 lg:col-span-7 space-y-5 text-center lg:text-left">
                      {/* Meta badge */}
                      <div className="flex items-center justify-center lg:justify-start gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-widest border border-white/10">
                          {book.category}
                        </span>
                        <span className="text-xs text-stone-400 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{book.totalCopies} Total Copies</span>
                        </span>
                      </div>

                      {/* Book Title & Author */}
                      <div className="space-y-1.5">
                        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                          {book.title}
                        </h1>
                        <p className="text-sm sm:text-base font-medium tracking-wide uppercase text-brand-300 font-sans">
                          By {book.author}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm lg:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-3 sm:line-clamp-4">
                        {book.description}
                      </p>

                      {/* Action buttons */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                        <Link
                          href={detailUrl}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white text-stone-950 font-semibold text-xs sm:text-sm hover:bg-stone-200 transition-all duration-200 shadow-lg"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        <Link
                          href="/books"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10 font-semibold text-xs sm:text-sm transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-brand-400" />
                          <span>Browse All Books</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
