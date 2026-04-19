import type { Metadata } from "next";
import { getQuizQuestions } from "@/lib/queries";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Find Your Perfect Spot — Quiz",
  description:
    "Answer 5 quick questions and we'll match you with the best bars, restaurants, and cafes in Manila.",
};

export default async function QuizPage() {
  const questions = await getQuizQuestions();

  return <QuizClient questions={questions} />;
}
