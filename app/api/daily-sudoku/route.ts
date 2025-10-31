import { NextResponse } from "next/server";

type SudokuData = {
  value: number[][];
  solution: number[][];
  difficulty: string;
};

let cachedSudoku: SudokuData | null = null;
let cachedDate = "";

const SUDOKU_API = "https://sudoku-api.vercel.app/api/dosuku";

async function fetchNewSudoku() {
  const res = await fetch(SUDOKU_API);
  if (!res.ok) throw new Error("Failed to fetch Sudoku");
  const data = await res.json();
  const grid = data.newboard.grids[0];
  return {
    value: grid.value,
    solution: grid.solution,
    difficulty: grid.difficulty,
  };
}

export async function GET() {
  const today = new Date().toDateString();

  if (cachedDate !== today || !cachedSudoku) {
    console.log("Fetching new Sudoku for:", today);
    try {
      cachedSudoku = await fetchNewSudoku();
      cachedDate = today;
    } catch (error) {
      console.error("Error fetching Sudoku:", error);
      return NextResponse.json(
        { error: "Failed to fetch Sudoku" },
        { status: 500 },
      );
    }
  } else {
    console.log("Using cached Sudoku for:", today);
  }

  return NextResponse.json(cachedSudoku);
}
