;(function ($) {

    $.extend(Fanli.Utility, {

        "random": function (n) {
            var uid = Math.random().toString(16).substr(2, n);

            while (uid.length < n) {
                uid = Math.random().toString(16).substr(2, n);
            }

            return uid;
        },

        "guid": function () {
            // get it from https://github.com/maccman/book-assets/blob/master/ch03/guid.js
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },

        "isNullObj": function (obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
        }
    });

}(jQuery, FLNS.register("Fanli.Utility")));

/*
    jQuery Pub/Sub
*/
(function ($) {

    var topics = {};

    $.Topic = function (id) {
        var callbacks, method,
          topic = id && topics[id];

        if (!topic) {
            callbacks = jQuery.Callbacks();
            topic = {
                publish: callbacks.fire,
                subscribe: callbacks.add,
                unsubscribe: callbacks.remove
            };
            if (id) {
                topics[id] = topic;
            }
        }
        return topic;
    };

}(jQuery));

(function ($) {
    var o = $({});

    $.subscribe = function () {
        o.bind.apply(o, arguments);
    };

    $.unsubscribe = function () {
        o.unbind.apply(o, arguments);
    };

    $.publish = function () {
        o.trigger.apply(o, $.makeArray(arguments));
    };

})(jQuery);