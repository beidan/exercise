
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Draw = function () {
    function Draw(el) {
        _classCallCheck(this, Draw);

        this.el = el;
        this.canvas = document.getElementById(this.el);
        this.cxt = this.canvas.getContext('2d');
        this.stage_info = canvas.getBoundingClientRect();
        // 记录绘图位点的坐标
        this.path = {
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        };
    }
    // 初始化


    _createClass(Draw, [{
        key: 'init',
        value: function init(ws, btn) {
            var _this = this;

            this.canvas.onmousedown = function () {
                _this.drawBegin(event, ws);
            };
            this.canvas.onmouseup = function () {
                _this.drawEnd();
                ws.send('stop');
            };
            this.clearCanvas(ws, btn);
        }
    }, {
        key: 'drawBegin',
        value: function drawBegin(e, ws) {
            var _this2 = this;

            window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
            this.cxt.strokeStyle = "#000";

            // 开始新的路径（这一句很关键，你可以注释掉看看有什么不同）
            this.cxt.beginPath();
            this.cxt.moveTo(e.clientX - this.stage_info.left, e.clientY - this.stage_info.top);
            // 记录起点
            this.path.beginX = e.clientX - this.stage_info.left;
            this.path.beginY = e.clientY - this.stage_info.top;

            document.onmousemove = function () {
                _this2.drawing(event, ws);
            };
        }
    }, {
        key: 'drawing',
        value: function drawing(e, ws) {
            this.cxt.lineTo(e.clientX - this.stage_info.left, e.clientY - this.stage_info.top);
            // 记录终点
            this.path.endX = e.clientX - this.stage_info.left;
            this.path.endY = e.clientY - this.stage_info.top;
            // 把位图坐标发送到服务器
            ws.send(this.path.beginX + '.' + this.path.beginY + '.' + this.path.endX + '.' + this.path.endY);

            this.cxt.stroke();
        }
    }, {
        key: 'drawEnd',
        value: function drawEnd() {
            document.onmousemove = document.onmouseup = null;
        }
    }, {
        key: 'clearCanvas',
        value: function clearCanvas(ws, btn) {
            var _this3 = this;

            // 点击按钮清空画布
            btn.onclick = function () {
                _this3.cxt.clearRect(0, 0, 500, 500);
                ws.send('clear');
            };
        }
    }]);

    return Draw;
}();