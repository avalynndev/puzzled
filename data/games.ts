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
    title: "Riddle Of The Day",
    isDisabled: false,
    backgroundUrl: "/puzzle.svg",
  },
  {
    id: "crossword",
    title: "Crossword",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/puzzle-progress/puzzle-progress-0.svg",
  },
  {
    id: "wordle-unlimited",
    title: "Wordle Unlimited",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/wordle-card-icon.svg",
  },
  {
    id: "riddle-unlimited",
    title: "Riddle Unlimited",
    isDisabled: false,
    backgroundUrl: "/puzzle.svg",
  },
  {
    id: "crossword-unlimited",
    title: "Crossword Unlimited",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/puzzle-progress/puzzle-progress-0.svg",
  },
  {
    id: "spelling-bee-unlimited",
    title: "Spelling Bee Unlimited",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/spelling-bee-card-icon.svg",
  },
  {
    id: "connections-unlimited",
    title: "Connections Unlimited",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/connections.svg",
  },
  {
    id: "sudoku-unlimited",
    title: "Sudoku Unlimited",
    isDisabled: false,
    backgroundUrl:
      "https://www.nytimes.com/games-assets/v2/assets/expansion-games/sudoku-card-icon.svg",
  },
];
