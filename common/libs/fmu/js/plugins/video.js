///<reference path="../../../../libs/jquery/jquery.js" />

/**
 * @file flvideo
 * @import vendors/jquery/jquery.js
 */

//<div id="J_video_wrap"></div>

//$("#J_video_wrap").flvideo({
//    poster: "http://l0.51fanli.net/gaea/images/2016/08/57a1d00e6dac1.jpg",
//    src: "http://vliveachy.tc.qq.com/vhot2.qqvideo.tc.qq.com/p0317f4i272.m701.mp4?vkey=7C1BEABA8F8CCDF0DAEA3B0EC37AECECE7FB3EA375DF2C423D9B548E6B3A17EC2198E145C70B8BBBF7C5A4AE7CC955A6E02A4A9A7D6DBD2138F9926B72E65422EBDC3A980607B699D2192F745466098ADF7E61B4D840D351"
//});

(function ($) {
    $.fn.flvideo = function (options) {
        var settings = $.extend(true, {
            autoplay: false,
            controls: true,
            preload: "auto",
            src: "",
            poster: "//static2.51fanli.net/common/images/loading/spacer.png",
            style: {
                width: "100%",
                height: "4.25rem"
            },
            playInline: true,
        }, options);

        return this.each(function () {
            var $this = $(this);

            function rederVideo() {
                var VDSB = new StringBuilder();
                var controls = settings.controls ? 'controls="controls"' : "";
                var autoplay = settings.autoplay ? 'autoplay="autoplay"' : "";
                var playInline = settings.playInline ? "webkit-playsinline playsinline" : "";

                VDSB.append('<video {0} {1} preload="{2}" poster="{3}" style="width:{4}; height:{5}" {6}>'.format(controls, autoplay, settings.preload, settings.poster, settings.style.width, settings.style.height, playInline))
                        .append('<source src="{0}" type="video/mp4" />'.format(settings.src))
                    .append('</video>');

                $this.append(VDSB.toString());
            }

            function setup() {
                settings.src != "" ? rederVideo() : "";
            }

            setup();
        });
    };
}($));