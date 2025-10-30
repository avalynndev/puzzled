"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Card = {
  text: string;
  group: number;
  id: number;
};

type GroupInfo = {
  id: number;
  title: string;
  color: string;
  cards: string[];
};

const groupData: GroupInfo[] = [
  {
    id: 2,
    title: "ENCOURAGE, WITH 'ON'",
    color: "bg-blue-400",
    cards: ["EGG", "GOAD", "SPUR", "URGE"],
  },
  {
    id: 3,
    title: "SPHERICAL FOODS",
    color: "bg-yellow-400",
    cards: ["JAWBREAKER", "MEATBALL", "MOZZARELLA", "ORANGE"],
  },
  {
    id: 4,
    title: "GROCERY STORE AISLES",
    color: "bg-purple-400",
    cards: ["DAIRY", "FROZEN", "PRODUCE", "SNACK"],
  },
  {
    id: 5,
    title: "GO ___",
    color: "bg-green-400",
    cards: ["BANANAS", "FIGURE", "FISH", "STEADY"],
  },
];

const initialCards: Card[] = groupData.flatMap((g) =>
  g.cards.map((text, i) => ({ text, group: g.id, id: g.id * 10 + i }))
);

export default function ConnectionsGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [foundGroups, setFoundGroups] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [revealedGroups, setRevealedGroups] = useState<number[]>([]);

  useEffect(() => {
    setCards(shuffleArray(initialCards));
  }, []);

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  };

const submitGroup = () => {
  if (selected.length !== 4) {
    alert("Select exactly 4 buttons!");
    return;
  }

  const groupIds = selected.map((id) => cards.find((c) => c.id === id)?.group);

  if (groupIds.every((g) => g === groupIds[0] && !foundGroups.includes(g!))) {
    setFoundGroups([...foundGroups, groupIds[0]!]);
    alert("Correct! Nice job.");
  } else {
    const newMistakes = mistakes + 1;
    setMistakes(newMistakes);

    if (newMistakes < 4) {
      const wrongTexts = selected.map(
        (id) => cards.find((c) => c.id === id)?.text
      );
      alert(
        `Wrong! You selected: ${wrongTexts.join(
          ", "
        )}\nMistakes: ${newMistakes}/4`
      );
    } else {
      const remainingGroups = groupData
        .map((g) => g.id)
        .filter((g) => !foundGroups.includes(g));
      setRevealedGroups(remainingGroups);
      alert("You've reached 4 mistakes! Revealing remaining groups.");
    }
  }

  setSelected([]);
};


  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h2 className="text-xl font-bold">Connections Game</h2>
      <p>Mistakes allowed: {4 - mistakes}</p>

      {/* Game buttons */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const isSelected = selected.includes(card.id);
          const isFound = foundGroups.includes(card.group);
          const isRevealed = revealedGroups.includes(card.group);

          if (isRevealed) return null;

          const groupColor = groupData.find((g) => g.id === card.group)?.color;

          return (
            <Button
              key={card.id}
              variant={isSelected ? "default" : "outline"}
              disabled={isFound || mistakes >= 4}
              onClick={() => toggleSelect(card.id)}
              className={`w-32 h-16 text-center font-semibold ${
                isFound ? `${groupColor} text-white` : ""
              }`}
            >
              {card.text}
            </Button>
          );
        })}
      </div>

      {/* Revealed groups */}
      {revealedGroups.map((groupId) => {
        const group = groupData.find((g) => g.id === groupId)!;
        return (
          <div
            key={groupId}
            className={`w-full p-4 rounded ${group.color} text-white`}
          >
            <h3 className="font-sans mb-1">{group.title}</h3>
            <div className="grid grid-cols-4 gap-2">
              {group.cards.map((text, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  className=" flex items-center justify-center border"
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>
        );
      })}

      <Button onClick={submitGroup} disabled={mistakes >= 4}>
        Submit
      </Button>
    </div>
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
