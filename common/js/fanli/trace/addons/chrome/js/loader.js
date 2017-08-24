///<reference path="libs/jquery-2.0.0.min.js" />

var StringOperation = {
    format: function (s, args) {
        for (var i = 0; i < args.length; ++i) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        }
        return s;
    }
};

var timeoutId;

(function ($) {
    $(document).on("click", "a, button, i, span, input[type=button], input[type=submit], .J_fanli_ubt_trigger", function (ev) {
        var $this = $(this);
        var $ancestor = $this.parents();
        var ancestorLen = $ancestor.length;
        var xpathArr = [];

        var tagName = $this[0].tagName;
        var spm = $this.data("spm") || "";
        var href = $this.attr("href");

        /** look for path logic **/
        xpathArr.push(tagName.toLowerCase() + "[" + $this.index() + "]");

        for (var i = 0; i < ancestorLen; i++) {
            var $currentNode = $ancestor.eq(i);
            var tagName = $currentNode[0].tagName.toLowerCase();
            if (tagName == "html" || tagName == "body") {
                xpathArr.push(tagName);
            } else {
                xpathArr.push(tagName + "[" + $currentNode.index() + "]");
            }
        }
        /** look for path logic **/

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(function () {
            console.log(" ");
            console.log("%c*****************START**************", "color:#CC0000;font-size: 20px;");
            console.log("%cURL: ", "width:16px;height:16px; padding-left:20px;color: #f60;", location.href);
            console.log("%cXPath: ", "width:16px;height:16px; padding-left:20px;color: #f60;", xpathArr.reverse().join('/'));
            if (spm) {
                console.log("%cspm: ", "width:16px;height:16px; padding-left:20px;color: #f60;", spm);
            }

            if (href) {
                console.log("%cgoto: ", "width:16px;height:16px; padding-left:20px;color: #f60;", href);
            }

            console.log("%c*****************END****************", "color:#CC0000;font-size: 20px;");
            console.log(" ");
        }, 25);
    });
}(bcjQuery));