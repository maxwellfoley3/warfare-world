export function flatBackground(ctx : CanvasRenderingContext2D, color) {
  ctx.fillStyle = color;
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fill();
}