"use strict";

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function Background(ctx) {
  this.ctx = ctx;
  this.x = 0;
  this.y = 0;
  this.bgPic = new Image();
  this.treePic = new Image();
  this.bgPic.src = './images/city-bg.png';
  this.treePic.src = './images/tree-bg.png';
}

Background.prototype.drawBackGround = function () {
  this.ctx.save();
  this.ctx.translate(0, 200);
  this.ctx.drawImage(this.bgPic, 0, -50, 420, 300);
  this.ctx.drawImage(this.treePic, 0, 0, 2048, 512, 0, 150, 422, 130);
  this.ctx.restore();
};

var giftBox = './images/quanminlogo.png';
var quanminImg = new Image();
var haokan = new Image();
var fanle = new Image();
var nuomi = new Image();
quanminImg.src = './images/quanminlogo.png';
haokan.src = './images/haokanlogo.png';
fanle.src = './images/fanlelogo.png';
nuomi.src = './images/nuomilogo.png';
var boxImgPool = [quanminImg, haokan, fanle, nuomi];

var genrateBox = function genrateBox(index) {
  return boxImgPool[index % 4];
};

function GiftBox(ctx, carSafe, ctx2) {
  this.ctx = ctx;
  this.ctx2 = ctx2;
  this.giftBox = [quanminImg];
  this.y = [];
  this.x = [];
  this.num = 10;
  this.giftHeight = [];
  this.falledList = [];
  this.isHanging = [];
  this.fallingList = [];
  this.startY = 160;
  this.initHangingY = 495;
  this.failedList = [];
  this.carSafe = carSafe;
  this.textX = carSafe[1];
  this.giftWid = 50;
  this.giftHei = 50;
  this.successNum = 0;
  this.fallRotateSpeed = 45;
  this.acceleration = 10 * 90;
  this.deltaTime = 0;
  this.growBgAcce = 0.1;
  this.fallBaseLine = 50;
  this.heartDisabled = [];
  this.score = 0;
  this.init();
}

GiftBox.prototype.init = function () {
  this.born();
  this.giftBox[0].src = giftBox;
};

GiftBox.prototype.born = function (y) {
  if (y === undefined) y = this.startY;
  this.y.push(y);
  this.failedList.push(false);
  var difference = this.initHangingY - (this.y.length - 1) * this.fallBaseLine;
  this.giftHeight.push(difference);
  this.giftBox.push(new Image());

  for (var i = 0; i < this.y.length; i++) {
    this.falledList[i] = true;
    this.isHanging[i] = false;
    this.fallingList[i] = false;
    this.giftBox[i] = genrateBox(i);

    if (i === this.y.length - 1) {
      this.isHanging[i] = true;
      this.falledList[i] = false;
    }
  }
};

GiftBox.prototype.animate = function (time, drawGiftY, easing) {
  var _this2 = this;

  var start = Date.now();
  var reAni;

  var loop = function loop() {
    var passed = Date.now() - start;

    if (passed < time * 1000) {
      drawGiftY(easing(passed / 1000));
      reAni = window.requestAnimFrame(loop.bind(_this2));
    } else {
      window.cancelAnimationFrame(reAni);

      _this2.filterFailedBox();

      _this2.born();

      _this2.growthBackground(_this2.y.length - 1);
    }
  };

  reAni = window.requestAnimFrame(loop.bind(this));
};

GiftBox.prototype.growthBackground = function (index) {
  var _this3 = this;

  if (this.giftHeight[index] < 350) {
    var time = Date.now();
    var growthAni;
    var growthHeight = 0;

    var growthBgLoop = function growthBgLoop() {
      if (growthHeight < 128) {
        var pass = Date.now() - time;
        time = Date.now();
        var grow = _this3.growBgAcce * pass;
        growthHeight += grow;

        _this3.ctx2.translate(0, grow);

        _this3.giftHeight = _this3.giftHeight.map(function (el) {
          return el + grow;
        });
        _this3.initHangingY += grow;
        growthAni = window.requestAnimFrame(growthBgLoop.bind(_this3));
      } else {
        window.cancelAnimationFrame(growthAni);
      }
    };

    growthAni = window.requestAnimFrame(growthBgLoop.bind(this));
  }
};

