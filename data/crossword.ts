import { CrosswordItem } from "@/types";

export const WORD_POOL: { word: string; clue: string }[] = [
  { word: "TIME", clue: "Moves forward but never returns" },
  { word: "CLOCK", clue: "Instrument that measures passing moments" },
  { word: "PAST", clue: "Everything that has already happened" },
  { word: "MEMORY", clue: "The mind’s way of preserving the past" },
  { word: "OCEAN", clue: "Vast body of saltwater covering most of Earth" },
  { word: "TEARS", clue: "Drops that reveal emotion" },
  { word: "SALT", clue: "Essential mineral, also found in tears" },
  { word: "FLOW", clue: "A steady, continuous movement" },
  { word: "MIRROR", clue: "Reflects truth—or illusion" },
  { word: "TRUTH", clue: "Opposite of falsehood" },
  { word: "REFLECTION", clue: "Image seen in still water or glass" },
  { word: "EGO", clue: "One’s sense of self" },
  { word: "BRIDGE", clue: "Structure that connects two sides" },
  { word: "GAP", clue: "A space or break between things" },
  { word: "CONNECTION", clue: "A relationship or link" },
  { word: "DISTANCE", clue: "Measure of space between points" },
  { word: "FLAME", clue: "Visible part of a fire" },
  { word: "PASSION", clue: "Intense emotion or enthusiasm" },
  { word: "DESTRUCTION", clue: "The act of ruining or annihilating" },
  { word: "LIGHT", clue: "What drives away darkness" },
  { word: "SEED", clue: "Beginning of growth or life" },
  { word: "GROWTH", clue: "Process of development or expansion" },
  { word: "FUTURE", clue: "What is yet to come" },
  { word: "PATIENCE", clue: "Ability to wait calmly" },
  { word: "SILENCE", clue: "Complete absence of sound" },
  { word: "VOICE", clue: "Sound produced by speaking" },
  { word: "THOUGHT", clue: "Product of the mind" },
  { word: "SPACE", clue: "The expanse beyond Earth—or between things" },
  { word: "KEY", clue: "Opens doors, both real and metaphorical" },
  { word: "DOOR", clue: "Barrier between two spaces" },
  { word: "OPPORTUNITY", clue: "A favorable moment to act" },
  { word: "SECRET", clue: "Something kept hidden from others" },
  { word: "CIRCLE", clue: "Shape with no beginning or end" },
  { word: "CYCLE", clue: "Series that repeats endlessly" },
  { word: "INFINITY", clue: "Without limit or end" },
  { word: "UNITY", clue: "State of being joined as one" },
  { word: "FEATHER", clue: "Light covering of a bird" },
  { word: "HOPE", clue: "Expectation of a positive outcome" },
  { word: "LIGHTNESS", clue: "Quality of being airy or gentle" },
  { word: "FLIGHT", clue: "Act of moving through the air" },
  { word: "THREAD", clue: "Fine strand used for sewing or connection" },
  { word: "FATE", clue: "Predetermined course of events" },
  { word: "WEAVE", clue: "Interlace threads or stories" },
  { word: "LINK", clue: "A connection or bond" },
  { word: "MOUNTAIN", clue: "Natural elevation with a peak" },
  { word: "CHALLENGE", clue: "A task demanding effort" },
  { word: "PEAK", clue: "The highest point of something" },
  { word: "EFFORT", clue: "Physical or mental exertion" },
  { word: "MASK", clue: "Covering for disguise or protection" },
  { word: "IDENTITY", clue: "Who or what someone is" },
  { word: "PERFORMANCE", clue: "Acting or executing a task" },
  { word: "HIDDEN", clue: "Concealed or not visible" },
  { word: "WOUND", clue: "Injury to body or soul" },
  { word: "HEALING", clue: "Process of becoming whole again" },
  { word: "SCAR", clue: "Mark left after a wound" },
  { word: "RIVER", clue: "Flowing body of water" },
  { word: "CHANGE", clue: "Act of becoming different" },
  { word: "PATH", clue: "Route or track for travel" },
  { word: "JOURNEY", clue: "Act of traveling from one place to another" },
  { word: "SHADOW", clue: "Dark shape caused by light blockage" },
  { word: "FEAR", clue: "Unpleasant emotion caused by danger" },
  { word: "DEPTH", clue: "Distance from surface to bottom" },
  { word: "UNKNOWN", clue: "Not familiar or discovered" },
  { word: "ICE", clue: "Frozen form of water" },
  { word: "STILLNESS", clue: "Absence of movement" },
  { word: "EMOTION", clue: "A strong feeling" },
  { word: "DISTANCE", clue: "Separation in space or time" },
  { word: "RAIN", clue: "Water falling from clouds" },
  { word: "CLEANSING", clue: "Process of purification" },
  { word: "RENEWAL", clue: "State of being refreshed or restored" },
  { word: "SADNESS", clue: "State of unhappiness" },
  { word: "CAGE", clue: "Enclosure that restricts movement" },
  { word: "FREEDOM", clue: "Power to act without constraint" },
  { word: "FEAR", clue: "Feeling of dread or anxiety" },
  { word: "BOUNDARY", clue: "Line that marks limits" },
  { word: "CROWN", clue: "Symbol of royalty or victory" },
  { word: "POWER", clue: "Ability to control or influence" },
  { word: "BURDEN", clue: "Heavy responsibility or load" },
  { word: "RESPONSIBILITY", clue: "Duty to take charge or answer for actions" },
  { word: "DUST", clue: "Fine particles of matter" },
  { word: "HISTORY", clue: "Record of past events" },
  { word: "STAR", clue: "Celestial body shining in the night sky" },
  { word: "DREAM", clue: "Vision during sleep or ambition" },
  { word: "GUIDANCE", clue: "Advice or direction" },
  { word: "TRANSPARENCY", clue: "Quality of being see-through or honest" },
  { word: "THORN", clue: "Sharp projection on a plant" },
  { word: "BEAUTY", clue: "Quality pleasing to the senses" },
  { word: "PAIN", clue: "Physical or emotional suffering" },
  { word: "ROSE", clue: "Flower symbolizing love" },
  { word: "VEIL", clue: "Covering that conceals" },
  { word: "TWILIGHT", clue: "Time between sunset and darkness" },
  { word: "DAWN", clue: "First light of day" },
  { word: "STORM", clue: "Violent disturbance of the atmosphere" },
  { word: "GARDEN", clue: "Cultivated plot of plants or flowers" },
  { word: "CHAIN", clue: "Series of linked metal rings" },
  { word: "STONE", clue: "Hard, solid mineral material" },
  { word: "LIGHT", clue: "Something that makes vision possible" },
  { word: "HOPE", clue: "Feeling of expectation and desire" },
];

function getRandomDirection(): "across" | "down" {
  return Math.random() < 0.5 ? "across" : "down";
}

export function getCrosswordUnlimitedData(count = 6): CrosswordItem[] {
  const usedWords = new Set<string>();
  const selected: CrosswordItem[] = [];

  while (selected.length < count && usedWords.size < WORD_POOL.length) {
    const idx = Math.floor(Math.random() * WORD_POOL.length);
    const { word, clue } = WORD_POOL[idx];
    const upperWord = word.toUpperCase();

    if (usedWords.has(upperWord)) continue;

    usedWords.add(upperWord);

    selected.push({
      word: upperWord,
      clue,
      direction: getRandomDirection(),
    });
  }

  while (selected.length < count) {
    const fallback = WORD_POOL[selected.length % WORD_POOL.length];
    selected.push({
      word: fallback.word.toUpperCase(),
      clue: fallback.clue,
      direction: getRandomDirection(),
    });
  }

  const hasAcross = selected.some((item) => item.direction === "across");
  const hasDown = selected.some((item) => item.direction === "down");

  if (!hasAcross && selected.length > 0) selected[0].direction = "across";
  if (!hasDown && selected.length > 1) selected[1].direction = "down";

  return selected;
}
