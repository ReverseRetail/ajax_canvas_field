import { Point, PointData } from './Point';

type RequestHash = {
  [index: number]: PostProcessingRequest
}

type RequestData = {
  id: number,
  points: PointData[]
};

class PostProcessingRequest {
  public points: Point[];
  constructor({ points }: RequestData) {
    this.points = points.map((p: PointData) => new Point(p));
  }
}

export { RequestHash, RequestData, PostProcessingRequest };