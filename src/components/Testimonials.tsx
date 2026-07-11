"use client";

import { useState, useEffect, useCallback } from "react";

const REVIEWS = [
  { quote: "Yordana was absolutely wonderful, truly one of the most honest real estate agents you could hope to work with. From the very beginning, she was transparent and truthful with us. She helped set realistic expectations and pointed out important details that are easy to overlook when you're excited and emotionally attached to a property.", name: "Brenda" },
  { quote: "Yordana is amazing! Thank you Yordana!", name: "Meiling Matthews" },
  { quote: "Yordana is one of the most hardworking, genuine, and trustworthy people I know. She's professional, responsive, and truly cares about helping others. If you're looking for someone who will put in the effort and treat you with honesty and respect, I highly recommend reaching out to her. Wishing you continued success in your real estate business!", name: "Amy W. Borkey" },
  { quote: "Very helpful and informative", name: "Douglas Bitterman" },
  { quote: "She went out of her way to open up the house for us to view and was consistently available whenever I had questions or needed support. I genuinely appreciated her professionalism, attentiveness, and care throughout the entire experience. I would absolutely work with Yordana again and highly recommend her to anyone looking to buy in the area.", name: "Dana Winter" },
  { quote: "Yordana has been a light to my family. She has gone above and beyond to help us find our forever home. As first time home buyers, she has truly been so helpful and patient with giving knowledge and guiding us through the process. Mahalo, Yordana!", name: "Elisa Cervantes" },
  { quote: "Very friendly and knowledgeable about the area", name: "Zenzele Nuru" },
  { quote: "I had a wonderful experience working with Yordana. She truly cares about her clients and takes the time to understand what you're looking for. She was always patient, responsive, and incredibly knowledgeable about the local communities and the unique aspects of buying and selling property in Hawaii.", name: "Miguel" },
  { quote: "Highly Recommend!", name: "Josiah Oo" },
  { quote: "5 Stars — Yordana is incredibly professional, thorough, and kept me informed every single step of the way with excellent communication. She made the entire process seamless and stress-free. Highly recommended to anyone looking to buy or sell!", name: "Kiko White" },
];

// Reading time: ~200 words/min, minimum 4s, maximum 12s
function readingMs(quote: string): number {
  const words = quote.trim().split(/\s+/).length;
  return Math.min(12000, Math.max(4000, Math.round((words / 200) * 60000)));
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % REVIEWS.length), []);

  useEffect(() => {
    const ms = readingMs(REVIEWS[current].quote);
    const id = setTimeout(next, ms);
    return () => clearTimeout(id);
  }, [current, next]);

  const review = REVIEWS[current];

  return (
    <div className="bg-coral text-paper py-16 lg:py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center min-h-[180px] flex flex-col items-center justify-center">
        <p className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-wide leading-snug">
          &ldquo;{review.quote}&rdquo;
        </p>
        <p className="mt-6 eyebrow text-paper/80 tracking-widest">{review.name}</p>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-paper" : "bg-paper/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
