document.addEventListener('DOMContentLoaded', function(){
  var canvas = document.getElementById('canvas_field');
  var data_fields = document.getElementsByClassName('canvas_data_field');
  if (canvas) {
    if (data_fields.length == 0) {
      console.log('No Data Field found. Please add canvas_data_field in your code!');
      document.getElementsByClassName('canvas_table')[0].style.display = 'none';
      canvas.style.display = 'none';
    } else {
      canvas.width = canvas.dataset.width;
      canvas.height = canvas.dataset.height;
      var context = canvas.getContext('2d'),
        url = canvas.dataset.url,
        param = canvas.dataset.strongParam,
        token = canvas.dataset.token,
        points = [];

      function refreshAll(e) {
        points = [];
        initCircles();
      }

      function initCircles() {
        var data_field = document.getElementsByClassName('active canvas_data_field')[0].dataset;
        var initialData = JSON.parse(data_field.initialData);
        for (i = 0; i < initialData.length; i++) {
          var point = buildCircle(initialData[i][1], initialData[i][2], initialData[i][3]);
          point.database_id = initialData[i][0];
          points.push(point);
        }
        redrawAllCircles();
      }

      function isPixelCollision(e) {
        e.preventDefault();

        if (e.type == "contextmenu") return;

        var r = canvas.getBoundingClientRect(),
          x = e.clientX - r.left,
          y = e.clientY - r.top,
          removed = false,
          i;

        for (i = points.length - 1; i >= 0; --i) {
          if (context.isPointInPath(points[i], x, y, 'nonzero')) {
            deleteAjax(i);
            removed = true;
          }
        }

        if (removed == false) {
          createAjax(x, y, e);
        }
      }

      function buildCircle(x, y, e) {
        var c = new Path2D(),
          offset = 3.5;

        c.arc(x - offset, y - offset, 7, 0, Math.PI * 2);
        c.color = (typeof e === 'string') ? e : chooseColor(e)
        c.x = x;
        c.y = y;
        return c;
      }

      function chooseColor(e) {
        if (e === null) return '#ff0000';
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
        if (e === null) return null;
        switch (e.which) {
          case 1:
            return 'left';
          case 2:
            return 'middle';
          case 3:
            return 'right';
        }
      }

      function deleteAjax(i) {
        var id = points[i].database_id;
        $.ajax({
          type: 'DELETE',
          url: url + '/' + id,
          headers: {
            'Authorization': 'Token token=' + token
          },
          dataType: "json",
          success: function(data) {
            removeCircle(i, data);
          },
          error: function(data) {
            alert('No connection to Server');
          }
        });
      }

      function removeCircle(i, data) {
        points.splice(i, 1);
        redrawAllCircles();
      }

      function createAjax(x, y, e) {
        post_data = collectPostData(x, y, e);
        $.ajax({
          type: 'POST',
          url: url,
          headers: {
            'Authorization': 'Token token=' + token
          },
          data: post_data,
          dataType: "json",
          success: function(data) {
            addCircle(x, y, data, e);
          },
          error: function(data) {
            alert('No connection to Server');
          }
        });
      }

      function collectPostData(x, y, e) {
        var params = {};
        var data_field = document.getElementsByClassName('active canvas_data_field')[0].dataset;
        var additionalData = JSON.parse(data_field.additionalData);
        params[param] = {
          x_value: x,
          y_value: y,
          button: chooseButton(e)
        };
        for (var attrname in additionalData) {
          params[param][attrname] = additionalData[attrname];
        }
        return params;
      }

      function addCircle(x, y, data, e) {
        new_point = buildCircle(x, y, e);
        new_point['database_id'] = data.id;
        points.push(new_point);
        redrawAllCircles();
      }

      function redrawAllCircles() {
        var tmpData = [];
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < points.length; i++) {
          context.fillStyle = points[i].color;
          context.fill(points[i], 'nonzero');
          context.stroke(points[i], 'nonzero');

          tmpData.push([points[i].database_id, points[i].x, points[i].y, points[i].color]);
        }
        document.getElementsByClassName('active canvas_data_field')[0].dataset.initialData = JSON.stringify(tmpData);
      }

      if (canvas.dataset.leftActive) {
        canvas.addEventListener('click', isPixelCollision, false);
      }
      if (canvas.dataset.middleActive) {
        canvas.addEventListener('auxclick', isPixelCollision, false);
      }
      if (canvas.dataset.rightActive) {
        canvas.addEventListener('contextmenu', isPixelCollision, false);
      }
      initCircles();

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
        refreshAll();
      };

      for (var i = 0; i < tableRows.length; i++) {
        tableRows[i].addEventListener('click', markRequestRow, false);
      }
    }
  }
}, false);
