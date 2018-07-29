import { Point, PointData } from './Point';
import CanvasField from './CanvasField';
import { RequestHash, RequestData, PostProcessingRequest } from './PostProcessingRequest';

type CanvasProps = {
  requests: RequestData[]
};

export default class ReadOnlyField extends CanvasField {
  public requests: RequestHash;
  public activeRequestId: number | null;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.requests = {};
    this.activeRequestId = null;
    this.importData(this.canvas.dataset.props);
    this.initializeRowClickListeners();
    this.highlightActiveRow();
  }

  setActiveRequest(id: number | string) {
    if (this.activeRequestId === Number(id)) return;
    const request = this.requests[id];
    if (!request) throw new Error(`Request with id=${id} not found in data`);
    this.activeRequestId = Number(id);
    this.render();
    return request;
  }

  highlightActiveRow() {
    if (!this.activeRequestId) return;
    const activeRow = document.getElementById(`request_row_${this.activeRequestId}`);
    document.querySelectorAll('.request-row').forEach(el => {
      el.classList.toggle('is-active', el === activeRow);
    });
  }

  initializeRowClickListeners() {
    const ids = Object.keys(this.requests);
    ids.forEach(id => {
      const row = document.getElementById(`request_row_${id}`);
      row && row.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActiveRequest(id);
        this.highlightActiveRow();
      })
    })
  }

  render() {
    this.clear();
    const request = this.requests[this.activeRequestId];
    if (!request) return;
    request.points.forEach(point => {
      this.drawPoint(point);
    })
  }

  importData(props: string) {
    const { requests }: CanvasProps = JSON.parse(props);
    this.requests = requests.reduce((acc: RequestHash, requestData: RequestData) => {
      acc[requestData.id] = new PostProcessingRequest(requestData);
      return acc;
    }, {});
    this.setActiveRequest(Number(Object.keys(this.requests)[0]));
  }
}