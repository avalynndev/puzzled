"use client"
import { Games } from "@/components/games";
import { Hero } from "@/components/hero";
import Crossword from "@jaredreisinger/react-crossword";
const data = {
  across: {
    1: {
      clue: "heh",
      answer: "TWO",
      row: 0,
      col: 0,
    },
  },
  down: {
    2: {
      clue: "three minus two",
      answer: "KEERTHI",
      row: 0,
      col: 2,
    },
  },
};
export default function Home() {
  return (
    <>
      <Hero />
      <Games />
      <div className="max-w-[300px]">
        <Crossword data={data} />
      </div>
    </>
  );
}
