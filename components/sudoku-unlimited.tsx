"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";

type SudokuData = {
  value: number[][];
  solution: number[][];
  difficulty: string;
};

export default function Sudoku() {
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [initialBoard, setInitialBoard] = useState<(number | null)[][]>([]);
  const [difficulty, setDifficulty] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = "sudoku_unlimited_progress";

  async function fetchSudoku() {
    try {
      setLoading(true);
      const res = await fetch("/api/unlimited-sudoku");
      const data = await res.json();
      const grid = data.value;
      const parsed = grid.map((row: number[]) =>
        row.map((n) => (n === 0 ? null : n))
      );
      setBoard(parsed);
      setInitialBoard(parsed);
      setDifficulty(data.difficulty || "Unknown");

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          board: parsed,
          initialBoard: parsed,
          difficulty: data.difficulty,
        })
      );
    } catch (err) {
      console.error("Failed to load Sudoku:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { board, initialBoard, difficulty } = JSON.parse(saved);
      setBoard(board);
      setInitialBoard(initialBoard);
      setDifficulty(difficulty);
      setLoading(false);
    } else {
      fetchSudoku();
    }
  }, []);

  useEffect(() => {
    if (board.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ board, initialBoard, difficulty })
      );
    }
  }, [board, difficulty]);

  const handleChange = (row: number, col: number, value: string) => {
    const num = value === "" ? null : parseInt(value);
    if (num === null || (num >= 1 && num <= 9)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = num;
      setBoard(newBoard);
    }
  };

  const getStringBoard = () =>
    board.map((row) =>
      row.map((cell) => (cell === null ? "." : cell.toString()))
    );

  const isValidSudoku = (board: string[][]): boolean => {
    const rows = Array.from({ length: 9 }, () => Array(9).fill(false));
    const cols = Array.from({ length: 9 }, () => Array(9).fill(false));
    const boxes = Array.from({ length: 9 }, () => Array(9).fill(false));

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== ".") {
          const num = board[i][j].charCodeAt(0) - "1".charCodeAt(0);
          const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
          if (rows[i][num] || cols[j][num] || boxes[boxIndex][num]) {
            return false;
          }
          rows[i][num] = cols[j][num] = boxes[boxIndex][num] = true;
        }
      }
    }
    return true;
  };

  const checkSolution = () => {
    const strBoard = getStringBoard();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (strBoard[r][c] === ".") {
          alert("Incomplete board!");
          return;
        }
      }
    }

    if (isValidSudoku(strBoard)) {
      alert("🎉 Congratulations! The Sudoku is valid!");
    } else {
      alert("❌ Invalid Sudoku! Please check your numbers.");
    }
  };

  const handleRefresh = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await fetchSudoku();
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-xl font-semibold">{difficulty}</h1>
      </div>

      <div className="grid grid-cols-9 gap-0.5 border-2">
        {board.flatMap((row, rIdx) =>
          row.map((cell, cIdx) => {
            const borderClasses = [
              rIdx % 3 === 0 ? "border-t-2" : "",
              cIdx % 3 === 0 ? "border-l-2" : "",
              rIdx === 8 ? "border-b-2" : "",
              cIdx === 8 ? "border-r-2" : "",
              "border-gray-400",
            ].join(" ");

            return (
              <input
                key={`${rIdx}-${cIdx}`}
                type="text"
                maxLength={1}
                value={cell ?? ""}
                onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                className={`w-12 h-12 text-center text-lg font-medium ${borderClasses} border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary`}
                disabled={initialBoard[rIdx][cIdx] !== null}
              />
            );
          })
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" /> New Puzzle
        </Button>

        <Button onClick={checkSolution} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
            </>
          ) : (
            "Check Solution"
          )}
        </Button>
      </div>
    </div>
  );
}
