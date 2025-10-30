type InteractiveElement = {
  title: string;
  id: string;
  isDisabled: boolean;
  backgroundUrl: string;
};

export const games: InteractiveElement[] = [
  {
    id: "spelling-bee",
    title: "Spelling Bee",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/spelling-bee-card-icon.svg",
  },
  {
    id: "wordle",
    title: "Wordle",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/wordle-card-icon.svg",
  },
  {
    id: "connections",
    title: "Connections",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/connections.svg",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/sudoku-card-icon.svg",
  },
  {
    id: "riddle",
    title: "Riddles",
    isDisabled: false,
    backgroundUrl: "/puzzle.svg",
  },
];
