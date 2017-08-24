/*
    preload images
    lei.zhang@fanli.com
*/
(function ($)
{
    var defaults = {
        imgPathPrefix : "",
        imgs: []
    };

    $.extend(
    {
        preloadImage: function (options)
        {
            var settings = $.extend(true, {}, defaults, options);
            var imgPrefix = settings.imgPathPrefix;
            var preloadImages = settings.imgs;
            var imgsLen = preloadImages.length;
            
            if (imgsLen == 0)
            {
                return;
            }

            for (var i = 0; i <= imgsLen- 1; ++i)
            {
                var img = new Image();
                img.onload = img.onerror = function ()
                {
                   img.onload = onerror = null;
                };
                img.src = "{0}{1}".format(imgPrefix, preloadImages[i]);
            }
        }
    });

    $.extend($.preloadImage, { defaults: defaults });

})(jQuery);