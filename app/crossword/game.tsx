"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { geistSans } from "@/lib/fonts";
import Crossword from "@/components/crossword";
import { CrosswordItem } from "@/types";
import { WORD_POOL } from "@/data/crossword";

function seededRandom(seed: number) {
  return function () {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

function getRandomDirection(randomFn: () => number): "across" | "down" {
  return randomFn() < 0.5 ? "across" : "down";
}

export function getDailyCrosswordData(count = 6): CrosswordItem[] {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate(); 
  const randomFn = seededRandom(seed);

  const usedWords = new Set<string>();
  const selected: CrosswordItem[] = [];

  while (selected.length < count && usedWords.size < WORD_POOL.length) {
    const idx = Math.floor(randomFn() * WORD_POOL.length);
    const { word, clue } = WORD_POOL[idx];
    const upperWord = word.toUpperCase();

    if (usedWords.has(upperWord)) continue;

    usedWords.add(upperWord);

    selected.push({
      word: upperWord,
      clue,
      direction: getRandomDirection(randomFn),
    });
  }

  while (selected.length < count) {
    const fallback = WORD_POOL[selected.length % WORD_POOL.length];
    selected.push({
      word: fallback.word.toUpperCase(),
      clue: fallback.clue,
      direction: getRandomDirection(randomFn),
    });
  }

  const hasAcross = selected.some((item) => item.direction === "across");
  const hasDown = selected.some((item) => item.direction === "down");

  if (!hasAcross && selected.length > 0) selected[0].direction = "across";
  if (!hasDown && selected.length > 1) selected[1].direction = "down";

  return selected;
}


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function GamePage() {
  const crosswordData = getDailyCrosswordData(20);

  return (
    <motion.main
      className={`${geistSans.className} mx-auto flex max-w-4xl flex-col items-center px-4 pt-10`}
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.div className="mb-6" variants={fadeInUp}>
        <Link href="/">
          <Button variant="link">← Back Home</Button>
        </Link>
      </motion.div>
      <motion.main
        className="w-full rounded-t-lg border p-4 py-6 shadow-lg sm:py-12"
        variants={fadeInUp}
      >
        <div className="text-center">
          <motion.h2
            className="text-2xl font-bold sm:text-3xl"
            variants={fadeInUp}
          >
            Crossword
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-500" variants={fadeInUp}>
            desc
          </motion.p>
        </div>
      </motion.main>
      <div className="py-16">
        <Crossword data={crosswordData} />
      </div>
    </motion.main>
  );
}
