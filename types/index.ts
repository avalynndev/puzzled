export type Direction = "across" | "down";

export interface CrosswordItem {
  word: string;
  clue: string;
  direction: Direction;
}

export interface CrosswordCell {
  letter: string;
  input: string;
  number?: number;
  isStart: boolean;
  correct?: boolean;
}

export interface CrosswordGrid {
  cells: CrosswordCell[][];
  width: number;
  height: number;
}

export interface CrosswordClue {
  number: number;
  clue: string;
  direction: Direction;
}
