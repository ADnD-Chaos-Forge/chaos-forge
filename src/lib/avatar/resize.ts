const MAX_SIZE = 400;

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
