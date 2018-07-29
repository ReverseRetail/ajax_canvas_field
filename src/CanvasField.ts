import { Point } from "./Point";
class CanvasField {
  context: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  drawPoint(point: Point) {
    const path = point.toPath();
    this.context.fillStyle = point.color;
    this.context.fill(path, 'nonzero');
    this.context.stroke(path);
    return true;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CanvasField;
