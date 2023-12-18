export abstract class Effect {
  name: string = '';
  duration: number = 0;
  delay: number = 100;
  draw(ctx: CanvasRenderingContext2D, time: number) {}
}

export type Frame = [index: number, r: number, g: number, b: number][];

export type EffectData = {
  duration: number;
  delay: number;
  frames: Frame[];
};

export type CalibrationSpot = {
  x: number;
  y: number;
};

export type CalibrationPoint = CalibrationSpot & {
  index: number;
};

export type CalibrationData = Array<CalibrationPoint>;
