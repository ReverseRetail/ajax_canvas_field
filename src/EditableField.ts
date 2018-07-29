import { Point, PointData } from './Point';
import CanvasField from './CanvasField';

type VariantData = {
  text: string,
  color: string,
  active: boolean
};

type EditableFieldProps = {
  variants: {
    left: VariantData,
    right: VariantData,
    middle: VariantData
  }
}

export default class EditableField extends CanvasField {
  public variants: { [click: string]: VariantData };
  public points: Point[];

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    const { props } = canvas.dataset;
    this.points = [];
    this.handleClick = this.handleClick.bind(this);
    props && this.importData(props) && this.initClickHandlers();
  }

  importData(props: string) {
    const { variants }: EditableFieldProps = JSON.parse(props);
    this.variants = variants;
    return !!variants;
  }

  initClickHandlers() {
    const canvas = this.canvas;
    const { left, middle, right } = this.variants;
    if (left.active) {
      canvas.addEventListener('click', this.handleClick, false);
    }
    if (middle.active) {
      canvas.addEventListener('auxclick', this.handleClick, false);
    }
    if (right.active) {
      canvas.addEventListener('contextmenu', this.handleClick, false);
    }
  }

  handleClick(e: MouseEvent) {
    e.preventDefault();
    if (e.type === "contextmenu") return;
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const ctx = this.context;

    const existingIndex = this.points.findIndex((point: Point) => {
      return ctx.isPointInPath(point.toPath(), x, y, 'nonzero');
    });
    if (existingIndex === -1) {
      this.addPoint({ x, y, e })
    } else {
      this.removePoint(this.points[existingIndex]);
    }
  }

  colorFromEvent(e: MouseEvent): string {
    const { left, middle, right } = this.variants;
    switch (e.which) {
      case 1: return left.color;
      case 2: return middle.color;
      case 3: return right.color;
      default: return '#ff0000';
    }
  }

  addPoint({ x, y, e, color }: PointData): boolean {
    color = color || this.colorFromEvent(e);
    const newPoint = new Point({ x, y, color });
    this.points.push(newPoint);
    this.drawPoint(newPoint);
    return true;
  }

  removePoint(point: Point): boolean {
    const { x, y } = point;
    const pointIndex = this.points.findIndex((p: Point) => {
      return p.x === x && p.y === y;
    });
    if (!pointIndex) return false;
    this.points.splice(pointIndex, 1);
    return true;
  }

  serialize() {
    return this.points.map(p => p.serialize());
  }

  render() {
    this.clear();
    const ctx = this.context;
    this.points.forEach(point => {
      const path = point.toPath();
      ctx.fillStyle = point.color;
      ctx.fill(path, 'nonzero');
      ctx.stroke(path);
    })
  }
}