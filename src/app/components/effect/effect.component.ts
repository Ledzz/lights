import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Effect } from '../../types/effect';

@Component({
  selector: 'app-effect',
  templateUrl: './effect.component.html',
  styleUrl: './effect.component.scss',
})
export class EffectComponent implements OnInit, OnDestroy {
  @Input() effect!: Effect;

  @ViewChild('canvasRef', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  interval?: number;

  ngOnInit() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;

    this.interval = setInterval(() => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.effect.draw(ctx, performance.now());
    }, this.effect.delay);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
