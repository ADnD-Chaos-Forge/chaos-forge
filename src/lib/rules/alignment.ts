import type { ClassId } from "./types";

export type AlignmentId =
  | "lawful_good"
  | "neutral_good"
  | "chaotic_good"
  | "lawful_neutral"
  | "true_neutral"
  | "chaotic_neutral"
  | "lawful_evil"
  | "neutral_evil"
  | "chaotic_evil";

export const ALL_ALIGNMENTS: AlignmentId[] = [
  "lawful_good",
  "neutral_good",
  "chaotic_good",
  "lawful_neutral",
  "true_neutral",
  "chaotic_neutral",
  "lawful_evil",
  "neutral_evil",
  "chaotic_evil",
];

const ALIGNMENT_LABELS: Record<AlignmentId, string> = {
  lawful_good: "Rechtschaffen Gut",
  neutral_good: "Neutral Gut",
  chaotic_good: "Chaotisch Gut",
  lawful_neutral: "Rechtschaffen Neutral",
  true_neutral: "Neutral",
  chaotic_neutral: "Chaotisch Neutral",
  lawful_evil: "Rechtschaffen Böse",
  neutral_evil: "Neutral Böse",
  chaotic_evil: "Chaotisch Böse",
};

const ALIGNMENT_LABELS_EN: Record<AlignmentId, string> = {
  lawful_good: "Lawful Good",
  neutral_good: "Neutral Good",
  chaotic_good: "Chaotic Good",
  lawful_neutral: "Lawful Neutral",
  true_neutral: "Neutral",
  chaotic_neutral: "Chaotic Neutral",
  lawful_evil: "Lawful Evil",
  neutral_evil: "Neutral Evil",
  chaotic_evil: "Chaotic Evil",
};

export function getAlignmentLabel(alignmentId: string, locale: string = "de"): string {
  const labels = locale === "en" ? ALIGNMENT_LABELS_EN : ALIGNMENT_LABELS;
  return labels[alignmentId as AlignmentId] ?? alignmentId;
}

// PHB class alignment restrictions
const GOOD_ONLY: AlignmentId[] = ["lawful_good", "neutral_good", "chaotic_good"];
const NON_LAWFUL: AlignmentId[] = [
  "neutral_good",
  "chaotic_good",
  "true_neutral",
  "chaotic_neutral",
  "neutral_evil",
  "chaotic_evil",
];

const CLASS_RESTRICTIONS: Partial<Record<ClassId, AlignmentId[]>> = {
  paladin: ["lawful_good"],
  ranger: GOOD_ONLY,
  druid: ["true_neutral"],
  bard: NON_LAWFUL,
};

export function getAllowedAlignments(classId: ClassId): AlignmentId[] {
  return CLASS_RESTRICTIONS[classId] ?? [...ALL_ALIGNMENTS];
}
