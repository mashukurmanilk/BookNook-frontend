import React from "react";
import Link from "next/link";
import { BookX, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "BookNook | Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-muted/80 border border-border text-brand-600 shadow-inner">
          <BookX className="w-12 h-12 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-600">
            Error 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            The page you are looking for might have been moved, removed, or does not exist in our library catalog.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/books"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