GiftBox.prototype.filterFailedBox = function () {
  var index = this.failedList.findIndex(function (e) {
    return e;
  });

  if (index > -1) {
    this.spliceFailed(index);
  }
};

GiftBox.prototype.spliceFailed = function (index) {
  this.y.splice(index, 1);
  this.x.splice(index, 1);
  this.falledList.splice(index, 1);
  this.isHanging.splice(index, 1);
  this.fallingList.splice(index, 1);
  this.giftHeight.splice(index, 1);
  this.failedList.splice(index, 1);
};

GiftBox.prototype.draw = function (fallY) {
  if (fallY === undefined) {
    fallY = 0;
  }

  for (var i = 0; i < this.y.length; i++) {
    if (this.fallingList[i]) {
      this.ctx.drawImage(this.giftBox[i], this.x[i], fallY, this.giftWid, this.giftHei);
    }
  }
};

GiftBox.prototype.hangingDraw = function (fallY, boxX, deltaTime, lastTime) {
  var _this4 = this;

  if (fallY === undefined) {
    fallY = 0;
  }

  if (boxX === undefined) {
    boxX = 182;
  }

  var _loop = function _loop(i) {
    if (_this4.isHanging[i]) {
      _this4.x[i] = boxX;

      _this4.ctx.drawImage(_this4.giftBox[i], _this4.x[i], fallY, _this4.giftWid, _this4.giftHei);
    }

    if (_this4.falledList[i] && !_this4.failedList[i]) {
      _this4.boxCollision(i, function () {
        _this4.ctx.drawImage(_this4.giftBox[i], _this4.x[i], _this4.giftHeight[i], _this4.giftWid, _this4.giftHei);
      }, deltaTime, lastTime);
    }
  };

  for (var i = 0; i < this.y.length; i++) {
    _loop(i);
  }

  if (this.isRotateFalling) {
    this.score = this.y.length - 2;
    this.drawScore(this.y.length - 2);
  } else {
    this.score = this.y.length - 1;
    this.drawScore(this.y.length - 1);
  }
};

GiftBox.prototype.drawScore = function (score) {
  this.ctx.font = '24px STheiti, SimHei';
  this.ctx.fillStyle = 'rgb(255, 3, 23)';
  this.ctx.fillText("\u5F97\u5206\uFF1A".concat(score), this.textX + this.giftWid + 20, this.giftHei);
};

GiftBox.prototype.checkIsOutCar = function (heig) {
  var index = this.x.length - 1;
  var x = this.x[index];

  if (x < this.carSafe[0] || x > this.carSafe[1]) {
    this.failedList[index] = true;
    this.heartDisabled.push(index);
    return 800;
  }

  this.carSafe = [x - this.giftWid, x + this.giftWid];
  return heig;
};

GiftBox.prototype.boxCollision = function (i, drawImage, deltaTime) {
  var rotateDir = 1;

  if (i > 0 && !this.failedList[i]) {
    var boxCenter = this.getCenter(this.x[i], this.giftHeight[i]);
    var difference = this.x[i] - this.x[i - 1];

    if (difference > this.giftWid / 2) {
      rotateDir = 1;
      this.failedRotateFall(rotateDir, boxCenter, drawImage, deltaTime, i);
    } else if (difference < -(this.giftWid / 2)) {
      rotateDir = -1;
      this.failedRotateFall(rotateDir, boxCenter, drawImage, deltaTime, i);
    } else {
      drawImage();
    }
  } else {
    drawImage();
  }
};

GiftBox.prototype.getCenter = function (sx, sy) {
  return {
    x: sx + this.giftWid / 2,
    y: sy + this.giftHei / 2
  };
};

