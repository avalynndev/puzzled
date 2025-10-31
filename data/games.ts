type InteractiveElement = {
  title: string;
  id: string;
  isDisabled: boolean;
  backgroundUrl: string;
};

export const games: InteractiveElement[] = [
  {
    id: "spellbee",
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
    id: "spellbee-unlimited",
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

export const otherGroups = [
  {
    id: 1,
    title: "Types of Fruit",
    cards: ["Apple", "Banana", "Orange", "Grape"],
    color: "bg-yellow-500",
  },
  {
    id: 2,
    title: "Ocean Creatures",
    cards: ["Dolphin", "Shark", "Whale", "Octopus"],
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Precious Metals",
    cards: ["Gold", "Silver", "Platinum", "Bronze"],
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Programming Languages",
    cards: ["Python", "Java", "JavaScript", "Ruby"],
    color: "bg-green-500",
  },
  {
    id: 5,
    title: "Weather Conditions",
    cards: ["Sunny", "Rainy", "Cloudy", "Snowy"],
    color: "bg-cyan-500",
  },
  {
    id: 6,
    title: "Musical Instruments",
    cards: ["Guitar", "Piano", "Drums", "Violin"],
    color: "bg-pink-500",
  },
  {
    id: 7,
    title: "Coffee Drinks",
    cards: ["Espresso", "Latte", "Cappuccino", "Americano"],
    color: "bg-amber-600",
  },
  {
    id: 8,
    title: "Card Suits",
    cards: ["Hearts", "Diamonds", "Clubs", "Spades"],
    color: "bg-red-500",
  },
];
