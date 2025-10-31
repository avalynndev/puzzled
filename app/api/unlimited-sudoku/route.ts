import { NextResponse } from "next/server";

const API_URL =
  "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution,difficulty}}}";

export async function GET() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Sudoku" },
        { status: 500 },
      );
    }

    const json = await res.json();
    const grid = json?.newboard?.grids?.[0];

    if (!grid) {
      return NextResponse.json(
        { error: "Invalid Sudoku data" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      value: grid.value,
      solution: grid.solution,
      difficulty: grid.difficulty,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
