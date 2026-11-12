"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Atom,
  Landmark,
  Baby,
  Compass,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { BookItem } from "@/components/BookCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface CategoryMeta {
  name: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

const BASE_CATEGORIES: Omit<CategoryMeta, "count">[] = [
  {
    name: "Fiction",
    label: "Fiction",
    description: "Novels, literary adventures, and compelling mysteries",
    icon: BookOpen,
  },
  {
    name: "Science",
    label: "Science",
    description: "Technology, space, culinary science, and nature",
    icon: Atom,
  },
  {
    name: "History",
    label: "History",
    description: "Chronicles, biographies, and world-shaping events",
    icon: Landmark,
  },
  {
    name: "Kids",
    label: "Kids",
    description: "Illustrated tales, bedtime stories, and young readers",
    icon: Baby,
  },
  {
    name: "Others",
    label: "Others",
    description: "Philosophy, creative arts, memoirs, and essays",
    icon: Compass,
  },
];

export function CategoryExplorer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryBooks, setCategoryBooks] = useState<BookItem[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When user clicks the section to view available categories
  const handleToggleOrFetchCategories = async () => {
    if (!categoriesLoaded) {
      try {
        setLoadingCategories(true);
        setIsExpanded(true);
        setError(null);

        // Fetch all books to compute live counts for each available category
        const res = await apiRequest<BookItem[]>("/books");
        const allBooks = Array.isArray(res.data) ? res.data : [];

        // Build categories with real counts from database
        const loadedCategories: CategoryMeta[] = BASE_CATEGORIES.map((base) => {
          const matchCount = allBooks.filter(
            (b) => b.category?.toLowerCase() === base.name.toLowerCase()
          ).length;
          return {
            ...base,
            count: matchCount,
          };
        });

        // Also check if user added any other unique categories outside base list
        const extraCategories = Array.from(
          new Set(
            allBooks
              .map((b) => b.category)
              .filter(
                (c) =>
                  Boolean(c) &&
                  !BASE_CATEGORIES.some((b) => b.name.toLowerCase() === c.toLowerCase())
              )
          )
        );

        extraCategories.forEach((catName) => {
          const count = allBooks.filter((b) => b.category === catName).length;
          loadedCategories.push({
            name: catName,
            label: catName,
            description: `Curated ${catName} books in the library catalog`,
            icon: Sparkles,
            count,
          });
        });

        setCategories(loadedCategories);
        setCategoriesLoaded(true);

        // Auto-select the first category with books or the first category
        const initialCategory =
          loadedCategories.find((c) => c.count > 0)?.name || loadedCategories[0].name;
        handleSelectCategory(initialCategory);
      } catch (err: any) {
        console.error("Failed to load categories:", err);
        setError("Could not retrieve available categories from library server.");
        // Fallback with base categories
        setCategories(BASE_CATEGORIES.map((c) => ({ ...c, count: 0 })));
        setCategoriesLoaded(true);
      } finally {
        setLoadingCategories(false);
      }
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  // When user clicks one specific category
  const handleSelectCategory = async (categoryName: string) => {
    try {
      setSelectedCategory(categoryName);
      setLoadingBooks(true);
      setError(null);

      // Fetch available books for this specific category from database
      const res = await apiRequest<BookItem[]>(
        `/books?category=${encodeURIComponent(categoryName)}`
      );

      if (res.success && Array.isArray(res.data)) {
        setCategoryBooks(res.data);
      } else {
        setCategoryBooks([]);
      }
    } catch (err: any) {
      console.error(`Failed to fetch books for category ${categoryName}:`, err);
      setError(`Could not load books for category "${categoryName}".`);
      setCategoryBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Solid Container - NO GRADIENTS */}
        <div className="rounded-3xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
          
          {/* Header Banner: Clickable to fetch and display available categories */}
          <div
            onClick={handleToggleOrFetchCategories}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggleOrFetchCategories();
              }
            }}
            className="w-full text-left p-6 sm:p-10 cursor-pointer bg-stone-900 text-white transition-colors hover:bg-stone-850 select-none"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/10">
                  <Layers className="w-3.5 h-3.5 text-brand-400" />
                  <span>Library Categories</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Explore Collections by Category
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                  {categoriesLoaded
                    ? "Browse through curated genres below. Click any category to view available books."
                    : "Click this section to fetch and display available categories and explore curated books."}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-stone-950 font-semibold text-xs sm:text-sm shadow-sm hover:bg-stone-200 transition-colors">
                  <span>{categoriesLoaded && isExpanded ? "Hide Categories" : "Explore Categories"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Expanded Section Body */}
          {isExpanded && (
            <div className="p-6 sm:p-10 space-y-8 border-t border-border bg-background">
              {loadingCategories ? (
                <div className="py-12">
                  <LoadingSpinner message="Fetching available categories from database..." />
                </div>
              ) : (
                <>
                  {/* Category Selection Tabs / Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Select a Category:
                      </span>
                      {selectedCategory && (
                        <span className="text-xs text-muted-foreground">
                          Showing books in{" "}
                          <strong className="text-foreground">{selectedCategory}</strong>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.name;

                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => handleSelectCategory(cat.name)}
                            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-150 ${
                              isSelected
                                ? "bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/20 dark:bg-white dark:text-stone-950 dark:border-white"
                                : "bg-card text-foreground border-border hover:bg-muted/80"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-2">
                              <span
                                className={`p-2 rounded-xl ${
                                  isSelected
                                    ? "bg-white/10 text-brand-400 dark:bg-stone-100 dark:text-brand-600"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? "bg-white/20 text-white dark:bg-stone-200 dark:text-stone-900"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {cat.count} {cat.count === 1 ? "book" : "books"}
                              </span>
                            </div>

                            <span className="font-semibold text-sm">{cat.label}</span>
                            <span
                              className={`text-[11px] line-clamp-1 mt-0.5 ${
                                isSelected
                                  ? "text-stone-300 dark:text-stone-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {cat.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Category Books Showcase */}
                  <div className="pt-4 border-t border-border">
                    {loadingBooks ? (
                      <div className="py-12">
                        <LoadingSpinner
                          message={`Fetching available ${selectedCategory || ""} books...`}
                        />
                      </div>
                    ) : error ? (
                      <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card space-y-2">
                        <p className="text-sm font-semibold text-destructive">{error}</p>
                      </div>
                    ) : categoryBooks.length === 0 ? (
                      <div className="p-10 text-center rounded-2xl border border-dashed border-border bg-card space-y-3">
                        <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/60" />
                        <h4 className="font-serif text-base font-bold text-foreground">
                          No Books in &ldquo;{selectedCategory}&rdquo; Yet
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          There are currently no books cataloged under this category. Would you like
                          to add the first one?
                        </p>
                        <div className="pt-2">
                          <Link
                            href="/add-book"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90"
                          >
                            <span>Add a {selectedCategory} Book</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                            Available in {selectedCategory} ({categoryBooks.length})
                          </h3>
                          <Link
                            href={`/books?category=${encodeURIComponent(selectedCategory || "")}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                          >
                            <span>View all {selectedCategory} in library</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* Category Books Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                          {categoryBooks.map((book) => (
                            <div
                              key={book._id}
                              className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-foreground/20"
                            >
                              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-muted mb-3.5">
                                {book.image ? (
                                  <Image
                                    src={book.image}
                                    alt={book.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
                                    <BookOpen className="w-10 h-10 mb-1" />
                                    <span className="text-xs font-serif">{book.title}</span>
                                  </div>
                                )}

                                <div className="absolute top-2 right-2">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/75 text-emerald-400 backdrop-blur border border-white/10">
                                    {book.availableCopies} left
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 flex flex-col justify-between space-y-2">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                                    {book.category}
                                  </span>
                                  <h4 className="font-serif text-sm font-bold text-foreground line-clamp-1 group-hover:text-brand-600 transition-colors">
                                    {book.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    By {book.author}
                                  </p>
                                </div>

                                <div className="pt-2">
                                  <Link
                                    href={`/books/${book._id}`}
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-foreground hover:text-background transition-colors"
                                  >
                                    <span>View Details</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