GiftBox.prototype.failedRotateFall = function (rotateDir, boxCenter, drawImage, deltaTime, i) {
  this.ctx.save();
  this.ctx.translate(boxCenter.x, boxCenter.y);
  this.fallRotateSpeed = deltaTime / 10 + this.fallRotateSpeed;
  var rotateDeg = this.fallRotateSpeed * rotateDir;
  rotateDeg = rotateDeg > 85 ? 85 : rotateDeg;
  rotateDeg = rotateDeg < -85 ? -85 : rotateDeg;
  this.ctx.rotate(rotateDeg * Math.PI / 180);
  this.ctx.translate(-boxCenter.x, -boxCenter.y);
  this.x[i] += rotateDir * 0.5;
  this.giftHeight[i] += this.getFallHeight(0, this.acceleration * 30)(deltaTime / 1000);
  this.ctx.drawImage(this.giftBox[i], this.x[i], this.giftHeight[i], this.giftWid, this.giftHei);
  this.ctx.restore();
  this.isRotateFalling = true;

  if (this.x[i] < 0 || this.giftHeight[i] > 700) {
    this.heartDisabled.push(i);
    this.isRotateFalling = false;
    this.failedList[i] = true;
    this.spliceFailed(i);
    this.giftHeight[i] += this.fallBaseLine;
    this.carSafe = [this.x[i - 1] - this.giftWid, this.x[i - 1] + this.giftWid];
  }
};

GiftBox.prototype.getFallTime = function (height, a) {
  return Math.sqrt(2 * (this.checkIsOutCar(height) - this.startY) / a);
};

GiftBox.prototype.getFallHeight = function () {
  var startY = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.startY;
  var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.acceleration;

  if (startY === undefined) {
    startY = this.startY;
  }

  if (a === undefined) {
    a = this.acceleration;
  }

  return function (easingPassedTime) {
    return 1 / 2 * a * easingPassedTime ** 2 + startY;
  };
};

GiftBox.prototype.fall = function (height, a) {
  var _this5 = this;

  if (height === undefined) {
    height = this.giftHeight[this.giftHeight.length - 1];
  }

  if (a === undefined) {
    a = this.acceleration;
  }

  if (height > this.startY) {
    this.isHanging[this.isHanging.length - 1] = false;
    this.fallingList[this.fallingList.length - 1] = true;
    var time = this.getFallTime(height, a);
    this.animate(time, function (fallY) {
      _this5.draw(fallY);
    }, this.getFallHeight());
  }
};

var giftCar = './images/gift-car.png';

function GiftCar(ctx) {
  this.ctx = ctx;
  this.giftCar = new Image();
  this.y = 500;
  this.x = 0;
  this.giftCar.src = giftCar;
}

GiftCar.prototype.draw = function (carLeft, carWid) {
  this.ctx.drawImage(this.giftCar, carLeft, 500, carWid, 85);
};

var hanger = './images/hanger.png';

function Hanger(ctx) {
  this.ctx = ctx;
  this.rangeX = [80, 260];
  this.speed = 0.1;
  this.hangerBg = new Image();
  this.x = 182;
  this.directration = 1;
  this.hangerBg.src = hanger;
}

Hanger.prototype.hangingHook = function (deltaTime) {
  if (this.x < this.rangeX[0]) {
    this.x = this.rangeX[0];
    this.directration = 1;
  }

  if (this.x > this.rangeX[1]) {
    this.x = this.rangeX[1];
    this.directration = -1;
  }

  this.x += this.speed * deltaTime * this.directration;
  this.ctx.drawImage(this.hangerBg, this.x, 10, 40, 150);
  return [this.x, 10 + 150];
};

var activeHeartImg = new Image();
var disabledHeartImg = new Image();
activeHeartImg.src = './images/active-heart.png';
disabledHeartImg.src = './images/disable-heart.png';

function Hearts(ctx, heartNum) {
  this.ctx = ctx;
  this.heartsPool = [];
  this.heartsNum = heartNum;
  this.reset();
}

Hearts.prototype.reset = function () {
  for (var i = 0; i < this.heartsNum; i++) {
    this.heartsPool[i] = activeHeartImg;
  }
};

