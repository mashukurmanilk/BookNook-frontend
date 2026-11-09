"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { BookItem } from "@/components/BookCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  User,
  Mail,
  ShieldCheck,
  CheckCircle,
  X,
  Clock,
  Sparkles,
} from "lucide-react";

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState<BookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);

  // Return Date: default to 14 days from now
  const defaultReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  };

  const [returnDate, setReturnDate] = useState(defaultReturnDate());

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        setLoading(true);
        const res = await apiRequest<BookItem>(`/books/${resolvedParams.id}`);
        if (res.success && res.data) {
          setBook(res.data);
          document.title = `BookNook | ${res.data.title}`;
        } else {
          setBook(null);
        }
      } catch (err: any) {
        toast.error("Could not load book details.");
        setBook(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBookDetails();
  }, [resolvedParams.id]);

  const handleOpenBorrowModal = () => {
    if (!user) {
      toast.info("Please log in to borrow books from BookNook.");
      router.push(`/login?callbackUrl=/books/${resolvedParams.id}`);
      return;
    }

    if (!book || book.availableCopies <= 0) {
      toast.error("This book is currently out of stock.");
      return;
    }

    setBorrowModalOpen(true);
  };

  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !book) return;

    if (!returnDate) {
      toast.error("Please specify a return date.");
      return;
    }

    const selected = new Date(returnDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selected <= now) {
      toast.error("Return date must be in the future.");
      return;
    }

    setIsBorrowing(true);
    try {
      const res = await apiRequest("/borrows", {
        method: "POST",
        requiresAuth: true,
        body: JSON.stringify({
          bookId: book._id,
          returnDate: selected.toISOString(),
        }),
      });

      if (res.success) {
        toast.success(`"${book.title}" borrowed successfully!`);

        // Trigger celebratory confetti
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });

        // Decrement local copies immediately
        setBook((prev) =>
          prev
            ? {
                ...prev,
                availableCopies: Math.max(0, prev.availableCopies - 1),
              }
            : null
        );

        setBorrowModalOpen(false);
      }
    } catch (err: any) {
      const msg = err.message || "Failed to borrow book.";
      toast.error(msg);
    } finally {
      setIsBorrowing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading book details..." size="lg" />;
  }

  if (!book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 space-y-4">
        <BookOpen className="w-12 h-12 text-muted-foreground/50" />
        <h2 className="font-serif text-2xl font-bold text-foreground">Book Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested book does not exist in our library catalog.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = book.availableCopies <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Books</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Book Cover */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 sm:w-72 lg:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-border/80 bg-muted/30">
              {book.image ? (
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <BookOpen className="w-16 h-16 mb-2 text-muted-foreground/40" />
                  <span className="font-serif text-lg font-bold">{book.title}</span>
                </div>
              )}
            </div>

            {/* Quick Stock Indicator below image */}
            <div className="mt-5 w-full max-w-[280px] p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Availability Status</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  isOutOfStock
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>
            </div>
          </div>

          {/* Right Column: Book Metadata & Borrow Action */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                  {book.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Added {formatDate(book.createdAt)}</span>
                </span>
              </div>

              {/* Title & Author */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
                  {book.title}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Written by <span className="font-semibold text-foreground">{book.author}</span>
                </p>
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Book Overview
                </h3>
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              {/* Stock and Contributor Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Available Copies
                  </span>
                  <span className="font-serif text-xl font-bold text-foreground">
                    {book.availableCopies}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Total Copies
                  </span>
                  <span className="font-serif text-xl font-bold text-foreground">
                    {book.totalCopies}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border col-span-2 sm:col-span-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Contributed By
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {book.userName || "Community Member"}
                  </span>
                </div>
              </div>
            </div>

            {/* Borrow Action Section */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleOpenBorrowModal}
                disabled={isOutOfStock}
                className={`w-full sm:w-auto flex-1 py-3.5 px-8 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                    : "bg-foreground text-background hover:opacity-90 hover:scale-[1.02]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isOutOfStock ? "Not Available" : "Borrow This Book"}</span>
              </button>

              <Link
                href="/books"
                className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold transition-colors text-center"
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Modal Form */}
      {borrowModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setBorrowModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-600">
                Loan Confirmation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Borrow Book
              </h2>
              <p className="text-xs text-muted-foreground">
                Please review your borrower credentials and select your anticipated return date.
              </p>
            </div>

            {/* Selected Book Header Preview */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/40 border border-border">
              {book.image && (
                <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-serif text-sm font-bold text-foreground truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {book.availableCopies} Copies Available
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              {/* User Name (Read-only) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Borrower Name (Read-only)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    readOnly
                    value={user.name || user.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/60 text-sm text-foreground/80 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* User Email (Read-only) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Borrower Email (Read-only)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/60 text-sm text-foreground/80 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Return Date Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Anticipated Return Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    required
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Recommended loan period is 7 to 14 days.
                </p>
              </div>

              {/* Confirm Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBorrowModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBorrowing}
                  className="flex-1 py-3 px-4 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md flex items-center justify-center gap-1.5"
                >
                  {isBorrowing ? (
                    <span>Processing loan...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Borrow</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
