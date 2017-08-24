///<reference path="../core/fmu.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file css3ScrollText
 * @import vendors/jquery/jquery.js
 */

(function () {

    $.fn.css3ScrollText = function (options) {
        var settings = $.extend(true, {}, {
            direction: "vertical",
            originalLength: 3,
            duration: 7
        }, options);

        return this.each(function () {
            var $this = $(this);

            if (settings.direction == "vertical") {
                applyBehavior($this);
            } else if (settings.direction == "horizontal") {
                bindHorizontalAnimation($this);
            }
        });

        function bindHorizontalAnimation($this) {
            var ulWidth = 0;
            var keyframesBuilder;

            $this.find("li").each(function () {
                var $this = $(this);
                ulWidth += $this.width() + parseInt($this.css("margin-left")) + parseInt($this.css("margin-right"));
            });

            if (ulWidth < $this.parent().width()) { return; }

            $this.css("width", ulWidth * 2);

            $this.find("li").clone().appendTo($this);

            if ($("#J_horizontal_scroll").length == 0) {
                keyframesBuilder = new StringBuilder();
                keyframesBuilder.append("@-webkit-keyframes horizontalScrollText{ 0%{-webkit-transform:translateX(0);} 100%{-webkit-transform: translateX(-{0}px);}}".format(ulWidth));
                $("<style id='J_horizontal_scroll'>{0}</style>".format(keyframesBuilder.toString())).appendTo("body");
            }

            $this.css("-webkit-animation-name", "horizontalScrollText")
                 .css("-webkit-animation-duration", "{0}s".format((ulWidth / 100).toFixed(2) * settings.duration / 3));
        }

        function applyBehavior($this) {
            var $items = $("li", $this);
            var itemLength = $items.length;
            var originalLength = settings.originalLength;

            if (itemLength < originalLength) {
                return;
            }

            $items.slice(0, originalLength).clone().appendTo($this);
            applyCss3Animation($this, $items);
        }

        function applyCss3Animation($container, $items) {
            var keyframesBuilder;
            var itemLength = $items.length;
            var itemHeight = $items.eq(0).height();

            if ($("#J_css3scrolltext").length == 0) {
                keyframesBuilder = new StringBuilder();
                keyframesBuilder.append("@-webkit-keyframes css3ScrollText {0% {-webkit-transform: translateY(0px);}100%{ -webkit-transform: translateY(-{0}px);}}".format(itemHeight * itemLength));
                $("<style id='J_css3scrolltext'>{0}</style>".format(keyframesBuilder.toString())).appendTo("body");
            }

            $container.css("-webkit-animation-name", "css3ScrollText")
                .css("-webkit-animation-duration", "{0}s".format((itemLength / 10).toFixed(2) * settings.duration * itemHeight / 24));
        }
    };

})();
