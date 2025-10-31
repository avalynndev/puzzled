import { NextResponse } from "next/server";

let cachedRiddle = {
  riddle: "",
  answer: "",
};
let cachedDate = "";

async function fetchRandomRiddle() {
  try {
    const response = await fetch("https://riddles-api.vercel.app/random");

    if (!response.ok) {
      throw new Error("Failed to fetch riddle");
    }

    const data = await response.json();

    return {
      riddle: data.riddle,
      answer: data.answer,
    };
  } catch (error) {
    console.error("Error fetching riddle:", error);

    const fallbackRiddles = [
      {
        riddle: "I speak without a mouth and hear without ears. What am I?",
        answer: "An echo",
      },
      {
        riddle: "What has keys but can't open locks?",
        answer: "A piano",
      },
      {
        riddle:
          "The more of this you take, the more you leave behind. What is it?",
        answer: "Footsteps",
      },
      {
        riddle: "What can travel around the world while staying in a corner?",
        answer: "A stamp",
      },
      {
        riddle: "What has a head and a tail but no body?",
        answer: "A coin",
      },
      {
        riddle: "What gets wet while drying?",
        answer: "A towel",
      },
      {
        riddle: "What can you break, even if you never pick it up or touch it?",
        answer: "A promise",
      },
      {
        riddle: "What goes up but never comes down?",
        answer: "Your age",
      },
    ];

    return fallbackRiddles[Math.floor(Math.random() * fallbackRiddles.length)];
  }
}

export async function GET() {
  const today = new Date().toDateString();

  if (cachedDate !== today || !cachedRiddle.riddle) {
    console.log("Fetching new riddle for:", today);
    cachedRiddle = await fetchRandomRiddle();
    cachedDate = today;
  } else {
    console.log("Using cached riddle for:", today);
  }

  return NextResponse.json({
    riddle: cachedRiddle.riddle,
    answer: cachedRiddle.answer,
    date: today,
  });
}
