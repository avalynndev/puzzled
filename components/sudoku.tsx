"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const initialBoard: (number | null)[][] = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

export default function Sudoku() {
  const [board, setBoard] = useState(initialBoard);

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
    const rows: boolean[][] = Array.from({ length: 9 }, () =>
      Array(9).fill(false)
    );
    const cols: boolean[][] = Array.from({ length: 9 }, () =>
      Array(9).fill(false)
    );
    const boxes: boolean[][] = Array.from({ length: 9 }, () =>
      Array(9).fill(false)
    );

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

  return (
    <div className="flex flex-col items-center p-4">
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

      <Button className="mt-4" onClick={checkSolution}>
        Check Solution
      </Button>
    </div>
  );
}
