import { NextResponse } from "next/server";

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
        answer: "echo",
      },
      {
        riddle: "What has keys but can't open locks?",
        answer: "piano",
      },
      {
        riddle:
          "The more of this you take, the more you leave behind. What is it?",
        answer: "footsteps",
      },
      {
        riddle: "What can travel around the world while staying in a corner?",
        answer: "stamp",
      },
      {
        riddle: "What has a head and a tail but no body?",
        answer: "coin",
      },
      {
        riddle: "What gets wet while drying?",
        answer: "towel",
      },
      {
        riddle: "What can you break, even if you never pick it up or touch it?",
        answer: "promise",
      },
      {
        riddle: "What goes up but never comes down?",
        answer: "age",
      },
    ];

    return fallbackRiddles[Math.floor(Math.random() * fallbackRiddles.length)];
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newRiddle = await fetchRandomRiddle();

  console.log("Cron job executed - New riddle fetched:", {
    riddle: newRiddle.riddle.substring(0, 50) + "...",
    date: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    riddle: newRiddle,
    timestamp: new Date().toISOString(),
  });
}

