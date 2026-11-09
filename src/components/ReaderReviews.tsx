import React from "react";
import { Star, Quote } from "lucide-react";

export function ReaderReviews() {
  const reviews = [
    {
      name: "Eleanor Vance",
      role: "Literature Enthusiast",
      comment:
        "BookNook has completely reignited my love for physical books. The community spirit and smooth borrowing system makes it an absolute joy to use every week.",
      rating: 5,
      date: "Member since 2025",
    },
    {
      name: "Marcus Davies",
      role: "Software Architect",
      comment:
        "The curated Science & Tech collection is outstanding. Being able to borrow clean code classics and return them seamlessly saves shelf space while fueling my curiosity.",
      rating: 5,
      date: "Member since 2026",
    },
    {
      name: "Sophia Martinez",
      role: "History Teacher",
      comment:
        "The simple philosophy of 'Add a book, borrow a book, return a book' just works. I’ve shared dozens of historical biographies and borrowed incredible fiction titles.",
      rating: 5,
      date: "Member since 2025",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600">
            Community Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Loved by Readers Everywhere
          </h2>
          <p className="text-sm text-muted-foreground">
            Hear what our passionate members say about their borrowing experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-foreground">
                    {rev.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{rev.role}</p>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
