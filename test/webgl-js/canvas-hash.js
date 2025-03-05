function canvasHash(canvas, gl) {
  const pixels = new Uint8Array(canvas.width * canvas.height * 4);
  let hash = 0;

  gl.readPixels(
    0,
    0,
    canvas.width,
    canvas.height,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  );

  for (let i = 0; i < pixels.length; i++) {
    const char = pixels[i];
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}

window.canvasHash = canvasHash;
