"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  BookmarkCheck,
  BookOpen,
  RotateCcw,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface BorrowItem {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  userEmail: string;
  userName?: string;
  borrowDate: string;
  returnDate: string;
  status: "borrowed" | "returned";
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [borrows, setBorrows] = useState<BorrowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
    if (!isLoading && !user) {
      toast.info("Please sign in to view your borrowed books.");
      router.push("/login?callbackUrl=/my-borrows");
    }
  }, [user, isLoading, router]);

  const fetchBorrows = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await apiRequest<BorrowItem[]>("/borrows", {
        requiresAuth: true,
      });
      if (res.success && Array.isArray(res.data)) {
        setBorrows(res.data);
      } else {
        setBorrows([]);
      }
    } catch (err) {
      console.error("Failed to fetch borrows:", err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBorrows();
    }
  }, [user]);

  const handleReturnBook = async (borrow: BorrowItem) => {
    setReturningId(borrow._id);
    try {
      const res = await apiRequest(`/borrows/${borrow._id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      if (res.success) {
        toast.success(`"${borrow.bookTitle}" returned successfully! Thank you.`);

        // Confetti effect
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Remove from list
        setBorrows((prev) => prev.filter((b) => b._id !== borrow._id));
      } else {
        toast.error(res.message || "Failed to return book.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to return book.");
    } finally {
      setReturningId(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Checking member loan account..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Active Loans</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            My Borrowed Books
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your ongoing reading loans and return books when you finish.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto shadow-sm"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse More Books</span>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSpinner message="Retrieving your borrowed books..." />
      ) : borrows.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-border bg-card space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <h3 className="font-serif text-xl font-bold text-foreground">
            No active book loans
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            You do not currently have any borrowed books. Discover something fascinating in our library!
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <span>Explore Library Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Borrow Date</th>
                  <th className="px-6 py-4">Due Return Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {borrows.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                    {/* Book Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted/60 flex-shrink-0 border border-border">
                          {item.bookImage ? (
                            <Image
                              src={item.bookImage}
                              alt={item.bookTitle}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/books/${item.bookId}`}
                            className="font-serif font-bold text-foreground hover:text-brand-600 transition-colors line-clamp-1 block text-sm"
                          >
                            {item.bookTitle}
                          </Link>
                          <span className="text-[11px] text-muted-foreground">
                            Loan ID: {item._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Borrow Date */}
                    <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                        <span>{formatDate(item.borrowDate)}</span>
                      </div>
                    </td>

                    {/* Return Date */}
                    <td className="px-6 py-4 text-xs font-medium text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{formatDate(item.returnDate)}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Active Loan
                      </span>
                    </td>

                    {/* Return Book Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleReturnBook(item)}
                        disabled={returningId === item._id}
                        className="py-2 px-4 rounded-xl border border-border bg-card hover:bg-foreground hover:text-background text-foreground text-xs font-semibold transition-all duration-200 inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        <RotateCcw
                          className={`w-3.5 h-3.5 ${
                            returningId === item._id ? "animate-spin" : ""
                          }`}
                        />
                        <span>
                          {returningId === item._id ? "Returning..." : "Return Book"}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
