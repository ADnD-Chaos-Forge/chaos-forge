import { describe, it, expect } from "vitest";
import { validateFile } from "./upload";

function fakeFile(type: string, sizeBytes: number): File {
  return new File([new ArrayBuffer(sizeBytes)], "test.png", { type });
}

describe("validateFile", () => {
  it("accepts a valid JPEG under size limit", () => {
    expect(validateFile(fakeFile("image/jpeg", 1_000_000))).toBeNull();
  });

  it("accepts a valid PNG under size limit", () => {
    expect(validateFile(fakeFile("image/png", 5_000_000))).toBeNull();
  });

  it("accepts a valid WebP under size limit", () => {
    expect(validateFile(fakeFile("image/webp", 9_999_999))).toBeNull();
  });

  it("rejects unsupported file types", () => {
    const result = validateFile(fakeFile("image/gif", 500));
    expect(result).toContain("JPG");
  });

  it("rejects files exceeding 10 MB", () => {
    const result = validateFile(fakeFile("image/png", 11 * 1024 * 1024));
    expect(result).toContain("10 MB");
  });

  it("accepts files exactly at 10 MB", () => {
    expect(validateFile(fakeFile("image/png", 10 * 1024 * 1024))).toBeNull();
  });
});
