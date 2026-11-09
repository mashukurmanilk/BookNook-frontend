import React from "react";
import { Search, BookCheck, BookOpen, RotateCcw } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Discover Books",
      description: "Search our catalog across Fiction, Science, History, Kids, and more genres.",
      icon: Search,
    },
    {
      step: "02",
      title: "Borrow with One Click",
      description: "Check available copies and confirm your borrow period directly with your account.",
      icon: BookCheck,
    },
    {
      step: "03",
      title: "Immerse in Reading",
      description: "Enjoy peaceful reading knowing your reading journey is tracked in your dashboard.",
      icon: BookOpen,
    },
    {
      step: "04",
      title: "Easy Return",
      description: "Finished your read? Return the book in one click so another member can enjoy it.",
      icon: RotateCcw,
    },
  ];

  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            How Borrowing Works
          </h2>
          <p className="text-sm text-muted-foreground">
            Our library philosophy is simple: &ldquo;Add a book, borrow a book, return a book.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-card rounded-2xl p-6 border border-border hover:border-foreground/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 border border-brand-200 dark:border-brand-900 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif text-2xl font-black text-muted-foreground/30">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-[11px] font-semibold text-brand-600">
                  <span>Step {index + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
