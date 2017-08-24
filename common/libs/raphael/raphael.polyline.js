/// <reference path="raphael.js" />
/// <reference path="raphael.popup.js" />
/// <reference path="../underscore/underscore-1.6.0.js" />

Raphael.fn.polyLine = function (options, x, y, w, h, wv, hv, color) {
    var settings = _.extend({
        // 画布x轴起点
        x: 10,
        // 画布y轴起点
        y: 10,
        // 画布宽
        w: 600,
        // 画布高
        h: 200,
        // x轴坐标总数
        wv: 11,
        // y轴坐标总数
        hv: 10,
        // 默认颜色
        color: "#8DD7F7",
        // 数据
        dataArray: [],
        // 是否显示描述文字
        showDescription:false,
        // 描述文字
        descriptionText: "订单金额"
    }, options);


    if (settings.dataArray.length == 0) {
        return;
    }

    var costArray = settings.dataArray;
    var color = settings.color;
    var max = (_.max(costArray, function (cost) { return cost.c; }).c ) * 120 / 100;
    var fistDataItem = costArray[0];
    var len = costArray.length;

    var monthTextAttr = { "font": "bold 12px Helvetica, Arial", "fill": "#999" };
    var polylineAttr = { "stroke": "#ccc", "stroke-width": 3, "stroke-linejoin": "round" };
    var circleAttr = { "fill": "#fff", "stroke": color, "stroke-width": 2 };
    var hoverRectAttr = { "fill": "#fff", "fill-opacity": 0, "stroke-width": 0 };
    var tipsTextAttr = { "font": "12px Helvetica, Arial", fill: "#f60" };

    var paper = this;

    var dx = settings.x;  // 画布起点x
    var dy = settings.y;  // 画布起点y
    var dw = settings.w;  // 画布宽
    var dh = settings.h;  // 画布高
    var wv = settings.wv; // 画布x轴坐标总数
    var hv = settings.hv; // 画布y轴坐标总数

    var x1 = Math.round(dx) + .5, y1 = 0;                             // 画布左上角(x1, y1)
    var x2 = Math.round(dx + dw) + .5, y2 = 0;                        // 画布右上角(x2, y2)
    var x3 = Math.round(dx) + .5, y3 = Math.round(dy + dh) + .5;      // 画布左下角(x3, y3)
    var x4 = Math.round(dx + dw) + .5, y4 = Math.round(dy + dh) + .5; // 画布又下角(x3, y3)

    var columnWidth = dw / wv;               // 列宽 
    var rowHeight = dh / hv;                 // 行高 
    var halfColWidth = columnWidth / 2;      // 1/2 列宽
    var rh = y4;       // 画布实际高度
    var xc = x1;       // hover层起点x坐标

    var pathLine = ["M", x1, (1 - (fistDataItem.c / max)) * dh];

    var label = paper.set();
    var lx = 0, ly = 0;
    var is_label_visible = false;
    var leave_timer;

    label.push(paper.text(60, 12, "000").attr(tipsTextAttr));
    label.hide();

    var frame = paper.popup(100, 100, label, "right").attr({ fill: "#ffffde", stroke: "#bababa", "stroke-width": 1 }).hide();

    for (var m = 1; m <= wv + 1; m++) {
        var currentItem = costArray[m - 1];

        // 起点和终点只有列宽一半热区，其他节点整个列宽为热区
        var wth = m == 1 || m == wv + 1 ? halfColWidth : columnWidth;

        var dotX = Math.round(dx + (m - 1) * columnWidth) + .5;
        var dotY = (1 - (currentItem.c / max)) * dh;

        var dot = paper.circle(dotX, dotY, 5)
                       .attr(circleAttr)
                       .data({ dx: dotX, dy: dotY, dm: currentItem.m, dc: currentItem.c });

        if (m == 1) {
            xc = x1;
        } else if (m == 2) {
            xc = x1 + halfColWidth;
        } else {
            xc = x1 + halfColWidth + (m - 2) * columnWidth;
        }

        // x轴刻度值
        paper.text(Math.round(dx + (m - 1) * columnWidth) + .5, rh, currentItem.m).attr(monthTextAttr);
        pathLine = pathLine.concat(["L", Math.round(dx + (m - 1) * columnWidth) + .5, (1 - (currentItem.c / max)) * dh]);

        var rect = paper.rect(xc, 0, wth, rh).attr(hoverRectAttr);
        (function (dot) {
            rect.hover(function () {
                clearTimeout(leave_timer);
                var side = "right";
                if (dot.data("dx") + frame.getBBox().width > dw) {
                    side = "left";
                }

                var ppp = paper.popup(dot.data("dx"), dot.data("dy"), label.attr(tipsTextAttr), side, 1);

                var anim = Raphael.animation({
                    path: ppp.path,
                    transform: ["t", ppp.dx, ppp.dy]
                }, 300 * is_label_visible);

                lx = label[0].transform()[0][1] + ppp.dx;
                ly = label[0].transform()[0][2] + ppp.dy;
                label[0].attr({ text: dot.data("dc") + "元" }).show().stop().animateWith(frame, anim, { transform: ["t", lx, ly] }, 300 * is_label_visible);;
                frame.show().stop().animate(anim);

                dot.attr({"fill": "#8DD7F7", "r": 7 });
                is_label_visible = true;
            }, function () {
                dot.attr({"fill": "#fff", "r": 5 });
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    is_label_visible = false;
                }, 1);
            });

        }(dot));
    }

    var path = paper.path(pathLine.join(",")).attr(polylineAttr);

    path.toBack();
    frame.toFront();
    label[0].toFront();

    if (settings.showDescription) {
        paper.path("M" + x1 + ",40.5H80").attr({ "stroke": color, "stroke-width": 3 }).toBack();
        paper.text(x1 + 80 + 20, 40.5, settings.descriptionText).attr({"font": "12px Helvetica, Arial","fill": color}).toBack();
    }


    return path;
};