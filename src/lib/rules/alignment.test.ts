import { describe, it, expect } from "vitest";
import { ALL_ALIGNMENTS, getAlignmentLabel, getAllowedAlignments } from "./alignment";

describe("Alignment", () => {
  it("should define exactly 9 alignments", () => {
    expect(ALL_ALIGNMENTS).toHaveLength(9);
  });

  it("should return German label for alignment", () => {
    expect(getAlignmentLabel("lawful_good")).toBe("Rechtschaffen Gut");
    expect(getAlignmentLabel("chaotic_evil")).toBe("Chaotisch Böse");
    expect(getAlignmentLabel("true_neutral")).toBe("Neutral");
  });

  it("should restrict paladin to lawful good only", () => {
    const allowed = getAllowedAlignments("paladin");
    expect(allowed).toEqual(["lawful_good"]);
  });

  it("should restrict druid to true neutral only", () => {
    const allowed = getAllowedAlignments("druid");
    expect(allowed).toEqual(["true_neutral"]);
  });

  it("should restrict ranger to good alignments", () => {
    const allowed = getAllowedAlignments("ranger");
    expect(allowed).toContain("lawful_good");
    expect(allowed).toContain("neutral_good");
    expect(allowed).toContain("chaotic_good");
    expect(allowed).not.toContain("chaotic_evil");
  });

  it("should restrict bard to non-lawful alignments", () => {
    const allowed = getAllowedAlignments("bard");
    expect(allowed).not.toContain("lawful_good");
    expect(allowed).not.toContain("lawful_neutral");
    expect(allowed).not.toContain("lawful_evil");
    expect(allowed).toContain("true_neutral");
    expect(allowed).toContain("chaotic_good");
  });

  it("should allow fighter all 9 alignments", () => {
    const allowed = getAllowedAlignments("fighter");
    expect(allowed).toHaveLength(9);
  });

  it("should allow mage all 9 alignments", () => {
    const allowed = getAllowedAlignments("mage");
    expect(allowed).toHaveLength(9);
  });
});
