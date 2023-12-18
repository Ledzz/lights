import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CalibrationData, Effect, EffectData, Frame } from '../../types/effect';
import { ScanService } from '../../services/scan.service';
import { Effects } from '../../effects';
import { WsService } from '../../services/ws.service';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TMP_DATA: CalibrationData = [
  {
    index: 0,
    x: 0.7152777777777778,
    y: 0.5390625,
  },
  {
    index: 1,
    x: 0.6513888888888889,
    y: 0.528125,
  },
  {
    index: 2,
    x: 0.6361111111111111,
    y: 0.46953125,
  },
  {
    index: 3,
    x: 0.6,
    y: 0.44375,
  },
  {
    index: 4,
    x: 0.5513888888888889,
    y: 0.41484375,
  },
  {
    index: 5,
    x: 0.49583333333333335,
    y: 0.3875,
  },
  {
    index: 6,
    x: 0.4263888888888889,
    y: 0.35234375,
  },
  {
    index: 7,
    x: 0.38055555555555554,
    y: 0.3328125,
  },
  {
    index: 8,
    x: 0.325,
    y: 0.3078125,
  },
];
@Component({
  selector: 'app-effects',
  templateUrl: './effects.component.html',
  styleUrl: './effects.component.scss',
})
export class EffectsComponent {
  effects = Effects.map((c) => new c());
  scanService = inject(ScanService);
  wsService = inject(WsService);

  async select(effect: Effect, calibrationData: CalibrationData = TMP_DATA) {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    const frames: EffectData = {
      duration: effect.duration,
      delay: effect.delay,
      frames: [],
    };

    for (let i = 0; i <= effect.duration; i += effect.delay) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      effect.draw(ctx, i);

      const frame: Frame = [];

      for (const d of calibrationData) {
        const p = ctx.getImageData(
          canvas.width * d.x,
          canvas.height * d.y,
          1,
          1,
        ).data;
        frame.push([d.index, p[0], p[1], p[2]]);
      }
      frames.frames.push(frame);
    }

    for (const frame of frames.frames) {
      const colors = frame.map(([i, r, g, b]) => toHex(r, g, b));
      this.wsService.send(colors);
      await wait(effect.delay);
    }
  }
}

function toHex(...args: [r: number, g: number, b: number]) {
  return args.map((a) => a.toString(16).padStart(2, '0')).join('');
}
