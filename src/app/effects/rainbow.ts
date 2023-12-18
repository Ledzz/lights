import { Effect } from '../types/effect';

const speedMultiplier = 50;
const canvasHeight = 100;
const rainbowHeight = canvasHeight / 7;
const steps = 20;
const saturation = 100;
const lightness = 50;
const timePerCycle = (360 * steps) / (speedMultiplier * 7);

export class Rainbow extends Effect {
  override name = 'Rainbow';
  override duration: number =
    (canvasHeight / rainbowHeight) * timePerCycle * this.delay;

  override draw(ctx: CanvasRenderingContext2D, time: number) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < steps; j++) {
        const progress = j / steps;
        const hue =
          ((time / 1000) * speedMultiplier + i * 30 + progress * 30) % 360;
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        const startY = i * rainbowHeight + progress * rainbowHeight;
        const endY = i * rainbowHeight + (progress + 1 / steps) * rainbowHeight;

        const gradient = ctx.createLinearGradient(0, startY, 0, endY);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, startY, ctx.canvas.width, endY - startY);
      }
    }
  }
}
