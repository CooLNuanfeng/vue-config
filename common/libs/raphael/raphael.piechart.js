///<reference path="raphael.js" />

Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();

    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, .75, 1),
                ms = 500,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, 1),
                p = sector(cx, cy, r, angle, angle + angleplus, {
                    fill: "90-" + bcolor + "-" + color,
                    stroke: stroke,
                    "stroke-width": 3
                });

            var descriptionTextX = cx + r + 30;
            var descriptionTextY = (cy - r) * (j + 1) + 20;

            var rect = paper.rect(descriptionTextX, descriptionTextY, 10, 10).attr({ "fill": bcolor, "stroke-width": 0 });
            var text = paper.text(descriptionTextX + 20, descriptionTextY + 6, labels[j]).attr({
                "fill": "#999",
                "stroke": "none",
                "font-size": 12,
                "text-anchor": "start"
            }).hover(hoverIn, hoverOut);

            p.hover(hoverIn, hoverOut);

            function hoverIn() {
                p.stop().animate({
                    transform: "s1.1 1.1 " + cx + " " + cy
                }, ms, "elastic");

                rect.stop().animate({
                    width: 15,
                    height: 15
                }, ms, "<>");

                text.stop().animate({
                    "fill": "#000"
                }, ms, "<>");
            }

            function hoverOut() {
                p.stop().animate({
                    transform: ""
                }, ms, "elastic");
                rect.stop().animate({
                    width: 10,
                    height: 10
                }, ms, "<>");
                text.stop().animate({
                    "fill": "#999"
                }, ms, "<>");
            }

            angle += angleplus;
            chart.push(p);
            chart.push(rect);
            chart.push(text);
            start += .1;
        };

    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }

    for (i = 0; i < ii; i++) {
        process(i);
    }

    var circle = paper.circle(cx, cy, 55).attr({ "fill": "#fff", "stroke-width": 0 });

    chart.push(circle);

    return chart;
};