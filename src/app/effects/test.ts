import { Effect } from '../types/effect';

export class TestEffect extends Effect {
  override name = 'Test Effect';
  override draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 50);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 50, 100, 50);
  }
}
