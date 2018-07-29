import { Point, PointData } from './Point';
import { RequestHash, RequestData, PostProcessingRequest } from './PostProcessingRequest';

type VariantData = {
  text: string,
  color: string,
  active: boolean
};

type CanvasProps = {
  requests: RequestData[],
  variants: {
    left: VariantData,
    right: VariantData,
    middle: VariantData
  }
};

class CanvasField {
  requests: RequestHash;
  variants: { [click: string]: VariantData };
  context: CanvasRenderingContext2D | null;
  activeRequestId: number | null;

  constructor(private canvas: HTMLCanvasElement, options: any = {}) {
    this.requests = {};
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.variants = {};
    this.activeRequestId = null;
    const { props } = canvas.dataset;
    if (props) this.importData(props);
    if (!options.readOnly) this.initClickHandlers();
  }

  importData(props: string) {
    const { requests, variants }: CanvasProps = JSON.parse(props);
    this.requests = requests.reduce((acc: RequestHash, requestData: RequestData) => {
      acc[requestData.id] = new PostProcessingRequest(requestData);
      return acc;
    }, {});
    this.variants = variants;
    this.setActiveRequest(Number(Object.keys(this.requests)[0]));
  }

  setActiveRequest(id: number) {
    const request = this.requests[id];
    if (!request) throw new Error(`Request with id=${id} not found in data`);
    this.activeRequestId = Number(id);
    this.render();
    return request;
  }

  get activeRequest(): PostProcessingRequest | undefined {
    if (!this.activeRequestId) return;
    return this.requests[this.activeRequestId];
  }

  get variantOptions() {
    return this.variants;
  }

  addPoint({ x, y, e }: PointData) {
    const color = this.colorFromEvent(e);
    const newPoint = new Point({ x, y, color });
    this.activeRequest.points.push(newPoint);
  }

  removePoint(point: Point) {

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

    this.activeRequest.points.forEach(point => {
      if (ctx.isPointInPath(point.toPath(), x, y, 'nonzero')) {
        this.removePoint(point);
      } else {
        this.addPoint({ x, y, })
      }
    });
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.clear();
    const ctx = this.context;
    const request = this.activeRequest;
    if (!request || !ctx) return;
    const points = this.activeRequest.points;
    points.forEach(point => {
      const path = point.toPath();
      ctx.fillStyle = point.color;
      ctx.fill(path, 'nonzero');
      ctx.stroke(path);
    })
  }
}

