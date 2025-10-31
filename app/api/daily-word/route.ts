import { NextResponse } from "next/server";

let cachedWord = "";
let cachedDate = "";

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
      if (isValid) {
        console.log("Found valid word:", word);
        return word;
      }
      console.log("Invalid word, retrying:", word);
    } catch (error) {
      console.error("Error fetching word:", error);
    }
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
  const today = new Date().toDateString();

  if (cachedDate !== today || !cachedWord) {
    console.log("Fetching new word for:", today);
    cachedWord = await fetchRandomWord();
    cachedDate = today;
  } else {
    console.log("Using cached word for:", today);
  }

  return NextResponse.json({ word: cachedWord });
}
