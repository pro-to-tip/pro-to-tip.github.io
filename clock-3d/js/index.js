// December 2005
// inspired by http://www.dataway.ch/~bennet/java/3DClock.html
! function() {
  "use strict";
  // ==== init ====
  var digits = [
      "#####  #  ###########   ##########################     ",
      "#   #  #      #    ##   ##    #        ##   ##   #     ",
      "#   #  #      #    ##   ##    #        ##   ##   #  #  ",
      "#   #  #  ##### ###################    ###########     ",
      "#   #  #  #        #    #    ##   #    ##   #    #  #  ",
      "#   #  #  #        #    #    ##   #    ##   #    #     ",
      "#####  #  ##########    ###########    ###########     "
    ],
    dots = [],
    px = 0,
    py = 0,
    rx = 0,
    ry = 0,
    rz = 1000,
    TM = [],
    Tm = [],
    crx, srx, cry, sry,
    screen = ge1doot.screen.init("canvas", null, true),
    ctx = screen.ctx,
    pointer = screen.pointer.init({
      down: function() {
        pointer.drag.x = px;
        pointer.drag.y = py;
        pointer.end.x = px;
        pointer.end.y = py;
      },
      move: function() {
        var d = Math.max(screen.width, screen.height) * 2;
        px = pointer.drag.x / d;
        py = pointer.drag.y / d;
      }
    });

  // background texture
  var texture = document.createElement('canvas');
  texture.width = screen.width;
  texture.height = screen.height;
  var ict = texture.getContext('2d');
  for (var i = 0; i < screen.width + 5; i += 5) {
    for (var j = 0; j < screen.height + 5; j += 5) {
      ict.beginPath();
      ict.arc(i, j, 2, 0, 2 * Math.PI);
      ict.fillStyle = 'rgb(0,0,0)';
      ict.fill();
      ict.closePath();
    }
  }
  ict.globalCompositeOperation = 'xor';
  ict.beginPath();
  ict.fillStyle = 'rgb(32,32,0)';
  ict.fillRect(0, 0, screen.width, screen.height);
  ict.closePath();
  // HH:MM:SS
  function toc() {
    var t = new Date(),
        h = t.getHours(),
        m = t.getMinutes(),
        s = t.getSeconds();
    TM = [
      Math.floor(h / 10), h % 10,
      Math.floor(m / 10), m % 10,
      Math.floor(s / 10), s % 10
    ];
    var k = 0;
    for (var i = 0; i < 6; i++) {
      if (TM[i] != Tm[i]) {
        Tm[i] = TM[i];
        digit(k, TM[i]);
      }
      k += (i == 1 || i == 3) ? 2 : 1;
    }
  }
  toc();
  setInterval(toc, 1000);
  digit(2, 10);
  digit(5, 10);
  // make digit
  function digit(n, d) {
    for (var i = 0; i < dots.length; i++) {
      if (dots[i].n == n) {
        dots.splice(i--, 1);
      }
    }
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 5; j++) {
        if (digits[i].charAt(5 * d + j) != " ") {
          dots.push(
            new Dot(
              (36 * n + j * 6) / (180 / Math.PI), -84 + i * 24,
              n
            )
          );
        }
      }
    }
  }
  // dot constructor
  function Dot(a, z, n) {
    this.n = n;
    this.a = a;
    this.z = z;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.c = 0;
  }
  // dot 3D calculation
  Dot.prototype.anim = function() {
    var x, y, r, x1, y1, zz, c;
    // z axis rotation
    x = Math.sin(rz + this.a) * 200;
    y = Math.cos(rz + this.a) * 200;
    x1 = y * crx - this.z * srx;
    zz = y * srx + this.z * crx;
    y1 = x * cry - zz * sry;
    zz = x * sry + zz * cry;
    // 2D projection
    r = 500 / (500 + zz);
    this.x = screen.width * 0.5 - x1 / r;
    this.y = screen.height * 0.5 - y1 / r;
    this.w = 4 + (200 + zz) * 0.025;
    this.c = 200 + (zz / 2 | 0);
  }
  // dot painting
  Dot.prototype.plot = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(" + this.c + "," + this.c + ",0)";
    ctx.fill();
  }
  // main loop
  function run() {
    requestAnimationFrame(run);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, screen.width, screen.height);
    rz -= Math.PI / 200;
    rx += px;
    ry += py;
    crx = Math.cos(rx);
    srx = Math.sin(rx);
    cry = Math.cos(ry + Math.PI / 2);
    sry = Math.sin(ry + Math.PI / 2);
    rx *= 0.98;
    ry *= 0.98;
    px *= 0.98;
    py *= 0.98;
    // calculate 3D
    for (var i = 0, dot; dot = dots[i++];) {
      dot.anim();
    }
    // z-index sorting
    dots.sort(function(p0, p1) {
      return p0.w - p1.w;
    });
    // draw plots
    for (var i = 0, dot; dot = dots[i++];) {
      dot.plot();
    }
    ctx.drawImage(texture, 0, 0);
  }
  requestAnimationFrame(run);
}();