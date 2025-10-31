"use client";

import React, { useState, useEffect, useRef } from "react";
import { CrosswordItem, CrosswordGrid, CrosswordClue } from "@/types";
import { generateCrossword } from "@/generator";

interface CrosswordProps {
  data: CrosswordItem[];
}

const Crossword: React.FC<CrosswordProps> = ({ data }) => {
  const [grid, setGrid] = useState<CrosswordGrid | null>(null);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [, setFocusedCell] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [allCorrect, setAllCorrect] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    const { grid, clues } = generateCrossword(data);
    setGrid(grid);
    setClues(clues);
  }, [data]);

  const handleInputChange = (y: number, x: number, value: string) => {
    if (!grid) return;

    const newGrid: CrosswordGrid = {
      ...grid,
      cells: grid.cells.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === y && colIndex === x
            ? {
                ...cell,
                input: value.toUpperCase(),
                correct: value.toUpperCase() === cell.letter,
              }
            : cell
        )
      ),
    };

    setGrid(newGrid);

    if (value) {
      moveFocus(y, x);
    }

    checkAllCorrect(newGrid);
  };

  const checkAllCorrect = (currentGrid: CrosswordGrid) => {
    const allCorrect = currentGrid.cells.every((row) =>
      row.every((cell) => cell.letter === "" || cell.input === cell.letter)
    );
    setAllCorrect(allCorrect);
  };

  const moveFocus = (y: number, x: number) => {
    const nextCell = findNextCell(y, x);
    if (nextCell) {
      setFocusedCell(nextCell);
      inputRefs.current[nextCell[0]][nextCell[1]]?.focus();
    }
  };

  const findNextCell = (y: number, x: number): [number, number] | null => {
    if (!grid) return null;

    const moveInDirection = (
      dy: number,
      dx: number
    ): [number, number] | null => {
      let ny = y + dy;
      let nx = x + dx;
      while (ny >= 0 && ny < grid.height && nx >= 0 && nx < grid.width) {
        if (grid.cells[ny][nx].letter !== "") {
          return [ny, nx];
        }
        ny += dy;
        nx += dx;
      }
      return null;
    };

    const moveAcross = () =>
      moveInDirection(0, 1) ||
      moveInDirection(1, 0) ||
      moveInDirection(0, -1) ||
      moveInDirection(-1, 0);
    const moveDown = () =>
      moveInDirection(1, 0) ||
      moveInDirection(0, 1) ||
      moveInDirection(0, -1) ||
      moveInDirection(-1, 0);

    return direction === "across" ? moveAcross() : moveDown();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    y: number,
    x: number
  ) => {
    if (e.key === "ArrowRight") {
      setDirection("across");
      moveFocus(y, x);
    } else if (e.key === "ArrowLeft") {
      setDirection("across");
      moveFocus(y, x - 2);
    } else if (e.key === "ArrowDown") {
      setDirection("down");
      moveFocus(y, x);
    } else if (e.key === "ArrowUp") {
      setDirection("down");
      moveFocus(y - 2, x);
    } else if (e.key === "Backspace" && !grid?.cells[y][x].input) {
      e.preventDefault();
      const prevCell = findNextCell(y, x - 2);
      if (prevCell) {
        setFocusedCell(prevCell);
        inputRefs.current[prevCell[0]][prevCell[1]]?.focus();
        if (grid) {
          const newGrid: CrosswordGrid = { ...grid, cells: [...grid.cells] };
          newGrid.cells[prevCell[0]][prevCell[1]] = {
            ...newGrid.cells[prevCell[0]][prevCell[1]],
            input: "",
            correct: undefined,
          };
          setGrid(newGrid);
          checkAllCorrect(newGrid);
        }
      }
    }
  };

  const handleCellClick = (y: number, x: number) => {
    setFocusedCell([y, x]);
    const currentDirection = direction;
    const oppositeDirection = currentDirection === "across" ? "down" : "across";

    const hasWordInCurrentDirection =
      (currentDirection === "across" &&
        ((x > 0 && grid!.cells[y][x - 1].letter) ||
          (x < grid!.width - 1 && grid!.cells[y][x + 1].letter))) ||
      (currentDirection === "down" &&
        ((y > 0 && grid!.cells[y - 1][x].letter) ||
          (y < grid!.height - 1 && grid!.cells[y + 1][x].letter)));

    const hasWordInOppositeDirection =
      (oppositeDirection === "across" &&
        ((x > 0 && grid!.cells[y][x - 1].letter) ||
          (x < grid!.width - 1 && grid!.cells[y][x + 1].letter))) ||
      (oppositeDirection === "down" &&
        ((y > 0 && grid!.cells[y - 1][x].letter) ||
          (y < grid!.height - 1 && grid!.cells[y + 1][x].letter)));

    if (!hasWordInCurrentDirection && hasWordInOppositeDirection) {
      setDirection(oppositeDirection);
    }
  };

  if (!grid) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="gap-8 p-4 max-w-7xl mx-auto">
      <div className="w-full lg:w-2/3">
        <div
          className="grid gap-1 aspect-square"
          style={{
            gridTemplateColumns: `repeat(${grid.width}, 40px)`,
            gridAutoRows: "40px",
          }}
        >
          {grid.cells.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`aspect-square ${
                  cell.letter ? "bg-white border" : "bg-transparent"
                } flex items-center justify-center relative`}
                onClick={() => handleCellClick(y, x)}
              >
                {cell.number && (
                  <span className="absolute top-0 left-0 text-xs sm:text-sm">
                    {cell.number}
                  </span>
                )}
                {cell.letter && (
                  <input
                    ref={(el) => {
                      if (!inputRefs.current[y]) inputRefs.current[y] = [];
                      inputRefs.current[y][x] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={cell.input}
                    onChange={(e) => handleInputChange(y, x, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, y, x)}
                    className={`w-full h-full text-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${
                        cell.correct === true
                          ? "bg-green-200"
                          : cell.correct === false
                          ? "bg-red-200"
                          : ""
                      }`}
                    aria-label={`Row ${y + 1}, Column ${x + 1}`}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-full mt-8 lg:mt-4">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Across</h3>
            <ul className="list-none space-y-2">
              {clues
                .filter((clue) => clue.direction === "across")
                .sort((a, b) => a.number - b.number)
                .map((clue) => (
                  <li key={`across-${clue.number}`} className="text-lg">
                    <span className="font-semibold">{clue.number}.</span>{" "}
                    {clue.clue}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Down</h3>
            <ul className="list-none space-y-2">
              {clues
                .filter((clue) => clue.direction === "down")
                .sort((a, b) => a.number - b.number)
                .map((clue) => (
                  <li key={`down-${clue.number}`} className="text-lg">
                    <span className="font-semibold">{clue.number}.</span>{" "}
                    {clue.clue}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        className={`mt-6 p-2 text-center text-lg w-full font-bold rounded-xl ${
          allCorrect ? "bg-secondary text-white" : "bg-primary text-white"
        }`}
      >
        {allCorrect
          ? "Congratulations! All answers are correct!"
          : "Keep going! You can do it!!"}
      </div>
    </div>
  );
};

export default Crossword;
