"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { groupData } from "@/data/connections";

type Card = {
  text: string;
  group: number;
  id: number;
};

const getTodayKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
};

const getTodayGroups = () => {
  const today = new Date();
  const seed =
    today.getFullYear() * 1000 + today.getMonth() * 40 + today.getDate();
  const shuffled = shuffleArray([...groupData], seed);
  return shuffled.slice(0, 4);
};

const initialGroups = getTodayGroups();
const initialCards: Card[] = initialGroups.flatMap((g) =>
  g.cards.map((text, i) => ({ text, group: g.id, id: g.id * 10 + i })),
);

export default function ConnectionsGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [foundGroups, setFoundGroups] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [revealedGroups, setRevealedGroups] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);

  const todayKey = getTodayKey();

  useEffect(() => {
    const completed = localStorage.getItem("connections_completed");
    if (completed === todayKey) {
      setCompletedToday(true);
      setGameOver(true);
    } else {
      setCards(shuffleArray(initialCards));
    }
  }, []);

  const toggleSelect = (id: number) => {
    if (gameOver) return;
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  };

  const submitGroup = () => {
    if (gameOver) return;
    if (selected.length !== 4) return;

    const groupIds = selected.map(
      (id) => cards.find((c) => c.id === id)?.group,
    );

    if (groupIds.every((g) => g === groupIds[0] && !foundGroups.includes(g!))) {
      const newFound = [...foundGroups, groupIds[0]!];
      setFoundGroups(newFound);
      setFeedback("correct");

      setTimeout(() => setFeedback(null), 800);

      if (newFound.length === 4) {
        setGameOver(true);
        localStorage.setItem("connections_completed", todayKey);
      }
    } else {
      setFeedback("wrong");
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      setTimeout(() => {
        setFeedback(null);
        setSelected([]);
      }, 800);

      if (newMistakes >= 4) {
        const remainingGroups = initialGroups
          .map((g) => g.id)
          .filter((g) => !foundGroups.includes(g));
        setRevealedGroups(remainingGroups);
        setGameOver(true);
        localStorage.setItem("connections_completed", todayKey);
      }
      return;
    }

    setSelected([]);
  };

  return (
    <motion.div
      className="flex flex-col items-center p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Connections Game
      </motion.h2>

      {completedToday && (
        <p className="text-yellow-500 font-medium">
          You&apos;ve already played today! Come back tomorrow.
        </p>
      )}

      {!gameOver && !completedToday && (
        <p className="text-sm text-gray-400">Mistakes left: {4 - mistakes}</p>
      )}

      {!gameOver && !completedToday ? (
        <>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {cards.map((card) => {
              const isSelected = selected.includes(card.id);
              const isFound = foundGroups.includes(card.group);
              const isRevealed = revealedGroups.includes(card.group);
              const groupColor = initialGroups.find(
                (g) => g.id === card.group,
              )?.color;

              if (isRevealed) return null;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    feedback === "wrong" && isSelected
                      ? { x: [-10, 10, -10, 10, 0], opacity: 1, scale: 1 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={
                    feedback === "wrong" && isSelected
                      ? { duration: 0.5, ease: "easeInOut" }
                      : { duration: 0.3 }
                  }
                >
                  <Button
                    key={card.id}
                    variant={isSelected ? "default" : "outline"}
                    disabled={isFound || mistakes >= 4}
                    onClick={() => toggleSelect(card.id)}
                    className={`w-32 h-16 text-center font-semibold ${
                      isFound ? `${groupColor} text-white` : ""
                    }`}
                  >
                    {" "}
                    {card.text}{" "}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          <Button
            onClick={submitGroup}
            disabled={mistakes >= 4}
            className="mt-4 px-8 py-2"
          >
            Submit
          </Button>
        </>
      ) : (
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {foundGroups.length === 4 && (
            <h3 className="text-green-500 text-xl font-bold">
              🎉 You solved all groups with {mistakes} mistake
              {mistakes !== 1 ? "s" : ""}!
            </h3>
          )}

          {foundGroups.map((groupId) => {
            const group = initialGroups.find((g) => g.id === groupId)!;
            return (
              <motion.div
                key={groupId}
                className="w-full p-4 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-sans mb-2 text-lg font-semibold">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {group.cards.map((text, idx) => (
                    <Button
                      key={idx}
                      disabled
                      className={`flex items-center justify-center border ${group.color} text-white`}
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {revealedGroups.map((groupId) => {
            const group = initialGroups.find((g) => g.id === groupId)!;
            return (
              <motion.div
                key={groupId}
                className={`w-full p-4 rounded-2xl ${group.color} text-black`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-sans mb-2 text-lg font-semibold">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {group.cards.map((text, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      disabled
                      className="flex items-center justify-center border text-black"
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              </motion.div>
            );
          })}

          <RainbowButton variant="outline" className="mt-6">
            Play Unlimited
          </RainbowButton>
        </motion.div>
      )}
    </motion.div>
  );
}

function shuffleArray<T>(array: T[], seed = Date.now()): T[] {
  const arr = [...array];
  const random = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
