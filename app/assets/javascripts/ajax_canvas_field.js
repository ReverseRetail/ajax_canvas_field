(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AjaxCanvasField"] = factory();
	else
		root["AjaxCanvasField"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = ".";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./CanvasField.ts":
/*!************************!*\
  !*** ./CanvasField.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CanvasField {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    drawPoint(point) {
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
exports.default = CanvasField;


/***/ }),

/***/ "./EditableField.ts":
/*!**************************!*\
  !*** ./EditableField.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = __webpack_require__(/*! ./Point */ "./Point.ts");
const CanvasField_1 = __importDefault(__webpack_require__(/*! ./CanvasField */ "./CanvasField.ts"));
class EditableField extends CanvasField_1.default {
    constructor(canvas) {
        super(canvas);
        const { props } = canvas.dataset;
        this.points = [];
        this.handleClick = this.handleClick.bind(this);
        props && this.importData(props) && this.initClickHandlers();
    }
    importData(props) {
        const { variants } = JSON.parse(props);
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
    handleClick(e) {
        e.preventDefault();
        if (e.type === "contextmenu")
            return;
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const ctx = this.context;
        const existingIndex = this.points.findIndex((point) => {
            return ctx.isPointInPath(point.toPath(), x, y, 'nonzero');
        });
        if (existingIndex === -1) {
            this.addPoint({ x, y, e });
        }
        else {
            this.removePoint(this.points[existingIndex]);
        }
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
    addPoint({ x, y, e, color }) {
        color = color || this.colorFromEvent(e);
        const newPoint = new Point_1.Point({ x, y, color });
        this.points.push(newPoint);
        this.drawPoint(newPoint);
        return true;
    }
    removePoint(point) {
        const { x, y } = point;
        const pointIndex = this.points.findIndex((p) => {
            return p.x === x && p.y === y;
        });
        if (!pointIndex)
            return false;
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
        });
    }
}
exports.default = EditableField;


/***/ }),

/***/ "./Point.ts":
/*!******************!*\
  !*** ./Point.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
    serialize() {
        const { x, y, color } = this;
        return { x_value: x, y_value: y, color };
    }
    toPath() {
        const { x, y, offset } = this;
        let path = new Path2D();
        path.arc(x - offset, y - offset, offset * 2, 0, Math.PI * 2);
        return path;
    }
}
exports.Point = Point;


/***/ }),

/***/ "./PostProcessingRequest.ts":
/*!**********************************!*\
  !*** ./PostProcessingRequest.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = __webpack_require__(/*! ./Point */ "./Point.ts");
class PostProcessingRequest {
    constructor({ points }) {
        this.points = points.map((p) => new Point_1.Point(p));
    }
}
exports.PostProcessingRequest = PostProcessingRequest;


/***/ }),

/***/ "./ReadOnlyField.ts":
/*!**************************!*\
  !*** ./ReadOnlyField.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasField_1 = __importDefault(__webpack_require__(/*! ./CanvasField */ "./CanvasField.ts"));
const PostProcessingRequest_1 = __webpack_require__(/*! ./PostProcessingRequest */ "./PostProcessingRequest.ts");
class ReadOnlyField extends CanvasField_1.default {
    constructor(canvas) {
        super(canvas);
        this.requests = {};
        this.activeRequestId = null;
        this.importData(this.canvas.dataset.props);
        this.initializeRowClickListeners();
        this.highlightActiveRow();
    }
    setActiveRequest(id) {
        if (this.activeRequestId === Number(id))
            return;
        const request = this.requests[id];
        if (!request)
            throw new Error(`Request with id=${id} not found in data`);
        this.activeRequestId = Number(id);
        this.render();
        return request;
    }
    highlightActiveRow() {
        if (!this.activeRequestId)
            return;
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
            });
        });
    }
    render() {
        this.clear();
        const request = this.requests[this.activeRequestId];
        if (!request)
            return;
        request.points.forEach(point => {
            this.drawPoint(point);
        });
    }
    importData(props) {
        const { requests } = JSON.parse(props);
        this.requests = requests.reduce((acc, requestData) => {
            acc[requestData.id] = new PostProcessingRequest_1.PostProcessingRequest(requestData);
            return acc;
        }, {});
        this.setActiveRequest(Number(Object.keys(this.requests)[0]));
    }
}
exports.default = ReadOnlyField;


/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = __webpack_require__(/*! ./Point */ "./Point.ts");
exports.Point = Point_1.Point;
const PostProcessingRequest_1 = __webpack_require__(/*! ./PostProcessingRequest */ "./PostProcessingRequest.ts");
exports.PostProcessingRequest = PostProcessingRequest_1.PostProcessingRequest;
const ReadOnlyField_1 = __importDefault(__webpack_require__(/*! ./ReadOnlyField */ "./ReadOnlyField.ts"));
exports.ReadOnlyField = ReadOnlyField_1.default;
const EditableField_1 = __importDefault(__webpack_require__(/*! ./EditableField */ "./EditableField.ts"));
exports.EditableField = EditableField_1.default;


/***/ })

/******/ });
});
//# sourceMappingURL=ajax_canvas_field.js.map