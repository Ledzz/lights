import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ScanService } from '../../services/scan.service';
import {
  CalibrationData,
  CalibrationPoint,
  CalibrationSpot,
} from '../../types/effect';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const applyCurve = (imageData: ImageData) => {
  // Apply curve to make image more dark
  const curve = (x: number) => x;
  // const curve = (x: number) => (x > 0.5 ? x * x * x : 0);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = curve(imageData.data[i] / 255) * 255;
    imageData.data[i + 1] = curve(imageData.data[i + 1] / 255) * 255;
    imageData.data[i + 2] = curve(imageData.data[i + 2] / 255) * 255;
  }

  return imageData;
};

function findBrightestSpot(
  imageData: ImageData,
  threshold: number,
): CalibrationSpot | null {
  const { data, width, height } = imageData;

  let brightestSpot: CalibrationSpot | null = null;
  let maxBrightness = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4; // Calculate the index of the current pixel

      // Extract RGB values from the pixel
      const red = data[pixelIndex];
      const green = data[pixelIndex + 1];
      const blue = data[pixelIndex + 2];

      // Calculate brightness (simple sum of RGB values)
      const brightness = red + green + blue;

      // Check if the brightness exceeds the threshold and is greater than the current maximum
      if (brightness > threshold && brightness > maxBrightness) {
        maxBrightness = brightness;
        brightestSpot = { x, y };
      }
    }
  }

  return brightestSpot;
}
function visualizeBrightestSpot(
  ctx: CanvasRenderingContext2D,
  brightestSpot: CalibrationSpot | null,
): void {
  if (brightestSpot) {
    // Draw a marker at the brightest spot
    const markerSize = 10;
    ctx.fillStyle = 'red';
    ctx.fillRect(
      brightestSpot.x - markerSize / 2,
      brightestSpot.y - markerSize / 2,
      markerSize,
      markerSize,
    );
  }
}
const NUM_PIXELS = 9;
const FRAME_DELAY = 0.1;
@Component({
  selector: 'app-calibrate',
  standalone: true,
  imports: [],
  templateUrl: './calibrate.component.html',
  styles: `
  .wrapper {
  transform: scale(0.4);
  transform-origin: top left;
  }
  `,
})
export class CalibrateComponent implements OnInit {
  file?: File;
  @ViewChild('videoRef', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasRef', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('videoCanvasRef', { static: true })
  videoCanvasElement!: ElementRef<HTMLCanvasElement>;

  canvasContext!: CanvasRenderingContext2D;
  videoCanvasContext!: CanvasRenderingContext2D;

  scanService = inject(ScanService);
  ngOnInit() {
    this.canvasContext = this.canvas.nativeElement.getContext('2d')!;
    this.videoCanvasContext =
      this.videoCanvasElement.nativeElement.getContext('2d')!;
  }

  onVideoUpload(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.file = file;
    this.videoElement.nativeElement.src = URL.createObjectURL(file);

    const allWhites = 0;
    const allOff = 2;
    const d1t = 2.5;
    const d2t = 3;
    const d3t = 3.5;

    this.videoElement.nativeElement.addEventListener(
      'canplay',
      async () => {
        // Set canvases size
        const width = this.videoElement.nativeElement.videoWidth;
        const height = this.videoElement.nativeElement.videoHeight;

        this.canvas.nativeElement.width =
          this.videoCanvasElement.nativeElement.width = width!;
        this.canvas.nativeElement.height =
          this.videoCanvasElement.nativeElement.height = height!;

        const allOff = 2.5;
        const first = 2.66;

        const allOffData = applyCurve(await this.getVideoData(allOff));
        const spots: CalibrationData = [];

        for (let i = 0; i < NUM_PIXELS; i++) {
          const data = applyCurve(
            await this.getVideoData(first + i * FRAME_DELAY),
          );
          const diff = this.getDiff(allOffData, data);
          const spot = findBrightestSpot(diff, 200);
          if (spot) {
            spots.push({ index: i, x: spot.x / width, y: spot.y / height });
          }

          // this.canvasContext.putImageData(diff, 0, 0);
          // visualizeBrightestSpot(this.canvasContext, spot);
          // await wait(500);
        }
        console.log(spots);

        // const allWhitesData = applyCurve(await this.getVideoData(allWhites));
        // const allOffData = applyCurve(await this.getVideoData(allOff));
        // const d1 = applyCurve(await this.getVideoData(d1t));
        // const diff = this.getDiff(allOffData, d3);
        // this.canvasContext.putImageData(diff, 0, 0);

        // Set the threshold value for bright spots (adjust as needed)
        // const threshold = 240;
        //
        // // Find bright spots in the image with aspect ratio close to 1
        // const brightSpots = await findCircularBrightSpots(diff, threshold);
        // console.log(brightSpots);
        // // Visualize the filtered bright spots on the canvas
        // visualizeCircularBrightSpots(this.canvasContext, diff, brightSpots);
      },
      { once: true },
    );
  }

  async getVideoData(time: number) {
    return new Promise<ImageData>((resolve) => {
      this.videoElement.nativeElement.addEventListener(
        'timeupdate',
        () => {
          this.videoCanvasContext.drawImage(
            this.videoElement.nativeElement,
            0,
            0,
            this.canvas.nativeElement.width,
            this.canvas.nativeElement.height,
          );

          resolve(
            this.videoCanvasContext.getImageData(
              0,
              0,
              this.canvas.nativeElement.width,
              this.canvas.nativeElement.height,
            ),
          );
        },
        { once: true },
      );
      this.videoElement.nativeElement.currentTime = time;
    });
  }

  getDiff(data1: ImageData, data2: ImageData) {
    const diff = this.canvasContext.createImageData(
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height,
    );

    for (let i = 0; i < diff.data.length; i += 4) {
      diff.data[i] = data2.data[i] - data1.data[i];
      diff.data[i + 1] = data2.data[i + 1] - data1.data[i + 1];
      diff.data[i + 2] = data2.data[i + 2] - data1.data[i + 2];
      diff.data[i + 3] = 255;
    }
    return diff;
  }
}
