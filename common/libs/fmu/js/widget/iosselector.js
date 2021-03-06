// import iscroll-probe.js 5.2.0
// 数据格式模板
// var address = {
//     "5-吉林省": {
//         "26-长春市": [
//              "152-双阳区-130000-0431",
//              "149-宽城区-130000-0431",
//              "148-二道区-130000-0431",
//              "147-南关区-130000-0431",
//              "146-朝阳区-130000-0431",
//              "631-朝阳经济技术开发区-130000-0431",
//              "629-绿园区-130000-0431",
//              "151-经济技术开发区-130000-0431",
//              "153-汽车产业开发区-130000-0431",
//              "150-高新技术产业开发区-130000-0431",
//              "1414-净月开发区-130000-0431",
//              "1686-九台区-130000-0431"
//         ],
//         "1123-吉林市": [
//              "1154-昌邑区-130000-0431",
//              "1124-龙潭区-130000-0431",
//              "1418-经济技术开发区-130000-0431",
//              "1417-高新技术产业开发区-130000-0431",
//              "1416-丰满区-130000-0431",
//              "1415-船营区-130000-0431"
//         ]
//     }
// }

FMU.UI.define("IosSelector", {
    init: function() {

        this.el = null;
        this.column = 3; //selector级数，默认三级联动
        this.data = {}; //数据源，应符合模板格式
        this.title = "地址选择"; //selector名称
        this.default = []; //默认选中项，格式和数据模板一致["737-上海","738-上海市","740-闵行区-200000-021"]
        this.callback = function() {}; //确定按钮回调，参数分别为选中项id和对应文本两个数组，如[737,738,740]和["上海","上海市","闵行区"]

        if (!this.el) return;
        if (!this.data) return;
        if (Object.prototype.toString.call(this.column) !== "[object Number]") return;

        if (this.column < 1) this.column = 1;
        if (this.column > 3) this.column = 3;

    },
    item: [],

    myScroll: [],

    itemHeight: 35,

    setUp: function() {
        this.mask = document.createElement("div");
        this.mask.className = "ios-select-mask";

        this.mainWrap = document.createElement("div");
        this.mainWrap.className = "ios-select-contain";

        this.panelWrap = document.createElement("div");
        this.panelWrap.className = "ios-select-box";

        this.header = '<header class="ios-select-header"><a class="J_iosselect_cancle" href="javascript:void(0);">取消</a><h3>' + this.title + '</h3><a class="J_iosselect_confirm" href="javascript:void(0);">确定</a></header>';

        this.selectArea = '<hr class="cover-area cover-area1"><hr class="cover-area cover-area2">';

        this.panelWrap.innerHTML = this.header + this.selectArea;
        var _this = this;
        this.mask.addEventListener("touchmove", function(e) {
            e.preventDefault();
        })
        this.panelWrap.querySelector(".J_iosselect_cancle").addEventListener("click", function() {
            _this.destroy();
        })
        this.panelWrap.querySelector(".J_iosselect_confirm").addEventListener("click", function() {
            var id = [],
                text = [],
                key = [];
            [].forEach.call(_this.panelWrap.querySelectorAll(".selected"), function(v, i, a) {
                id.push(v.getAttribute("data-id"));
                text.push(v.getAttribute("data-text"));
                key.push(v.getAttribute("data-key"));
            })
            _this.destroy();
            _this.callback(id, text,key);
        })
        document.querySelector(this.el).addEventListener("click", function() {
            _this._initScroll();
            _this._getDefault();
        })
    },

    _initScroll: function() {
        var j = this.column;
        this.setDefault(0, this.data);
        if (j > 1) {
            var index = this.item[0].querySelector(".selected").getAttribute("data-key");
            this.setDefault(1, this.data[index]);
            if (j > 2) {
                var kndex = this.item[1].querySelector(".selected").getAttribute("data-key");
                this.setDefault(2, this.data[index][kndex]);
            }
        }
    },
    // 设置初始滚动位置
    setDefault: function(i, data) {
        this.item[i] = this._buildDom(data);
        this._bindScroll(this.item[i], i);
        this._setStyle(this.item[i], 0);
    },
    // 设置默认值
    _getDefault: function() {
        var d = this.default;
        var l = this.column;

        if (d.length < 1) return;

        var levelOne = this.formatData(this.data);
        var d0 = levelOne.indexOf(d[0]);

        if (d0 < 0) {
            console.error("初始值: default-" + d[0] + "设置有误！");
            return;
        }

        this.myScroll[0].scrollTo(0, -1 * this.itemHeight * d0);
        this._setStyle(this.item[0], d0);

        if (l < 2) return;

        this._refreshDom(this.item[1], this.data[d[0]]);
        this.myScroll[1].refresh();

        var levelTwo = this.formatData(this.data[d[0]]);
        var d1 = levelTwo.indexOf(d[1]);

        if (d1 < 0) {
            console.error("初始值: default-" + d[1] + "设置有误！");
            return;
        }

        this.myScroll[1].scrollTo(0, -1 * this.itemHeight * d1);
        this._setStyle(this.item[1], d1);

        if (l < 3) return;

        this._refreshDom(this.item[2], this.data[d[0]][d[1]]);
        this.myScroll[2].refresh();

        var levelThree = this.formatData(this.data[d[0]][d[1]]);
        var d2 = levelThree.indexOf(d[2]);

        if (d2 < 0) {
            console.error("初始值: default-" + d[2] + "设置有误！");
            return;
        }

        this.myScroll[2].scrollTo(0, -1 * this.itemHeight * d2);
        this._setStyle(this.item[2], d2);

    },

    _buildDom: function(data) {
        var _section = document.createElement("section");
        var _ul = document.createElement("ul");
        _ul.className = "iso-select-databox";

        _section.appendChild(_ul);
        this.mainWrap.appendChild(_section);

        this._refreshDom(_section, data);

        this.panelWrap.appendChild(this.mainWrap);
        document.body.appendChild(this.panelWrap);
        document.body.appendChild(this.mask);
        this.mask.style.display = "block";
        this.panelWrap.style.display = "block";
        var _this = this;
        var delayReflow = setTimeout(function() {
            clearTimeout(delayReflow);
            _this.panelWrap.style.bottom = 0;
        }, 0)
        return _section;
    },

    _refreshDom: function(section, data) {
        var _item = "<li></li><li></li><li></li>";
        var d = this.formatData(data);
        d.forEach(function(v, i, a) {
            var vs = v.toString().split("-");
            !vs[1] && vs.push(vs[0]);
            _item += '<li data-id="' + vs[0] + '" data-key="' + v + '" data-text="' + vs[1] + '">' + vs[1] + '</li>';
        })
        _item += '<li></li><li></li><li></li>';
        section.querySelector("ul").innerHTML = _item;
    },

    formatData: function(data) {
        if (typeof(data) !== "object") return;
        var _data = [];
        if (Object.prototype.toString.call(data) === "[object Array]") {
            _data = data;
        } else {
            for (var i in data) {
                _data.push(i);
            };
        }
        return _data;
    },

    _bindScroll: function(obj, i) {
        var _this = this;
        _this.myScroll[i] = new IScroll(obj, {
            probeType: 3
        });
        _this.itemHeight = parseFloat(obj.querySelector("li").scrollHeight);
        var current;
        _this.myScroll[i].on("scroll", function() {
            current = Math.abs(Math.round(this.y / _this.itemHeight));
            _this._setStyle(obj, current);
        })
        _this.myScroll[i].on("scrollEnd", function() {
            _this.myScroll[i].scrollTo(0, -1 * current * _this.itemHeight);
            var index = _this.item[0].querySelector(".selected").getAttribute("data-key");
            var l = _this.item.length;
            if (i == 0) {
                if (l > 1) {
                    _this._scrollEndHandler(_this, 1, _this.data[index]);
                    if (l > 2) {
                        var jndex = _this.item[i + 1].querySelector(".selected").getAttribute("data-key");
                        _this._scrollEndHandler(_this, 2, _this.data[index][jndex]);
                    }
                }
            }
            if (i == 1) {
                if (l > 2) {
                    var kndex = _this.item[i].querySelector(".selected").getAttribute("data-key");
                    _this._scrollEndHandler(_this, 2, _this.data[index][kndex]);
                }
            }
        })
    },

    _scrollEndHandler: function(obj, i, data) {
        obj._refreshDom(obj.item[i], data);
        obj.myScroll[i].scrollTo(0, 0);
        obj._setStyle(obj.item[i], 0);
        obj.myScroll[i].refresh();
    },

    _setStyle: function(obj, current) {
        [].forEach.call(obj.querySelectorAll("li"), function(v, i, a) {
            v.className = "";
        });
        if(obj.querySelector("li:nth-child(" + (current + 4) + ")")) obj.querySelector("li:nth-child(" + (current + 4) + ")").className = "selected";
        if(obj.querySelector("li:nth-child(" + (current + 5) + ")")) obj.querySelector("li:nth-child(" + (current + 5) + ")").className = "team1";
        if(obj.querySelector("li:nth-child(" + (current + 3) + ")")) obj.querySelector("li:nth-child(" + (current + 3) + ")").className = "team1";
        if(obj.querySelector("li:nth-child(" + (current + 6) + ")")) obj.querySelector("li:nth-child(" + (current + 6) + ")").className = "team2";
        if(obj.querySelector("li:nth-child(" + (current + 2) + ")")) obj.querySelector("li:nth-child(" + (current + 2) + ")").className = "team2";
    },

    destroy: function() {
        this.myScroll.forEach(function(v, i, a) {
            v.destroy();
            v = null;
        });
        this.panelWrap.style.bottom = "-6rem";
        var _this = this;
        var did = setTimeout(function() {
            clearTimeout(did);
            _this.panelWrap.style.display = "none";
            _this.mask.style.display = "none";
            _this.mainWrap.innerHTML = "";

            _this.item.splice(0, _this.item.length);
            _this.myScroll.splice(0, _this.myScroll.length);
            _this.itemHeight = 35;
        }, 300)
    }

});
