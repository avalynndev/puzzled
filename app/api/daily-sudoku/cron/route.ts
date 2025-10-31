import { NextResponse } from "next/server";

const SUDOKU_API = "https://sudoku-api.vercel.app/api/dosuku";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(SUDOKU_API);
    const data = await response.json();

    const grid = data.newboard.grids[0];
    const sudoku = {
      value: grid.value,
      solution: grid.solution,
      difficulty: grid.difficulty,
    };

    console.log("🧩 New Sudoku generated:", sudoku.difficulty);
    return NextResponse.json({ success: true, sudoku });
  } catch (error) {
    console.error("❌ Error fetching Sudoku:", error);
    return NextResponse.json(
      { error: "Failed to fetch Sudoku" },
      { status: 500 }
    );
  }
}
