"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { BookItem } from "@/components/BookCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Library,
  PlusCircle,
  Edit3,
  Trash2,
  BookOpen,
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("Fiction");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTotalCopies, setEditTotalCopies] = useState<number>(1);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State (Custom modal, NOT window.confirm)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<BookItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.info("Please sign in to access your contributed books.");
      router.push("/login?callbackUrl=/my-books");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function fetchMyBooks() {
      if (!user) return;
      try {
        setLoading(true);
        // Query backend for books added by current user
        const res = await apiRequest<BookItem[]>(`/books?userEmail=${encodeURIComponent(user.email)}`);
        if (res.success && Array.isArray(res.data)) {
          setBooks(res.data);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("Failed to load user books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchMyBooks();
    }
  }, [user]);

  // Handle Opening Edit Modal
  const handleOpenEdit = (book: BookItem) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditImage(book.image);
    setEditDescription(book.description);
    setEditTotalCopies(book.totalCopies);
    setEditModalOpen(true);
  };

  // Handle Submitting Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    if (!editTitle.trim() || !editAuthor.trim() || !editDescription.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await apiRequest(`/books/${editingBook._id}`, {
        method: "PATCH",
        requiresAuth: true,
        body: JSON.stringify({
          title: editTitle.trim(),
          author: editAuthor.trim(),
          category: editCategory,
          image: editImage.trim(),
          description: editDescription.trim(),
          totalCopies: Number(editTotalCopies),
        }),
      });

      if (res.success && res.data) {
        toast.success(`"${editTitle}" updated successfully!`);
        // Update in state
        setBooks((prev) =>
          prev.map((b) => (b._id === editingBook._id ? res.data : b))
        );
        setEditModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update book.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Opening Delete Modal
  const handleOpenDelete = (book: BookItem) => {
    setDeletingBook(book);
    setDeleteModalOpen(true);
  };

  // Handle Confirming Delete
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setIsDeleting(true);
    try {
      const res = await apiRequest(`/books/${deletingBook._id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      if (res.success) {
        toast.success(`"${deletingBook.title}" removed from catalog.`);
        setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
        setDeleteModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete book.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Validating member session..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
            <Library className="w-4 h-4" />
            <span>Member Contributions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            My Books
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage the books you have contributed to the BookNook library collection.
          </p>
        </div>

        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Another Book</span>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading your contributed books..." />
      ) : books.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-border bg-card space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <h3 className="font-serif text-xl font-bold text-foreground">
            You haven&apos;t added any books yet
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Share your favorite reads with our community of readers. It only takes a minute to catalog a book.
          </p>
          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Your First Book</span>
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Book</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Inventory</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-muted/30 transition-colors">
                    {/* Book Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted/60 flex-shrink-0 border border-border">
                          {book.image ? (
                            <Image
                              src={book.image}
                              alt={book.title}
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
                        <div className="min-w-0">
                          <Link
                            href={`/books/${book._id}`}
                            className="font-serif font-bold text-foreground hover:text-brand-600 transition-colors line-clamp-1 block text-sm"
                          >
                            {book.title}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-muted text-foreground border border-border">
                        {book.category}
                      </span>
                    </td>

                    {/* Inventory Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-foreground">
                          {book.availableCopies} Available
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {book.totalCopies} Total Copies
                        </span>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {formatDate(book.createdAt)}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(book)}
                          className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Edit Book"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(book)}
                          className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Book Modal Form */}
      {editModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-600">
                Update Book Information
              </span>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Edit &ldquo;{editingBook.title}&rdquo;
              </h2>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Total Copies *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editTotalCopies}
                    onChange={(e) => setEditTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isUpdating ? "Saving changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal (NOT browser confirm as required) */}
      {deleteModalOpen && deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-900 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Delete This Book?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Are you sure you want to permanently remove{" "}
                <span className="font-semibold text-foreground">&ldquo;{deletingBook.title}&rdquo;</span> from
                the library catalog? This action cannot be undone.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                No, Keep It
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 shadow-md"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
