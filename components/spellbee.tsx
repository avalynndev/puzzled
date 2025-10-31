"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";

const LEVELS = [
  { title: "Beginner", score: 0 },
  { title: "Good Start", score: 3 },
  { title: "Moving Up", score: 9 },
  { title: "Good", score: 14 },
  { title: "Solid", score: 26 },
  { title: "Nice", score: 43 },
  { title: "Great", score: 68 },
  { title: "Amazing", score: 86 },
  { title: "Genius", score: 120 },
];

const surroundingPositions = [
  { x: 0, y: -82 },
  { x: 72, y: -41 },
  { x: 72, y: 41 },
  { x: 0, y: 82 },
  { x: -72, y: 41 },
  { x: -72, y: -41 },
];

function getRandomLetters(count: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const result: string[] = [];
  while (result.length < count) {
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!result.includes(letter)) result.push(letter);
  }
  return result;
}

function getPoints(word: string) {
  const len = word.length;
  if (len === 4) return 2;
  if (len === 5) return 4;
  if (len === 6) return 6;
  if (len === 7) return 8;
  if (len >= 8) return 12;
  return 0;
}

const Hexagon = ({
  letter,
  onClick,
  center = false,
}: {
  letter: string;
  onClick: () => void;
  center?: boolean;
}) => (
  <motion.svg
    onClick={onClick}
    className="cursor-pointer max-w-[96px] h-[83px]"
    viewBox="0 0 120 103.92304845413263"
    whileTap={{ scale: 0.95 }}
  >
    <polygon
      className={center ? "fill-yellow-400" : "fill-neutral-700"}
      points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
      stroke="white"
      strokeWidth="7.5"
    />
    <text
      fill="white"
      fontWeight="bold"
      fontSize="24"
      x="50%"
      y="50%"
      dy="0.35em"
      textAnchor="middle"
    >
      {letter}
    </text>
  </motion.svg>
);

export default function SpellBee() {
  const [letters, setLetters] = useState<string[]>([]);
  const [centerLetter, setCenterLetter] = useState<string>("R");
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem("dailyLetters");
    const savedData = saved ? JSON.parse(saved) : null;

    if (!savedData || savedData.date !== today) {
      const newLetters = getRandomLetters(6);
      const newCenter = getRandomLetters(1)[0];
      const data = { letters: newLetters, center: newCenter, date: today };
      localStorage.setItem("dailyLetters", JSON.stringify(data));
      setLetters(newLetters);
      setCenterLetter(newCenter);
    } else {
      setLetters(savedData.letters);
      setCenterLetter(savedData.center);
    }
  }, []);

  const ALL_LETTERS = [...letters, centerLetter];

  const handleHexClick = (letter: string) => {
    setCurrentWord((prev) => prev + letter.toUpperCase());
  };

  const handleChange = (value: string) => {
    const filtered = value
      .toUpperCase()
      .split("")
      .filter((l) => ALL_LETTERS.includes(l))
      .join("");
    setCurrentWord(filtered);
  };

  const validateWord = async (word: string) => {
    if (!word.includes(centerLetter)) return false;
    if (word.length < 4) return false;
    if (foundWords.includes(word.toUpperCase())) return false;

    const isValidLetters = word
      .toUpperCase()
      .split("")
      .every((l) => ALL_LETTERS.includes(l));
    if (!isValidLetters) return false;

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      );
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    const word = currentWord.toUpperCase();
    const valid = await validateWord(word);
    if (!valid) {
      return;
    }

    setFoundWords([...foundWords, word]);
    setScore(score + getPoints(word));
    setCurrentWord("");
  };

  const handleReload = () => {
    // shuffle visible order but keep same daily letters
    setLetters((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const currentLevel = LEVELS.slice()
    .reverse()
    .find((l) => score >= l.score)?.title;

  return (
    <div className="flex flex-row justify-center items-start gap-8 mt-6 px-4">
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-center mb-2">
          <input
            type="text"
            className="border-b-2 border-gray-400 focus:border-primary outline-none text-lg font-sans uppercase px-2 py-1 w-48 text-center"
            value={currentWord}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>

        <div className="relative w-[300px] h-[300px] mb-2">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Hexagon
              letter={centerLetter}
              center
              onClick={() => handleHexClick(centerLetter)}
            />
          </div>

          {letters.map((letter, idx) => {
            const pos = surroundingPositions[idx];
            return (
              <div
                key={idx}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
              >
                <Hexagon
                  letter={letter}
                  onClick={() => handleHexClick(letter)}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="default" onClick={handleSubmit}>
            Submit
          </Button>
          <Button size="sm" variant="secondary" onClick={handleReload}>
            Reload
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-0.5 mb-2">
          {LEVELS.map((level, idx) => {
            const reached = score >= level.score;
            return (
              <div key={idx} className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    reached
                      ? "bg-primary border-primary"
                      : "bg-white border-neutral-700"
                  }`}
                />
                {idx < LEVELS.length - 1 && (
                  <div
                    className={`h-1 w-8 ${
                      reached ? "bg-primary" : "bg-neutral-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <h3 className="font-semibold mb-2 text-lg">
          Level: {currentLevel} ({score})
        </h3>

        <div className="min-w-[320px] min-h-[400px] border p-4 rounded">
          <p className="font-semibold">
            You have found {foundWords.length} words
          </p>
          <div className="flex flex-wrap gap-1 mt-2 max-w-[300px] overflow-y-auto">
            {foundWords.map((w, idx) => (
              <Badge key={idx}>{w}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
