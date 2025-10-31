"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RainbowButton } from "./ui/rainbow-button";
import { ReloadIcon } from "@radix-ui/react-icons";

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
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
    );
    return res.ok;
  } catch {
    return false;
  }
};

function TileCell({
  rowIdx,
  idx,
  cell,
  isRevealingThisRow,
  isRevealed,
  isFullWordCorrect,
  getCellStyle,
}: {
  rowIdx: number;
  idx: number;
  cell: Cell;
  isRevealingThisRow: boolean;
  isRevealed: boolean;
  isFullWordCorrect: boolean;
  getCellStyle: (cell: Cell, isRevealed: boolean) => string;
}) {
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
  }, [isRevealed, cell, idx, getCellStyle]);

  const shouldShowRevealFlip = isRevealingThisRow && isRevealed;
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
}

export function Wordle() {
  const [solution, setSolution] = useState<string>("");
  const [guesses, setGuesses] = useState<Cell[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<Cell[]>(
    Array.from({ length: WORD_LENGTH }, () => ({
      letter: "",
      status: undefined,
    })),
  );
  const [isComplete, setIsComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState<
    Record<string, "correct" | "present" | "absent">
  >({});
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFocusBack = () => {
    inputRef.current?.focus();
  };

  const fetchDailyWord = async () => {
    try {
      const res = await fetch("/api/daily-word");
      const data = await res.json();
      setSolution(data.word);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching daily word:", error);
      setLoading(false);
    }
  };

  const loadGameState = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("wordle_date");

    if (savedDate === today) {
      const savedGuesses = localStorage.getItem("wordle_guesses");
      const savedComplete = localStorage.getItem("wordle_complete");
      const savedWon = localStorage.getItem("wordle_won");
      const savedKeyboard = localStorage.getItem("wordle_keyboard");

      if (savedGuesses) {
        const parsedGuesses = JSON.parse(savedGuesses);
        setGuesses(parsedGuesses);
        const allRevealed = new Set<string>();
        parsedGuesses.forEach((_: any, rowIdx: number) => {
          for (let i = 0; i < WORD_LENGTH; i++) {
            allRevealed.add(`${rowIdx}-${i}`);
          }
        });
        setRevealedCells(allRevealed);
      }
      if (savedComplete === "true") {
        setIsComplete(true);
      }
      if (savedWon === "true") {
        setHasWon(true);
      }
      if (savedKeyboard) {
        setKeyboardStatus(JSON.parse(savedKeyboard));
      }
    } else {
      localStorage.removeItem("wordle_guesses");
      localStorage.removeItem("wordle_complete");
      localStorage.removeItem("wordle_won");
      localStorage.removeItem("wordle_keyboard");
      localStorage.setItem("wordle_date", today);
    }
  };

  useEffect(() => {
    fetchDailyWord();
    loadGameState();
  }, []);

  const saveGameState = (
    newGuesses: Cell[][],
    complete: boolean,
    won: boolean,
    keyboard: Record<string, "correct" | "present" | "absent">,
  ) => {
    const today = new Date().toDateString();
    localStorage.setItem("wordle_date", today);
    localStorage.setItem("wordle_guesses", JSON.stringify(newGuesses));
    localStorage.setItem("wordle_complete", complete.toString());
    localStorage.setItem("wordle_won", won.toString());
    localStorage.setItem("wordle_keyboard", JSON.stringify(keyboard));
  };

  const handleInput = async (key: string) => {
    if (isComplete || revealingRow !== null || !solution) return;

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

      const solutionLetterCount: Record<string, number> = {};
      solution.split("").forEach((letter) => {
        solutionLetterCount[letter] = (solutionLetterCount[letter] || 0) + 1;
      });

      const newGuess: Cell[] = currentGuess.map((c) => ({
        ...c,
        status: "absent" as const,
      }));
      const guessLetters = currentGuess.map((c) => c.letter);

      guessLetters.forEach((letter, idx) => {
        if (letter === solution[idx]) {
          newGuess[idx].status = "correct";
          solutionLetterCount[letter]--;
        }
      });

      guessLetters.forEach((letter, idx) => {
        if (newGuess[idx].status === "correct") return;
        if (solutionLetterCount[letter] > 0) {
          newGuess[idx].status = "present";
          solutionLetterCount[letter]--;
        }
      });

      const updatedGuesses = [...guesses, newGuess];
      setGuesses(updatedGuesses);

      const newKeyboardStatus = { ...keyboardStatus };
      newGuess.forEach((cell) => {
        const letter = cell.letter;
        const currentStatus = newKeyboardStatus[letter];

        if (cell.status === "correct") {
          newKeyboardStatus[letter] = "correct";
        } else if (cell.status === "present" && currentStatus !== "correct") {
          newKeyboardStatus[letter] = "present";
        } else if (!currentStatus) {
          newKeyboardStatus[letter] = cell.status!;
        }
      });
      setKeyboardStatus(newKeyboardStatus);

      setRevealingRow(currentRowIndex);

      newGuess.forEach((_, idx) => {
        setTimeout(() => {
          setRevealedCells((prev) =>
            new Set(prev).add(`${currentRowIndex}-${idx}`),
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
        })),
      );

      const won = guessWord === solution;
      const gameComplete = won || updatedGuesses.length >= MAX_TRIES;

      if (won) {
        setIsComplete(true);
        setHasWon(true);
        saveGameState(updatedGuesses, true, true, newKeyboardStatus);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setShowModal(true), WORD_LENGTH * 600 + 500);
      } else if (gameComplete) {
        setIsComplete(true);
        saveGameState(updatedGuesses, true, false, newKeyboardStatus);
        setTimeout(() => setShowModal(true), WORD_LENGTH * 600 + 500);
      } else {
        saveGameState(updatedGuesses, false, false, newKeyboardStatus);
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
        Array.from({ length: WORD_LENGTH }, () => ({ letter: "" })),
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
          }))),
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

  const getKeyStyle = (key: string) => {
    const status = keyboardStatus[key];
    if (!status) return "bg-gray-200 text-black hover:bg-gray-300";

    switch (status) {
      case "correct":
        return "bg-green-600 text-white hover:bg-green-700";
      case "present":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "absent":
        return "bg-neutral-700 text-white hover:bg-neutral-800";
      default:
        return "bg-gray-200 text-black hover:bg-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ReloadIcon className="h-12 w-12 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col gap-1" onClick={handleFocusBack}>
        {displayGuesses.map((row, rowIdx) => {
          const isCurrentRow = rowIdx === guesses.length;
          const shouldShake = isCurrentRow && shakeRow;
          const isRevealingThisRow = rowIdx === revealingRow;
          const isFullWordCorrect =
            rowIdx === guesses.length - 1 &&
            guesses[rowIdx]?.map((c) => c.letter).join("") === solution;

          return (
            <motion.div
              key={rowIdx}
              className="flex gap-1"
              animate={shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {row.map((cell, idx) => {
                const cellKey = `${rowIdx}-${idx}`;
                const isRevealed = revealedCells.has(cellKey);

                return (
                  <TileCell
                    key={cellKey}
                    rowIdx={rowIdx}
                    idx={idx}
                    cell={cell}
                    isRevealingThisRow={isRevealingThisRow}
                    isRevealed={isRevealed}
                    isFullWordCorrect={isFullWordCorrect}
                    getCellStyle={getCellStyle}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {!isComplete && (
        <>
          <input
            ref={inputRef}
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
                    className={`w-10 h-12 text-sm font-bold border-none ${getKeyStyle(
                      key,
                    )}`}
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
        </>
      )}

      {isComplete && hasWon && (
        <>
          <RainbowButton
            className="mt-4 font-bold"
            onClick={() => (window.location.href = "/unlimited-wordle")}
          >
            Play Unlimited Wordle →
          </RainbowButton>{" "}
          <p>You guessed the word in {guesses.length} tries! 🎉</p>
        </>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-center">
            {hasWon ? (
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
