"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";

type Riddle = {
  riddle: string;
  answer: string;
};

export function RiddleUnlimited() {
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRiddle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/riddle");
      if (!response.ok) throw new Error("Failed to fetch riddle");

      const data = await response.json();
      setRiddle({ riddle: data.riddle, answer: data.answer });
      setFeedback(null);
      setShowAnswer(false);
      setUserAnswer("");
    } catch (err) {
      console.error(err);
      setError("Failed to load riddle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiddle();
  }, []);

  const checkAnswer = () => {
    if (!riddle) return;

    const correct = riddle.answer.toLowerCase().trim();
    const userAnswerNormalized = userAnswer.toLowerCase().trim();

    if (
      userAnswerNormalized === correct ||
      correct.includes(userAnswerNormalized)
    ) {
      setFeedback("✅ Correct! Well done!");
      setShowAnswer(true);
    } else {
      setFeedback("❌ Not quite right. Try again!");
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={fetchRiddle}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 border px-4 py-2 rounded-full shadow-sm">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {riddle && (
          <div className="rounded-2xl shadow-xl px-8 space-y-6">
            <div className="rounded-xl border bg-background backdrop-blur-3xl p-6">
              <p className="text-xl leading-relaxed">{riddle.riddle}</p>
            </div>

            {!showAnswer ? (
              <div className="space-y-4">
                <Input
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") checkAnswer();
                  }}
                  className="text-lg p-6"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={checkAnswer}
                    className="flex-1 text-lg py-6"
                    disabled={!userAnswer.trim()}
                  >
                    Submit Answer
                  </Button>
                  <Button
                    onClick={revealAnswer}
                    variant="outline"
                    className="text-lg py-6"
                  >
                    Reveal Answer
                  </Button>
                </div>

                {feedback && (
                  <div
                    className={`p-4 rounded-lg text-center font-semibold ${
                      feedback.startsWith("✅")
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    Answer:
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {riddle.answer}
                  </p>
                </div>

                {feedback && (
                  <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold">
                    {feedback}
                  </div>
                )}

                <Button
                  onClick={fetchRiddle}
                  className="w-full text-lg py-6 mt-2 bg-purple-600 hover:bg-purple-700"
                >
                  Next Riddle
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
