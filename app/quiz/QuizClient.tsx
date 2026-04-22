"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import type { QuizQuestion, VenueWithTags } from "@/lib/types";
import BestScoreBadge from "@/components/BestScoreBadge";
import { getPriceSymbol, getCategorySingular } from "@/lib/utils";

interface QuizClientProps {
  questions: QuizQuestion[];
}

type QuizResult = VenueWithTags & { match_count: number };

export default function QuizClient({ questions }: QuizClientProps) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const isComplete = step >= questions.length;

  function handleSelect(questionId: string, tagId: string) {
    setSelections((prev) => ({ ...prev, [questionId]: tagId }));
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      submitQuiz({ ...selections, [questionId]: tagId });
    }
  }

  async function submitQuiz(finalSelections: Record<string, string>) {
    setLoading(true);
    setStep(questions.length);
    const tagIds = Object.values(finalSelections);
    try {
      const res = await fetch("/api/quiz/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagIds }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function resetQuiz() {
    setStep(0);
    setSelections({});
    setResults(null);
  }

  if (isComplete) {
    return (
      <div className="min-h-[80vh] max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-h3 sm:text-h2 font-display font-semibold text-ink text-center">
          {loading ? "Finding your matches..." : "Your Top Picks"}
        </h1>

        {loading && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-stone rounded-lg aspect-[4/3] animate-pulse"
              />
            ))}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.map((venue, i) => {
              const matchPct = Math.round(
                (venue.match_count / questions.length) * 100
              );
              return (
                <Link
                  key={venue.id}
                  href={`/venue/${venue.slug}`}
                  className="group flex bg-paper rounded-xl overflow-hidden hover: transition-all duration-200"
                >
                  <div className="relative w-28 sm:w-40 flex-shrink-0 bg-paper">
                    {venue.featured_photo_url ? (
                      <Image
                        src={venue.featured_photo_url}
                        alt={venue.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-deep">
                        <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <BestScoreBadge score={venue.final_score} />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-micro text-stone-deep font-semibold">
                          #{i + 1} match
                        </div>
                        <h3 className="font-semibold text-ink group-hover:text-rust transition-colors">
                          {venue.name}
                        </h3>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-rust/20 text-rust text-micro font-bold">
                        {matchPct}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-body-sm text-stone-deep">
                      <span>{getCategorySingular(venue.category)}</span>
                      {venue.price_level && (
                        <>
                          <span className="text-border">·</span>
                          <span>{getPriceSymbol(venue.price_level)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {results && results.length === 0 && !loading && (
          <p className="mt-8 text-center text-stone-deep">
            No matches found. Try different answers!
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 rounded-lg border-2 border-rust text-rust font-semibold hover:bg-rust/20 transition-all duration-200"
          >
            Retake Quiz
          </button>
          <Link
            href="/manila"
            className="px-6 py-3 rounded-lg bg-rust text-white font-semibold hover:bg-ember transition-all duration-200"
          >
            Browse All
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[step];

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Progress */}
      <div className="max-w-md mx-auto w-full px-4 pt-8">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-rust" : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="text-micro text-stone-deep mt-2">
          {step + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-lg mx-auto w-full">
        <h2 className="text-verdict sm:text-h3 font-display font-semibold text-ink text-center">
          {question.question_text}
        </h2>
        {question.subtitle && (
          <p className="mt-2 text-body-sm text-stone-deep text-center">{question.subtitle}</p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-8 w-full">
          {question.quiz_options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(question.id, option.tag_id)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200  ${
                selections[question.id] === option.tag_id
                  ? "border-rust bg-rust/20"
                  : "border-border hover:border-secondary/30 bg-paper"
              }`}
            >
              <span className="block font-semibold text-body-sm text-ink">
                {option.label}
              </span>
              {option.description && (
                <span className="block text-micro text-stone-deep mt-0.5">
                  {option.description}
                </span>
              )}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-body-sm text-stone-deep hover:text-ink transition-colors"
          >
            &larr; Back
          </button>
        )}
      </div>
    </div>
  );
}
