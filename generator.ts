import {
  CrosswordItem,
  CrosswordGrid,
  CrosswordClue,
  CrosswordCell,
} from "@/types";

export function generateCrossword(data: CrosswordItem[]): {
  grid: CrosswordGrid;
  clues: CrosswordClue[];
} {
  const words = data.map((item) => item.word.toUpperCase());
  const grid: CrosswordCell[][] = [];
  const clues: CrosswordClue[] = [];
  let clueNumber = 1;

  const maxLength = Math.max(...words.map((word) => word.length));
  const gridSize = Math.max(maxLength * 2, 50);

  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = {
        letter: "",
        isStart: false,
        input: "",
        correct: undefined,
        number: undefined,
      };
    }
  }

  const firstWord = words[0];
  const startY = Math.floor(gridSize / 2);
  const startX = Math.floor((gridSize - firstWord.length) / 2);
  placeWord(grid, firstWord, startX, startY, "across", clueNumber);
  clues.push({ number: clueNumber, clue: data[0].clue, direction: "across" });

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    let placed = false;

    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const randomY = Math.floor(Math.random() * gridSize);
      const randomX = Math.floor(Math.random() * gridSize);

      for (let y = randomY; y < gridSize && !placed; y++) {
        for (let x = randomX; x < gridSize && !placed; x++) {
          if (grid[y][x].letter !== "" && word.includes(grid[y][x].letter)) {
            const intersectionIndex = word.indexOf(grid[y][x].letter);
            const direction = data[i].direction;

            if (
              direction === "across" &&
              canPlaceWord(grid, word, x - intersectionIndex, y, direction)
            ) {
              placeWord(
                grid,
                word,
                x - intersectionIndex,
                y,
                direction,
                grid[y][x - intersectionIndex].number || ++clueNumber
              );
              clues.push({
                number: grid[y][x - intersectionIndex].number!,
                clue: data[i].clue,
                direction,
              });
              placed = true;
              break;
            } else if (
              direction === "down" &&
              canPlaceWord(grid, word, x, y - intersectionIndex, direction)
            ) {
              placeWord(
                grid,
                word,
                x,
                y - intersectionIndex,
                direction,
                grid[y - intersectionIndex][x].number || ++clueNumber
              );
              clues.push({
                number: grid[y - intersectionIndex][x].number!,
                clue: data[i].clue,
                direction,
              });
              placed = true;
              break;
            }
          }
        }
        if (placed) break;
      }
    }

    if (!placed) {
      console.warn(`Could not place word: ${word}`);
    }
  }

  const trimmedGrid = trimGrid(grid);

  return {
    grid: {
      cells: trimmedGrid,
      width: trimmedGrid[0].length,
      height: trimmedGrid.length,
    },
    clues,
  };
}

function placeWord(
  grid: CrosswordCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: "across" | "down",
  number: number
) {
  for (let i = 0; i < word.length; i++) {
    const x = startX + (direction === "across" ? i : 0);
    const y = startY + (direction === "down" ? i : 0);

    if (!grid[y][x] || grid[y][x].letter === "") {
      grid[y][x] = {
        letter: word[i],
        input: "",
        isStart: i === 0,
        number: i === 0 ? number : undefined,
        correct: undefined,
      };
    } else {
      grid[y][x].letter = word[i];
      if (i === 0) {
        grid[y][x].isStart = true;
        if (!grid[y][x].number) {
          grid[y][x].number = number;
        }
      }
    }
  }
}

function canPlaceWord(
  grid: CrosswordCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: "across" | "down"
): boolean {
  if (
    startX < 0 ||
    startY < 0 ||
    startX + word.length > grid[0].length ||
    startY + word.length > grid.length
  ) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const x = startX + (direction === "across" ? i : 0);
    const y = startY + (direction === "down" ? i : 0);

    if (grid[y][x].letter !== "" && grid[y][x].letter !== word[i]) {
      return false;
    }

    if (direction === "across") {
      if (i === 0 && x > 0 && grid[y][x - 1].letter !== "") return false;
      if (
        i === word.length - 1 &&
        x < grid[0].length - 1 &&
        grid[y][x + 1].letter !== ""
      )
        return false;
      if (y > 0 && grid[y - 1][x].letter !== "" && grid[y][x].letter === "")
        return false;
      if (
        y < grid.length - 1 &&
        grid[y + 1][x].letter !== "" &&
        grid[y][x].letter === ""
      )
        return false;
    } else {
      if (i === 0 && y > 0 && grid[y - 1][x].letter !== "") return false;
      if (
        i === word.length - 1 &&
        y < grid.length - 1 &&
        grid[y + 1][x].letter !== ""
      )
        return false;
      if (x > 0 && grid[y][x - 1].letter !== "" && grid[y][x].letter === "")
        return false;
      if (
        x < grid[0].length - 1 &&
        grid[y][x + 1].letter !== "" &&
        grid[y][x].letter === ""
      )
        return false;
    }
  }

  return true;
}

function trimGrid(grid: CrosswordCell[][]): CrosswordCell[][] {
  let minX = grid[0].length;
  let maxX = 0;
  let minY = grid.length;
  let maxY = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x].letter !== "") {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const trimmedGrid: CrosswordCell[][] = [];
  for (let y = minY; y <= maxY; y++) {
    trimmedGrid.push(grid[y].slice(minX, maxX + 1));
  }

  return trimmedGrid;
}
