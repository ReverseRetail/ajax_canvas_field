var canvases = document.getElementsByClassName('canvas_field');
if (canvases) {
  for (o = 0; o < canvases.length; o++) {
    var canvas = canvases[o];
    canvas.width = canvas.dataset.width;
    canvas.height = canvas.dataset.height;
    var context = canvas.getContext('2d');
    var points = [];

    function initCircles() {
      var initialData = JSON.parse(canvas.dataset.initialData);
      for (i = 0; i < initialData.length; i++) {
        var point = buildCircle(initialData[i][1], initialData[i][2], initialData[i][3]);
        point.database_id = initialData[i][0];
        points.push(point);
      }
      redrawAllCircles();
    }

    function buildCircle(x, y, e) {
      var c = new Path2D(),
        offset = 3.5;

      c.arc(x - offset, y - offset, 7, 0, Math.PI * 2);
      c.color = (typeof e === 'string') ? e : '#ff0000'
      c.x = x;
      c.y = y;
      return c;
    }

    function redrawAllCircles() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (i = 0; i < points.length; i++) {
        context.fillStyle = points[i].color;
        context.fill(points[i], 'nonzero');
        context.stroke(points[i], 'nonzero');
      }
    }

    initCircles();
  }
}