Hearts.prototype.draw = function (disabledI) {
  for (var i = 0; i < this.heartsNum; i++) {
    if (i < disabledI) {
      this.heartsPool[i] = disabledHeartImg;
    } else {
      this.heartsPool[i] = activeHeartImg;
    }

    this.ctx.drawImage(this.heartsPool[i], 20 + (this.heartsNum - i) * 20, 20, 20, 20);
  }
};

function Main(ctx1, ctx2, can1, triggerGameOver) {
  this.triggerGameOver = triggerGameOver;
  this.can1 = can1;
  this.ctx1 = ctx1;
  this.ctx2 = ctx2;
  this.carLeft = 152;
  this.carWid = 170;
  this.heartNum = 3;
  this.carSafe = [this.carLeft - 25, this.carLeft + this.carWid / 3];
  this.giftBox = new GiftBox(ctx1, this.carSafe, ctx2);
  this.hanger = new Hanger(ctx1);
  this.giftCar = new GiftCar(ctx2);
  this.background = new Background(ctx2);
  this.heart = new Hearts(ctx1, this.heartNum);
  this.lastTime = Date.now();
  this.deltaTime = 0;
  this.startFall = false;
  this.trailing = true;
  this.gameLoop();
}

Main.prototype.gameLoop = function () {
  this.gameLoopAni = window.requestAnimFrame(this.gameLoop.bind(this));
  var now = Date.now();
  this.deltaTime = now - this.lastTime;
  this.lastTime = now;
  this.resetCanvas();
  this.giftCar.draw(this.carLeft, this.carWid);
  this.background.drawBackGround();
  this.boxXY = this.hanger.hangingHook(this.deltaTime);

  var _this$boxXY = _slicedToArray(this.boxXY, 2),
      boxX = _this$boxXY[0],
      boxY = _this$boxXY[1];

  this.giftBox.hangingDraw(boxY, boxX, this.deltaTime, this.lastTime);
  this.heart.draw(this.giftBox.heartDisabled.length);
  this.stop();
};

Main.prototype.reset = function () {
  this.giftBox.heartDisabled = [];
  this.gameLoop();
};

Main.prototype.resetCanvas = function () {
  this.ctx1.clearRect(0, 0, this.can1.width, this.can1.height);
  this.ctx2.clearRect(0, 0, this.can1.width, this.can1.height);
};

Main.prototype.stop = function () {
  var _this = this;

  if (_this.giftBox.heartDisabled.length >= _this.heartNum) {
    setTimeout(function () {
      _this.triggerGameOver(_this, _this.giftBox.score);

      window.cancelAnimationFrame(_this.gameLoopAni);
    }, 1000);
  }
};

Main.prototype.putGift = function () {
  var _this6 = this;

  if (this.trailing && this.giftBox.heartDisabled.length < this.heartNum) {
    this.ctx1.clearRect(0, 0, 414, 600);
    this.giftBox.fall();
    this.trailing = false;
  }

  setTimeout(function () {
    _this6.trailing = true;
  }, 1000);
};

function Toast(msg, duration) {
  duration = isNaN(duration) ? 3000 : duration;
  var m = document.createElement('div');
  m.innerHTML = msg;
  m.style.cssText = "font-size: .32rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 50%;left: 50%;width: 130px;text-align: center;";
  document.body.appendChild(m);
  setTimeout(function () {
    var d = 0.5;
    m.style.opacity = '0';
    setTimeout(function () {
      document.body.removeChild(m);
    }, d * 1000);
  }, duration);
}

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
}();

window.onload = function () {
  var can1 = document.getElementById('can1');
  var can2 = document.getElementById('can2');
  var ctx1 = can1.getContext('2d');
  var ctx2 = can2.getContext('2d');
  var main = new Main(ctx1, ctx2, can1, function (main, score) {
    Toast('???????????????' + score, 1000);
    setTimeout(function () {
      location.reload();
    }, 1100);
  });

  can1.onclick = function () {
    main.putGift();
  };
};