import { Point, PointData } from './Point';
import { RequestHash, RequestData, PostProcessingRequest } from './PostProcessingRequest';

type CanvasProps = {
  requests: RequestData[]
};

class CanvasField {
  requests: RequestHash;
  context: CanvasRenderingContext2D | null;
  activeRequestId: number | null;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.requests = {};
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.activeRequestId = null;
    const { props } = canvas.dataset;
    if (props) this.importData(props);
  }

  importData(props: string) {
    const { requests }: CanvasProps = JSON.parse(props);
    this.requests = requests.reduce((acc: RequestHash, requestData: RequestData) => {
      acc[requestData.id] = new PostProcessingRequest(requestData);
      return acc;
    }, {});
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

export default CanvasField;
