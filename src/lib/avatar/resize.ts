const MAX_SIZE = 400;

/** Pixel-level crop area returned by react-easy-crop's onCropComplete. */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Resizes an image file to MAX_SIZE x MAX_SIZE pixels and returns it as a WebP Blob.
 * Crops to a centered square before resizing.
 */
export async function resizeImageToSquare(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const size = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - size) / 2;
  const sy = (bitmap.height - size) / 2;

  const canvas = new OffscreenCanvas(MAX_SIZE, MAX_SIZE);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, MAX_SIZE, MAX_SIZE);
  bitmap.close();

  return canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
}

/**
 * Crops an image to the given pixel area, then resizes to MAX_SIZE x MAX_SIZE WebP.
 * Used after the user selects a crop region via react-easy-crop.
 */
export async function cropAndResize(file: File, cropArea: CropArea): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const canvas = new OffscreenCanvas(MAX_SIZE, MAX_SIZE);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    bitmap,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    MAX_SIZE,
    MAX_SIZE
  );
  bitmap.close();

  return canvas.convertToBlob({ type: "image/webp", quality: 0.85 });
}
