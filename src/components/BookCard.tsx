"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Layers, ArrowUpRight } from "lucide-react";

export interface BookItem {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others" | string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userEmail?: string;
  userName?: string;
  createdAt?: string;
}

interface BookCardProps {
  book: BookItem;
}

export function BookCard({ book }: BookCardProps) {
  const isOutOfStock = book.availableCopies <= 0;

  const categoryBadgeColors: Record<string, string> = {
    Fiction: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    Science: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    History: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    Kids: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    Others: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700",
  };

  const badgeClass =
    categoryBadgeColors[book.category] || categoryBadgeColors["Others"];

  return (
    <div className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-foreground/30 hover:shadow-xl transition-all duration-300">
      {/* Book Cover Container */}
      <div className="relative w-full aspect-[3/4] bg-muted/40 overflow-hidden flex items-center justify-center p-4">
        {book.image ? (
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-book group-hover:shadow-book-hover group-hover:scale-105 transition-all duration-300">
            <Image
              src={book.image}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full h-full rounded-xl bg-muted/60 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
            <BookOpen className="w-12 h-12 mb-2 text-muted-foreground/60" />
            <span className="text-xs font-serif font-semibold">{book.title}</span>
          </div>
        )}

        {/* Floating Stock Badge */}
        <div className="absolute top-6 right-6">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border shadow-sm ${
              isOutOfStock
                ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800"
                : "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800"
            }`}
          >
            {isOutOfStock ? "Not Available" : `${book.availableCopies} Copies`}
          </span>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-wide uppercase border ${badgeClass}`}
            >
              {book.category}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Total: {book.totalCopies}</span>
            </span>
          </div>

          {/* Book Title */}
          <h3
            className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-brand-600 transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-muted-foreground font-medium line-clamp-1">
            by <span className="text-foreground/80">{book.author}</span>
          </p>

          {/* Short Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
            {book.description}
          </p>
        </div>

        {/* View Details Action Button */}
        <div className="pt-2 border-t border-border">
          <Link
            href={`/books/${book._id}`}
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-foreground hover:text-background text-foreground text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 group/btn"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
