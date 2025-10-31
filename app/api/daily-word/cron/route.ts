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
  ];
  return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newWord = await fetchRandomWord();

  return NextResponse.json({ success: true, word: newWord });
}
