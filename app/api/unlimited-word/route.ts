import { NextResponse } from "next/server";

const validateWord = async (word: string): Promise<boolean> => {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
    );
    return res.ok;
  } catch {
    return false;
  }
};

async function fetchRandomWord(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word?length=5",
      );
      const words = await response.json();
      const word = words[0].toUpperCase();

      const isValid = await validateWord(word);
      if (isValid) return word;
    } catch {}
  }

  const fallbackWords = [
    "CRANE",
    "SPARE",
    "TRACE",
    "PLANE",
    "BRAVE",
    "FRAME",
    "GRAPE",
    "SHAPE",
    "SLATE",
    "CRATE",
    "STARE",
    "PRIDE",
    "PHONE",
    "STONE",
    "BROKE",
    "CHOSE",
    "FLOUR",
    "GHOST",
    "HOUSE",
    "JOINT",
    "KNIFE",
    "LARGE",
    "MOUNT",
    "NORTH",
    "OCEAN",
    "PRIZE",
    "QUOTE",
    "RIVER",
    "SWEET",
    "TIGER",
    "UNDER",
    "VOICE",
    "WASTE",
    "YOUTH",
    "ZEBRA",
  ];
  return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
}

export async function GET() {
  const word = await fetchRandomWord();
  return NextResponse.json({ word });
}
