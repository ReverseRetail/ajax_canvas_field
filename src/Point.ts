type PointData = {
  x: number,
  y: number,
  color?: string,
  e?: MouseEvent,
  id?: number
}

class Point {
  x: number;
  y: number;
  color: string;
  offset: number;
  id?: number;

  constructor({ x, y, color, id }: PointData) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.offset = 3.5;
    this.id = id;
  }

  toPath() {
    const { x, y, offset } = this;

    let path = new Path2D();
    path.arc(x - offset, y - offset, offset * 2, 0, Math.PI * 2);
    return path;
  }
}

export { Point, PointData };