"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
class PostProcessingRequest {
    constructor({ points }) {
        this.points = points.map((p) => new Point_1.Point(p));
    }
}
exports.PostProcessingRequest = PostProcessingRequest;
