"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import {
  BookPlus,
  User,
  Mail,
  BookOpen,
  Feather,
  Layers,
  FileText,
  UploadCloud,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [image, setImage] = useState("");
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Authentication check: don't prematurely redirect while session is loading
  useEffect(() => {
    document.title = "BookNook | Add Book";
    if (!isLoading && !user) {
      toast.info("Please sign in to add books to the library.");
      router.push("/login?callbackUrl=/add-book");
    }
  }, [user, isLoading, router]);

  // Image Upload Handler (ImgBB integration with fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum image size is 5MB.");
      return;
    }

    setUploadingImage(true);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
      if (apiKey && apiKey !== "mock_key") {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.data?.url) {
          setImage(data.data.url);
          toast.success("Image uploaded to ImgBB successfully!");
          return;
        }
      }

      // Fallback: Read as Data URL or use local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast.success("Book cover attached!");
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest("/books", {
        method: "POST",
        requiresAuth: true,
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category,
          image: image.trim(),
          totalCopies: Number(totalCopies),
          description: description.trim(),
        }),
      });

      if (res.success) {
        toast.success(`"${title}" has been successfully added to BookNook!`);
        router.push("/my-books");
      } else {
        toast.error(res.message || "Failed to add book.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving the book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground text-background font-bold mb-1 shadow-md">
          <BookPlus className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Add New Book
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Contribute a book to our shared community library for members to discover and borrow.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Book Title *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sapiens: A Brief History of Humankind"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Author Name *
              </label>
              <div className="relative">
                <Feather className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Yuval Noah Harari"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
              </div>
            </div>

            {/* Category Select Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Copies */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Total Copies *
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
              </div>
            </div>
          </div>

          {/* Book Image Field: Support File Upload (ImgBB) or Direct URL */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Book Cover Image
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Direct URL input */}
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  placeholder="Paste image URL (ImgBB, Unsplash, etc.)..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
              </div>

              {/* Upload File to ImgBB / Local */}
              <div className="relative">
                <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-border bg-muted/30 hover:bg-muted/60 text-xs font-semibold text-foreground cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4 text-brand-600" />
                  <span>{uploadingImage ? "Uploading..." : "Upload Image to ImgBB"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Live Image Preview */}
            {image && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border">
                <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image src={image} alt="Cover preview" fill className="object-cover" unoptimized />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Cover preview verified</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-xs">{image}</p>
                </div>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Short Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <textarea
                required
                rows={4}
                placeholder="Provide a concise summary, key themes, or why you recommend this book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
              />
            </div>
          </div>

          {/* User Name & Email (Read-only as required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Contributor Name (Read-only)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  readOnly
                  value={user.name}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/60 text-xs text-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Contributor Email (Read-only)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="email"
                  readOnly
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/60 text-xs text-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Publishing to Library...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Add Book to Catalog</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
