"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Riddle = {
  question: string;
  answer: string;
};

const riddles: Riddle[] = [
  {
    question: "I speak without a mouth and hear without ears. What am I?",
    answer: "echo",
  },
  { question: "What has keys but can't open locks?", answer: "piano" },
  {
    question:
      "The more of this you take, the more you leave behind. What is it?",
    answer: "footsteps",
  },
  {
    question: "What can travel around the world while staying in a corner?",
    answer: "stamp",
  },
];

export default function RiddlesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkAnswer = () => {
    const correct = riddles[currentIndex].answer.toLowerCase().trim();
    if (userAnswer.toLowerCase().trim() === correct) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! The correct answer is: ${correct}`);
    }
  };

  const nextRiddle = () => {
    setCurrentIndex((prev) => (prev + 1) % riddles.length);
    setUserAnswer("");
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Riddles</h1>

      <div className="p-4 border rounded-md w-full max-w-lg">
        <p className="text-lg">{riddles[currentIndex].question}</p>
      </div>

      <Input
        placeholder="Type your answer here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="max-w-lg"
      />

      <div className="flex space-x-2">
        <Button onClick={checkAnswer}>Submit</Button>
        <Button variant="secondary" onClick={nextRiddle}>
          Next Riddle
        </Button>
      </div>

      {feedback && <p className="text-lg font-semibold">{feedback}</p>}
    </div>
  );
}
