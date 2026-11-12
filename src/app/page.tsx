"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { BookCard, BookItem } from "@/components/BookCard";
import { PromoBanner } from "@/components/PromoBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { ReaderReviews } from "@/components/ReaderReviews";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { apiRequest } from "@/lib/api";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import dns from "node:dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setLoading(true);
        // Load latest 6 books from database sorted newest first
        const res = await apiRequest<BookItem[]>("/books?limit=6&sort=newest");
        if (res.success && Array.isArray(res.data)) {
          setNewArrivals(res.data);
        } else {
          setNewArrivals([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch new arrivals:", err);
        setError("Could not load latest arrivals from server.");
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Swiper Banner */}
      <HeroSlider />

      {/* 2. New Arrivals (Dynamic: Latest 6 Books) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recently Cataloged</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              The newest literary gems contributed to the BookNook collection.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground hover:text-brand-600 transition-colors"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <LoadingSpinner message="Loading latest library additions..." />
        ) : error && newArrivals.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-border bg-card space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">{error}</p>
            <p className="text-xs text-muted-foreground">
              Make sure the BookNook backend API is running on port 8000.
            </p>
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-border bg-card space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/60" />
            <h3 className="font-serif text-lg font-bold text-foreground">No Books Found Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Be the first to share a book with our community!
            </p>
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90"
            >
              Add First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {/* See All Books Button Below Cards */}
        {newArrivals.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-md hover:scale-105"
            >
              <span>Explore All Books</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 3. Promo Banner: Children Books Collection (Inspired by uploaded Image 2) */}
      <PromoBanner />

      {/* 4. How Borrowing Works */}
      <HowItWorks />

      {/* 5. Reader Reviews */}
      <ReaderReviews />
    </div>
  );
}
