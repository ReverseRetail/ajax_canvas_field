"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const PostProcessingRequest_1 = require("./PostProcessingRequest");
class CanvasField {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.requests = {};
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.variants = {};
        this.activeRequestId = null;
        const { props } = canvas.dataset;
        if (props)
            this.importData(props);
        if (!options.readOnly)
            this.initClickHandlers();
    }
    importData(props) {
        const { requests, variants } = JSON.parse(props);
        this.requests = requests.reduce((acc, requestData) => {
            acc[requestData.id] = new PostProcessingRequest_1.PostProcessingRequest(requestData);
            return acc;
        }, {});
        this.variants = variants;
        this.setActiveRequest(Number(Object.keys(this.requests)[0]));
    }
    setActiveRequest(id) {
        const request = this.requests[id];
        if (!request)
            throw new Error(`Request with id=${id} not found in data`);
        this.activeRequestId = Number(id);
        this.render();
        return request;
    }
    get activeRequest() {
        if (!this.activeRequestId)
            return;
        return this.requests[this.activeRequestId];
    }
    get variantOptions() {
        return this.variants;
    }
    addPoint({ x, y, e }) {
        const color = this.colorFromEvent(e);
        const newPoint = new Point_1.Point({ x, y, color });
        this.activeRequest.points.push(newPoint);
    }
    removePoint(point) {
    }
    colorFromEvent(e) {
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
    handleClick(e) {
        e.preventDefault();
        if (e.type === "contextmenu")
            return;
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const ctx = this.context;
        this.activeRequest.points.forEach(point => {
            if (ctx.isPointInPath(point.toPath(), x, y, 'nonzero')) {
                this.removePoint(point);
            }
            else {
                this.addPoint({ x, y, });
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
        if (!request || !ctx)
            return;
        const points = this.activeRequest.points;
        points.forEach(point => {
            const path = point.toPath();
            ctx.fillStyle = point.color;
            ctx.fill(path, 'nonzero');
            ctx.stroke(path);
        });
    }
}
