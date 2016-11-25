(function() {
  var $clock, Clock, clock,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Clock = (function() {
    Clock.prototype.ctx = null;

    Clock.prototype.raf = null;

    Clock.prototype.canvasHeight = 0;

    Clock.prototype.canvasWidth = 0;

    Clock.prototype.centerX = 0;

    Clock.prototype.centerY = 0;

    Clock.prototype.milliDirection = false;

    Clock.prototype.date = null;

    function Clock($context) {
      this.$context = $context;
      this.animate = bind(this.animate, this);
      this.ctx = this.$context.get(0).getContext("2d");
      this.canvasHeight = this.$context.height();
      this.canvasWidth = this.$context.width();
      this.centerX = this.canvasWidth / 2;
      this.centerY = this.canvasHeight / 2;
      this.animate();
      return;
    }

    Clock.prototype.animate = function() {
      var radians, time;
      this.$context[0].height = this.canvasHeight;
      this.$context[0].width = this.canvasWidth;
      time = this.getTimeObj();
      radians = this.getRadians(time);
      this.drawCircle(70, 10, radians.milliRad, this.milliDirection);
      this.drawCircle(88, 10, radians.minutesRad, false);
      this.drawCircle(106, 10, radians.hoursRad, false);
      this.printTime(time);
      return this.raf = requestAnimationFrame(this.animate);
    };

    Clock.prototype.drawCircle = function(radius, width, endAngle, direction) {
      var startAngle, x, y;
      startAngle = 0;
      x = 0;
      y = 0;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.lineWidth = width;
      this.ctx.strokeStyle = "#fff";
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(-90 * (Math.PI / 180));
      this.ctx.arc(x, y, radius, startAngle, endAngle, direction);
      this.ctx.stroke();
      this.ctx.closePath();
      return this.ctx.restore();
    };

    Clock.prototype.getTimeObj = function() {
      var date, time;
      date = new Date();
      time = {
        milliseconds: date.getMilliseconds(),
        seconds: date.getSeconds(),
        minutes: date.getMinutes(),
        hours: date.getHours()
      };
      return time;
    };

    Clock.prototype.getRadians = function(time) {
      var hours, hoursDegrees, hoursRadians, milliDegrees, milliRadians, minutesDegrees, minutesRadians, ref;
      milliDegrees = this.map(time.milliseconds, 0, 1000, 0, 360);
      milliRadians = (milliDegrees * Math.PI) / 180;
      minutesDegrees = this.map(time.minutes, 0, 60, 0, 360);
      minutesRadians = (minutesDegrees * Math.PI) / 180;
      hours = time.hours;
      if (hours > 12) {
        hours -= 12;
      }
      hoursDegrees = this.map(hours, 0, 12, 0, 360);
      hoursRadians = (hoursDegrees * Math.PI) / 180;
      if ((((ref = this.angles) != null ? ref.milliDeg : void 0) - milliDegrees) > 100) {
        if (this.milliDirection) {
          this.milliDirection = false;
        } else {
          this.milliDirection = true;
        }
      }
      return this.angles = {
        milliRad: milliRadians,
        milliDeg: milliDegrees,
        minutesRad: minutesRadians,
        minutesDeg: minutesDegrees,
        hoursRad: hoursRadians,
        hoursDeg: hoursDegrees
      };
    };

    Clock.prototype.printTime = function(time) {
      var hours, minutes, seconds, textWidth, timeStr;
      hours = time.hours < 10 ? "0" + time.hours : time.hours;
      minutes = time.minutes < 10 ? "0" + time.minutes : time.minutes;
      seconds = time.seconds < 10 ? "0" + time.seconds : time.seconds;
      timeStr = hours + " " + minutes + " " + seconds;
      this.ctx.fillStyle = "#5E81A8";
      this.ctx.font = "3.5vw Verdana";
      textWidth = this.ctx.measureText(timeStr);
      return this.ctx.fillText(timeStr, this.centerX - textWidth.width / 2, this.centerY + 7);
    };

    Clock.prototype.map = function(value, low1, high1, low2, high2) {
      return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    };

    return Clock;

  })();

  $clock = $("#clock");

  clock = new Clock($clock);

  (function() {
    var browserRaf, canceled, i, len, ref, targetTime, vendor, w;
    w = window;
    ref = ['ms', 'moz', 'webkit', 'o'];
    for (i = 0, len = ref.length; i < len; i++) {
      vendor = ref[i];
      if (w.requestAnimationFrame) {
        break;
      }
      w.requestAnimationFrame = w[vendor + "RequestAnimationFrame"];
      w.cancelAnimationFrame = w[vendor + "CancelAnimationFrame"] || w[vendor + "CancelRequestAnimationFrame"];
    }
    if (w.requestAnimationFrame) {
      if (w.cancelAnimationFrame) {
        return;
      }
      browserRaf = w.requestAnimationFrame;
      canceled = {};
      w.requestAnimationFrame = function(callback) {
        var id;
        return id = browserRaf(function(time) {
          if (id in canceled) {
            return delete canceled[id];
          } else {
            return callback(time);
          }
        });
      };
      return w.cancelAnimationFrame = function(id) {
        return canceled[id] = true;
      };
    } else {
      targetTime = 0;
      w.requestAnimationFrame = function(callback) {
        var currentTime;
        targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
        return w.setTimeout((function() {
          return callback(+(new Date));
        }), targetTime - currentTime);
      };
      return w.cancelAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();

}).call(this);
