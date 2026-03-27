import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock OffscreenCanvas and createImageBitmap for jsdom
const mockDrawImage = vi.fn();
const mockConvertToBlob = vi.fn().mockResolvedValue(new Blob(["fake"], { type: "image/webp" }));

class MockOffscreenCanvas {
  width: number;
  height: number;
  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
  }
  getContext() {
    return { drawImage: mockDrawImage };
  }
  convertToBlob = mockConvertToBlob;
}

vi.stubGlobal("OffscreenCanvas", MockOffscreenCanvas);

const mockClose = vi.fn();
vi.stubGlobal("createImageBitmap", async () => ({
  width: 800,
  height: 600,
  close: mockClose,
}));

// Import after mocks are set up
const { resizeImageToSquare, cropAndResize } = await import("./resize");

function fakeFile(name = "test.png", size = 1000): File {
  return new File([new ArrayBuffer(size)], name, { type: "image/png" });
}

describe("resizeImageToSquare", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crops to a centered square and resizes to 400x400", async () => {
    const file = fakeFile();
    const blob = await resizeImageToSquare(file);

    expect(blob).toBeInstanceOf(Blob);
    // Source image 800x600 -> centered square: sx=100, sy=0, size=600
    expect(mockDrawImage).toHaveBeenCalledWith(
      expect.objectContaining({ width: 800, height: 600 }),
      100,
      0,
      600,
      600,
      0,
      0,
      400,
      400
    );
    expect(mockConvertToBlob).toHaveBeenCalledWith({ type: "image/webp", quality: 0.85 });
    expect(mockClose).toHaveBeenCalled();
  });
});

describe("cropAndResize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crops to the given pixel area and resizes to 400x400", async () => {
    const file = fakeFile();
    const cropArea = { x: 50, y: 100, width: 300, height: 300 };
    const blob = await cropAndResize(file, cropArea);

    expect(blob).toBeInstanceOf(Blob);
    expect(mockDrawImage).toHaveBeenCalledWith(
      expect.objectContaining({ width: 800, height: 600 }),
      50,
      100,
      300,
      300,
      0,
      0,
      400,
      400
    );
    expect(mockConvertToBlob).toHaveBeenCalledWith({ type: "image/webp", quality: 0.85 });
    expect(mockClose).toHaveBeenCalled();
  });
});
