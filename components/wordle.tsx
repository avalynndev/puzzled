"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WORDS = ["APPLE", "BRAVE", "CRANE", "DREAM", "FRAME"];
const MAX_TRIES = 6;
const WORD_LENGTH = 5;

const KEYBOARD = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type Cell = { letter: string; status?: "correct" | "present" | "absent" };

const validateWord = async (word: string) => {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );
    return res.ok;
  } catch {
    return false;
  }
};

export function Wordle() {
  const [solution] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<Cell[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<Cell[]>(
    Array.from({ length: WORD_LENGTH }, () => ({
      letter: "",
      status: undefined,
    }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const totalDelay = MAX_TRIES * 100 + WORD_LENGTH * 500;
    const timer = setTimeout(() => {
      setHasInitialized(true);
    }, totalDelay);
    return () => clearTimeout(timer);
  }, []);

  const handleInput = async (key: string) => {
    if (isComplete || revealingRow !== null) return;

    if (key === "Enter") {
      const guessWord = currentGuess.map((c) => c.letter).join("");
      if (guessWord.length !== WORD_LENGTH) {
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 500);
        return;
      }

      const isValid = await validateWord(guessWord);
      if (!isValid) {
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 500);
        return;
      }

      const currentRowIndex = guesses.length;

      const newGuess: Cell[] = currentGuess.map((c, idx) => {
        if (c.letter === solution[idx]) return { ...c, status: "correct" };
        if (solution.includes(c.letter)) return { ...c, status: "present" };
        return { ...c, status: "absent" };
      });

      setGuesses((prev) => [...prev, newGuess]);

      setRevealingRow(currentRowIndex);

      newGuess.forEach((_, idx) => {
        setTimeout(() => {
          setRevealedCells((prev) =>
            new Set(prev).add(`${currentRowIndex}-${idx}`)
          );
        }, idx * 200);
      });

      setTimeout(() => {
        setRevealingRow(null);
      }, WORD_LENGTH * 570);

      setCurrentGuess(
        Array.from({ length: WORD_LENGTH }, () => ({
          letter: "",
          status: undefined,
        }))
      );

      if (guessWord === solution) {
        setIsComplete(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setShowModal(true), WORD_LENGTH * 600 + 500);
      } else if (guesses.length + 1 >= MAX_TRIES) {
        setIsComplete(true);
        setTimeout(() => setShowModal(true), WORD_LENGTH * 600 + 500);
      }
    } else if (key === "Backspace") {
      const idx = currentGuess.findLastIndex((c) => c.letter !== "");
      if (idx !== -1) {
        const newGuess = [...currentGuess];
        newGuess[idx].letter = "";
        setCurrentGuess(newGuess);
      }
    } else if (key === "Delete") {
      setCurrentGuess(
        Array.from({ length: WORD_LENGTH }, () => ({ letter: "" }))
      );
    } else if (/^[a-zA-Z]$/.test(key)) {
      const idx = currentGuess.findIndex((c) => c.letter === "");
      if (idx !== -1) {
        const newGuess = [...currentGuess];
        newGuess[idx].letter = key.toUpperCase();
        setCurrentGuess(newGuess);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleInput(e.key);
  };

  const displayGuesses = Array.from(
    { length: MAX_TRIES },
    (_, i) =>
      guesses[i] ||
      (i === guesses.length
        ? currentGuess
        : Array.from({ length: WORD_LENGTH }, () => ({
            letter: "",
            status: undefined,
          })))
  );

  const getCellStyle = (cell: Cell, isRevealed: boolean) => {
    if (!isRevealed || !cell.status) {
      return "bg-white text-black border-gray-300";
    }

    switch (cell.status) {
      case "correct":
        return "bg-green-600 text-white border-green-600";
      case "present":
        return "bg-yellow-500 text-white border-yellow-500";
      case "absent":
        return "bg-neutral-700 text-white border-neutral-700";
      default:
        return "bg-white text-black border-gray-300";
    }
  };

  const flipTile = (rowIdx: number, idx: number, cell: Cell) => {
    const isRevealingThisRow = rowIdx === revealingRow;
    const cellKey = `${rowIdx}-${idx}`;
    const isRevealed = revealedCells.has(cellKey);

    const [delayedStyle, setDelayedStyle] = useState<string | null>(null);

    useEffect(() => {
      let timeout: NodeJS.Timeout;
      if (isRevealed) {
        timeout = setTimeout(() => {
          setDelayedStyle(getCellStyle(cell, true));
        }, idx * 300);
      } else {
        setDelayedStyle(null);
      }
      return () => clearTimeout(timeout);
    }, [isRevealed, cell, idx]);

    const shouldShowRevealFlip = isRevealingThisRow && isRevealed;
    const isFullWordCorrect =
      rowIdx === guesses.length - 1 &&
      guesses[rowIdx]?.map((c) => c.letter).join("") === solution;

    const animationKey = `${rowIdx}-${idx}-${isRevealed}`;

    return (
      <motion.div
        key={animationKey}
        className="relative flex h-14 w-14 items-center justify-center border text-xl font-bold uppercase rounded"
        initial={{ rotateX: 0 }}
        animate={
          isFullWordCorrect
            ? { y: [0, -15, 0] }
            : shouldShowRevealFlip
            ? { rotateX: 180 }
            : {}
        }
        transition={{
          duration: 0.6,
          delay: shouldShowRevealFlip ? idx * 0.2 : 0,
        }}
        style={{ transformStyle: "preserve-3d", perspective: 800 }}
      >
        <div
          className={`absolute flex h-full w-full items-center justify-center border rounded ${
            isRevealed
              ? delayedStyle || "bg-white text-black border-gray-300"
              : "bg-white text-black border-gray-300"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {cell.letter}
        </div>
        <div
          className={`absolute flex h-full w-full items-center justify-center border rounded ${
            isRevealed
              ? getCellStyle(cell, true)
              : "bg-white text-black border-gray-300"
          }`}
          style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
        >
          {cell.letter}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-1">
        {displayGuesses.map((row, rowIdx) => {
          const isCurrentRow = rowIdx === guesses.length;
          const shouldShake = isCurrentRow && shakeRow;

          return (
            <motion.div
              key={rowIdx}
              className="flex gap-1"
              animate={shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {row.map((cell, idx) => flipTile(rowIdx, idx, cell))}
            </motion.div>
          );
        })}
      </div>

      <input
        type="text"
        className="w-0 h-0 opacity-0"
        autoFocus
        onKeyDown={handleKeyDown}
      />

      <div className="flex flex-col gap-2 mt-4">
        {KEYBOARD.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map((key) => (
              <Button
                key={key}
                size="sm"
                variant="outline"
                className="w-10 h-12 text-sm font-bold"
                onClick={() => handleInput(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1 mt-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleInput("Enter")}
          >
            Enter
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleInput("Delete")}
          >
            Del
          </Button>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-center">
            {guesses.some(
              (g) => g.map((c) => c.letter).join("") === solution
            ) ? (
              <p>You guessed the word in {guesses.length} tries! 🎉</p>
            ) : (
              <p>The word was {solution}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 OLD
  const flipTile = (rowIdx: number, idx: number, cell: Cell) => {
    const isRevealingThisRow = rowIdx === revealingRow;
    const cellKey = `${rowIdx}-${idx}`;
    const isRevealed = revealedCells.has(cellKey);

    const [delayedStyle, setDelayedStyle] = useState<string | null>(null);

    useEffect(() => {
      let timeout: NodeJS.Timeout;
      if (isRevealed) {
        timeout = setTimeout(() => {
          setDelayedStyle(getCellStyle(cell, true));
        }, idx * 300);
      } else {
        setDelayedStyle(null);
      }
      return () => clearTimeout(timeout);
    }, [isRevealed, cell, idx]);

    const shouldShowInitialFlip = !hasInitialized;
    const shouldShowRevealFlip = isRevealingThisRow && isRevealed;

    const animationKey = shouldShowRevealFlip
      ? `reveal-${rowIdx}-${idx}-${isRevealed}`
      : `${rowIdx}-${idx}`;

    return (
      <motion.div
        key={animationKey}
        className="relative flex h-14 w-14 items-center justify-center border text-xl font-bold uppercase rounded"
        initial={
          shouldShowInitialFlip || shouldShowRevealFlip ? { rotateX: 0 } : false
        }
        animate={
          shouldShowInitialFlip || shouldShowRevealFlip ? { rotateX: 180 } : {}
        }
        transition={{
          duration: 0.6,
          delay: shouldShowInitialFlip ? rowIdx * 0.1 + idx * 0.2 : 0,
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: 800,
        }}
      >
        <div
          className={`absolute flex h-full w-full items-center justify-center borde rounded ${
            isRevealed
              ? delayedStyle || "bg-white text-black border-gray-300"
              : "bg-white text-black border-gray-300"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {cell.letter}
        </div>
        <div
          className={`absolute flex h-full w-full items-center justify-center border rounded ${
            isRevealed
              ? getCellStyle(cell, true)
              : "bg-white text-black border-gray-300"
          }`}
          style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
        >
          {cell.letter}
        </div>
      </motion.div>
    );
  };
 */
