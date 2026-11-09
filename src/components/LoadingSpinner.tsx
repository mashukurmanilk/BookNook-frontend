import React from "react";
import { BookOpen } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Loading library collection...",
  size = "md",
}: LoadingSpinnerProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center animate-pulse">
          <BookOpen className={`${iconSizes[size]} text-brand-600 animate-bounce`} />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-brand-500/10 blur-sm -z-10 animate-pulse" />
      </div>
      {message && (
        <p className="text-xs sm:text-sm font-medium text-muted-foreground animate-pulse tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;
