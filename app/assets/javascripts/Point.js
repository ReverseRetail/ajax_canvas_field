"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor({ x, y, color, id }) {
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
exports.Point = Point;
