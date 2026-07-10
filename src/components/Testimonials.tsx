"use client";

import { useState, useEffect, useCallback } from "react";

// Reviews in order 1–10 matching the image filenames she provided
const REVIEWS = [
  {
    quote: "Yordana was absolutely wonderful, truly one of the most honest real estate agents you could hope to work with. From the very beginning, she was transparent and truthful with us. She helped set realistic expectations and pointed out important details that are easy to overlook when you're excited and emotionally attached to a property.",
    name: "Brenda",
  },
  {
    quote: "Yordana is amazing! Thank you Yordana!",
    name: "Meiling Matthews",
  },
  {
    quote: "Yordana is one of the most hardworking, genuine, and trustworthy people I know. She's professional, responsive, and truly cares about helping others. If you're looking for someone who will put in the effort and treat you with honesty and respect, I highly recommend reaching out to her. Wishing you continued success in your real estate business!",
    name: "Amy W. Borkey",
  },
  {
    quote: "Very helpful and informative",
    name: "Douglas Bitterman",
  },
  {
    quote: "She went out of her way to open up the house for us to view and was consistently available whenever I had questions or needed support. I genuinely appreciated her professionalism, attentiveness, and care throughout the entire experience. I would absolutely work with Yordana again and highly recommend her to anyone looking to buy in the area.",
    name: "Dana Winter",
  },
  {
    quote: "Yordana has been a light to my family. She has gone above and beyond to help us find our forever home. As first time home buyers, she has truly been so helpful and patient with giving knowledge and guiding us through the process. Mahalo, Yordana!",
    name: "Elisa Cervantes",
  },
  {
    quote: "Very friendly and knowledgeable about the area",
    name: "Zenzele Nuru",
  },
  {
    quote: "I had a wonderful experience working with Yordana. She truly cares about her clients and takes the time to understand what you're looking for. She was always patient, responsive, and incredibly knowledgeable about the local communities and the unique aspects of buying and selling property in Hawaii.",
    name: "Miguel",
  },
  {
    quote: "Highly Recommend!",
    name: "Josiah Oo",
  },
  {
    quote: "5 Stars — Yordana is incredibly professional, thorough, and kept me informed every single step of the way with excellent communication. She made the entire process seamless and stress-free. Highly recommended to anyone looking to buy or sell!",
    name: "Kiko White",
  },
];

const INTERVAL = 5000; // 5 seconds per review

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % REVIEWS.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + REVIEWS.length) % REVIEWS.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const review = REVIEWS[current];

  return (
    <section
      className="bg-coral text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20 lg:py-28">
        {/* Review — instant cut, no transition */}
        <div className="text-center min-h-[200px] flex flex-col items-center justify-center">
          <p className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-wide leading-snug max-w-3xl">
            &ldquo;{review.quote}&rdquo;
          </p>
          <p className="mt-8 eyebrow text-paper/80 tracking-widest">
            {review.name}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="w-10 h-10 flex items-center justify-center border border-paper/40 rounded-full hover:bg-paper/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-paper" : "bg-paper/30"}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next review"
            className="w-10 h-10 flex items-center justify-center border border-paper/40 rounded-full hover:bg-paper/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
