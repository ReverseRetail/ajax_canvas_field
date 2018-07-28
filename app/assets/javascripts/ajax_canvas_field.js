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
    path.x = x;
    path.y = y;
    return path;
  }

  addCircle(x, y, data, e, canvas, context, points) {
    new_point = buildCircle(x, y, e, canvas);
    new_point['database_id'] = data.id;
    points.push(new_point);
    redrawAllCircles(canvas, context, points);
  }
}

class Request {
  constructor({ points }) {
    this.points = points.map(p => new Point(p));
  }
}

class CanvasField {
  constructor(canvas, options = {}) {
    this.requests = {};
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.variants = {};
    this.activeRequestId = null;
    const { props } = canvas.dataset;
    if (props) this.importData(props);
    if (!options.readOnly) this.initClickHandlers();
  }

  importData(props) {
    const { requests, variants } = JSON.parse(props);
    this.requests = requests.reduce((acc, requestData) => {
      acc[requestData.id] = new Request(this, requestData);
      return acc;
    }, {});
    this.variants = variants;
    this.activeRequest = Object.keys(this.requests)[0];
  }

  set activeRequest(id) {
    const request = this.requests[id];
    if (!request) throw new Error(`Request with id=${id} not found in data`);
    this.activeRequestId = parseInt(id);
    this.render();
  }

  get activeRequest() {
    if (!this.activeRequestId) return;
    return this.requests[this.activeRequestId];
  }

  get variantOptions() {
    return this.variants;
  }

  addPoint({ x, y, e }) {
    const color = this.colorFromEvent(e);
    const newPoint = new Point({ x, y, color });
    this.points.push(newPoint);
  }

  removePoint(point: Point) {

  }

  colorFromEvent(e) {
    if (!e) return '#ff0000';
    const { left, middle, right } = this.variants;
    switch (e.which) {
      case 1:
        return left.color;
      case 2:
        return middle.color;
      case 3:
        return right.color;
    }
  }

  initClickHandlers(canvas) {
    const { leftActive, middleActive, rightActive } = canvas.dataset;
    const handler = handleClick.bind(null, canvas);
    if (leftActive === 'true') {
      canvas.addEventListener('click', handler, false);
    }
    if (middleActive === 'true') {
      canvas.addEventListener('auxclick', handler, false);
    }
    if (rightActive === 'true') {
      canvas.addEventListener('contextmenu', handler, false);
    }
  }


  handleClick(e) {
    e.preventDefault();
    if (e.type === "contextmenu") return;
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const ctx = this.context;

    this.points.forEach(point => {
      if (ctx.isPointInPath(point.toPath(), x, y, 'nonzero')) {
        this.deletePoint(point);
      } else {
        this.addPoint({ x, y, e })
      }
    });
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.clear();
    const ctx = this.context;
    const { points } = this.activeRequest;
    points.forEach(point => {
      const path = point.toPath();
      ctx.fillStyle = point.color;
      ctx.fill(path, 'nonzero');
      ctx.stroke(path, 'nonzero');
    })
  }
}

class AjaxCanvas {
  renderCircles(canvas, context, points) {
    var initial_data = JSON.parse(find_data_field(canvas).dataset.initialData);
    points = initial_data.map(record => {
      const point = buildCircle(record[1], record[2], record[3], canvas);
      point.database_id = record[0];
      return point;
    })
    redrawAllCircles(canvas, context, points);
    return points;
  }
  refreshAll(canvas, context, points, e) {
    renderCircles(canvas, context, points);
  }
  initCanvas(canvas, dataFields, readOnly = false) {
    const { width, height } = canvas.dataset;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const points = [];
    renderCircles(canvas, context, points);

    if (!readOnly) initClickHandlers(canvas);

    initDataTableEventListeners(dataFields, canvas, context, points);
  }


  chooseButton(e) {
    if (!e) return null;
    switch (e.which) {
      case 1:
        return 'left';
      case 2:
        return 'middle';
      case 3:
        return 'right';
    }
  }

  removeCircle(i, data, canvas, context, points) {
    points.splice(i, 1);
    redrawAllCircles(canvas, context, points);
  }

  collectPostData(x, y, e, canvas, context, points) {
    var params = {};
    var param = canvas.dataset.strongParam;

    var additional_data = JSON.parse(find_data_field(canvas).dataset.additionalData);
    params[param] = {
      x_value: x,
      y_value: y,
      button: chooseButton(e)
    };
    for (var attrname in additional_data) {
      params[param][attrname] = additional_data[attrname];
    }
    return params;
  }

  find_data_field(canvas) {
    var active_datafields = document.getElementsByClassName('active canvas_data_field');
    var fields = document.querySelectorAll('.canvas_field, .ro_canvas_field');
    if (active_datafields.length == 1)
      return active_datafields[0];
    if (fields.length == 1)
      return active_datafields[0];
    var active_id_fields = document.querySelectorAll('.canvas_data_field.active[data-for=' + canvas.id + ']');
    if (active_id_fields.length == 1)
      return active_id_fields[0];
    return active_datafields[0];
  }

  initDataTableEventListeners(dataFields, canvas, context, points) {
    const tableRows = document.querySelectorAll('.request_row');
    tableRows.forEach(requestRow => {
      addEventListener('click', () => {
        dataFields.forEach(el => el.classList.remove('active'));
        tableRows.forEach(el => el.classList.remove('active'));
        requestRow.classList.add('active');
        requestRow.querySelector('.canvas_data_field').classList.add('active');
        refreshAll(canvas, context, points, event);
      })
    })
  }


  initCanvasFields() {
    const canvasFields = document.querySelectorAll('.canvas_field');
    const readOnlyCanvasFields = document.querySelectorAll('.ro_canvas_field');
    if (!canvasFields.length && !readOnlyCanvasFields.length) return;
    const dataFields = document.querySelectorAll('.canvas_data_field');
    const canvasTables = document.querySelectorAll('.canvas_table');
    if (!dataFields.length) {
      console.error('No Data Field found. Please add canvas_data_field in your code!');
      [canvasFields, readOnlyCanvasFields, canvasTables].forEach(set => {
        set.forEach(el => { el.style.display = 'none' });
      });
      return;
    }

    canvasFields.forEach(canvas => {
      initCanvas(canvas, dataFields);
    });

    readOnlyCanvasFields.forEach(canvas => {
      initCanvas(canvas, dataFields, true);
    });
  };

}