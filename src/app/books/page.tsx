"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookCard, BookItem } from "@/components/BookCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { apiRequest } from "@/lib/api";
import { Search, Filter, ArrowUpDown, BookOpen, X } from "lucide-react";

const CATEGORIES = ["All", "Fiction", "Science", "History", "Kids", "Others"];

function BooksContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title_asc" | "title_desc">("newest");

  useEffect(() => {
    document.title = "BookNook | All Books";
    async function fetchBooks() {
      try {
        setLoading(true);
        const res = await apiRequest<BookItem[]>("/books");
        if (res.success && Array.isArray(res.data)) {
          setBooks(res.data);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  // Update selectedCategory if query param changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Client-side filtering and sorting for instant responsiveness
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by Category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(
        (b) => b.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search (Title or Author)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === "title_asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title_desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      return 0;
    });

    return result;
  }, [books, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          Library Catalog
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Browse our complete catalog of titles available for borrowing and learning.
        </p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by book title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all cursor-pointer"
            >
              <option value="newest">Sort: Newest Additions</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="title_asc">Sort: Title (A - Z)</option>
              <option value="title_desc">Sort: Title (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0 mr-1 hidden sm:block" />
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{filteredBooks.length}</strong> {filteredBooks.length === 1 ? "book" : "books"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>
      </div>

      {/* Books Grid */}
      {loading ? (
        <LoadingSpinner message="Searching library catalog..." />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-border bg-card space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <h3 className="font-serif text-xl font-bold text-foreground">
            No matching books found
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search keywords or choosing a different category filter.
          </p>
          {(searchTerm || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-muted"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading catalog..." />}>
      <BooksContent />
    </Suspense>
  );
}
