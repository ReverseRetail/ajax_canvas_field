function refreshAll(canvas, context, points, e) {
  points = [];
  initCircles(canvas, context, points);
}

function initCircles(canvas, context, points) {
  var initial_data = JSON.parse(find_data_field(canvas).dataset.initialData);
  for (i = 0; i < initial_data.length; i++) {
    var point = buildCircle(initial_data[i][1], initial_data[i][2], initial_data[i][3], canvas);
    point.database_id = initial_data[i][0];
    points.push(point);
  }
  redrawAllCircles(canvas, context, points);
  return points;
}

function isPixelCollision(canvas, e) {
  e.preventDefault();
  if (e.type == "contextmenu")
    return;
  var r = canvas.getBoundingClientRect(),
    context = canvas.getContext('2d'),
    points = [],
    x = e.clientX - r.left,
    y = e.clientY - r.top,
    removed = false,
    i;

  points = initCircles(canvas, context, points);
  for (i = points.length - 1; i >= 0; --i) {
    if (context.isPointInPath(points[i], x, y, 'nonzero')) {
      deleteAjax(i, canvas, context, points);
      removed = true;
    }
  }

  if (removed == false) {
    createAjax(x, y, e, canvas, context, points);
  }
}

function buildCircle(x, y, e, canvas) {
  var c = new Path2D(),
    offset = 3.5;

  c.arc(x - offset, y - offset, 7, 0, Math.PI * 2);
  c.color = (typeof e === 'string')
    ? e
    : chooseColor(e, canvas);
  c.x = x;
  c.y = y;
  return c;
}

function chooseColor(e, canvas) {
  if (e === null)
    return '#ff0000';
  switch (e.which) {
    case 1:
      return canvas.dataset.leftColor;
    case 2:
      return canvas.dataset.middleColor;
    case 3:
      return canvas.dataset.rightColor;
  }
}

function chooseButton(e) {
  if (e === null)
    return null;
  switch (e.which) {
    case 1:
      return 'left';
    case 2:
      return 'middle';
    case 3:
      return 'right';
  }
}

function deleteAjax(i, canvas, context, points) {
  var id = points[i].database_id;
  $.ajax({
    type: 'DELETE',
    url: canvas.dataset.url + '/' + id,
    headers: {
      'Authorization': 'Token token=' + canvas.dataset.token
    },
    dataType: "json",
    success: function(data) {
      removeCircle(i, data, canvas, context, points);
    },
    error: function(data) {
      alert('No connection to Server');
    }
  });
}

function removeCircle(i, data, canvas, context, points) {
  points.splice(i, 1);
  redrawAllCircles(canvas, context, points);
}

function createAjax(x, y, e, canvas, context, points) {
  post_data = collectPostData(x, y, e, canvas, context, points);
  $.ajax({
    type: 'POST',
    url: canvas.dataset.url,
    headers: {
      'Authorization': 'Token token=' + canvas.dataset.token
    },
    data: post_data,
    dataType: "json",
    success: function(data) {
      addCircle(x, y, data, e, canvas, context, points);
    },
    error: function(data) {
      alert('No connection to Server');
    }
  });
}

function collectPostData(x, y, e, canvas, context, points) {
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

function find_data_field(canvas) {
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

function addCircle(x, y, data, e, canvas, context, points) {
  new_point = buildCircle(x, y, e, canvas);
  new_point['database_id'] = data.id;
  points.push(new_point);
  redrawAllCircles(canvas, context, points);
}

function redrawAllCircles(canvas, context, points) {
  var tmpData = [];
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < points.length; i++) {
    context.fillStyle = points[i].color;
    context.fill(points[i], 'nonzero');
    context.stroke(points[i], 'nonzero');

    tmpData.push([
      points[i].database_id,
      points[i].x,
      points[i].y,
      points[i].color
    ]);
  }
  find_data_field(canvas).dataset.initialData = JSON.stringify(tmpData);
}

function handle_data_table(data_fields, canvas, context, points) {
  var tableRows = document.getElementsByClassName('request_row');
  var markRequestRow = function() {
    for (var i = 0; i < tableRows.length; i++) {
      tableRows[i].classList.remove('active');
    }
    for (var i = 0; i < data_fields.length; i++) {
      data_fields[i].classList.remove('active');
    }
    this.classList.add('active');
    this.getElementsByClassName('canvas_data_field')[0].classList.add('active');
    refreshAll(canvas, context, points, event);
  };

  for (var i = 0; i < tableRows.length; i++) {
    tableRows[i].addEventListener('click', markRequestRow, false);
  }
}

var start_with_canvas_fields = function() {
  var canvas_fields = document.getElementsByClassName('canvas_field');
  var ro_canvas_fields = document.getElementsByClassName('ro_canvas_field');
  var data_fields = document.getElementsByClassName('canvas_data_field');
  if (canvas_fields.length == 0 && ro_canvas_fields.length == 0) {
    return;
  }
  if (data_fields.length == 0) {
    console.log('No Data Field found. Please add canvas_data_field in your code!');
    for (o = 0; o < canvas_table.length; o++) {
      document.getElementsByClassName('canvas_table')[o].style.display = 'none';
    }
    for (o = 0; o < canvas_fields.length; o++) {
      document.getElementsByClassName('canvas_fields')[o].style.display = 'none';
    }
    for (o = 0; o < ro_canvas_fields.length; o++) {
      document.getElementsByClassName('ro_canvas_fields')[o].style.display = 'none';
    }
    return;
  }

  for (o = 0; o < canvas_fields.length; o++) {
    var canvas = canvas_fields[o];
    canvas.width = canvas.dataset.width;
    canvas.height = canvas.dataset.height;
    var context = canvas.getContext('2d');
    var points = [];
    if (canvas.dataset.leftActive == 'true') {
      canvas.addEventListener('click', function() {
        isPixelCollision(this, event)
      }, false);
    }
    if (canvas.dataset.middleActive == 'true') {
      canvas.addEventListener('auxclick', function() {
        isPixelCollision(this, event)
      }, false);
    }
    if (canvas.dataset.rightActive == 'true') {
      canvas.addEventListener('contextmenu', function() {
        isPixelCollision(this, event)
      }, false);
    }
    initCircles(canvas, context, points);

    handle_data_table(data_fields, canvas, context, points);
  }

  for (o = 0; o < ro_canvas_fields.length; o++) {
    var canvas = ro_canvas_fields[o];
    canvas.width = canvas.dataset.width;
    canvas.height = canvas.dataset.height;
    var context = canvas.getContext('2d');
    var points = [];
    initCircles(canvas, context, points);

    handle_data_table(data_fields, canvas, context, points);
  }
};

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  start_with_canvas_fields();
} else {
  document.addEventListener("DOMContentLoaded", start_with_canvas_fields);
}
