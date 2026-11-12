import React from "react";

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
                      <svg
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <svg
                    className="w-6 h-6 text-muted-foreground/30 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
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
