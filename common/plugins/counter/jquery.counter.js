(function($){
    $.fn.extend({ 
        counter: function(options) {
            var defaults = {
                type: "image",
                rate: 155, // minutes per second
                start_value: 4800000000, // minutes
                start_timestamp: 1306814400, // seconds since epoch
                start_date: undefined,
                end_value: '',
                end_text: '',
                speed:2000,
                css: {
                    "min-width": "200px",
                    "min-height": "64px",
                    "color": "#5F5F5F",
                    "font-size": "44px",
                    "font-weight": "bold",
                    "font-family": "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    "text-shadow": "0px 0px 5px #CBCBCB",
                    "text-align": "center",
                    "line-height": "64px",
                    "padding-bottom":"4px",
                    "position": "relative"
                },
                css_class: undefined,
                image_height: 30,
                show_comma: true,
                onBeforeLoad: null,
                onComplete: null
            };
            
            var options = $.extend(defaults, options);
            
            function addCommas(nStr) {
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            }
            
            return this.each(function() {
                var o = options,
                    obj = $(this),
                    ts = Date.now || function() { return +new Date },
                    current_timestamp,
                    diff,
                    minutes_since_start,
                    current_minutes,
                    current_minutes_str,
                    html="";
                current_minutes_str = ( obj.attr('data-end-value') || o.end_value) + '';
               if(typeof(o.onBeforeLoad) === 'function'){
                    o.onBeforeLoad(obj,current_minutes_str);
                }
                // if (o.start_date && o.start_date.year && o.start_date.month && o.start_date.day) {
                //     o.start_timestamp = Math.round(new Date(o.start_date.year+"-"+o.start_date.month+"-"+o.start_date.day).getTime()/1000);
                // }
                // current_timestamp = Math.round(ts() / 1000);
                // diff = current_timestamp - o.start_timestamp;
                // minutes_since_start = o.rate * diff;
                // current_minutes = minutes_since_start + o.start_value;
                // current_minutes_str = current_minutes + "";
                if (o.show_comma) {
                    // current_minutes_str = addCommas(current_minutes_str);
                }
                
                // if (o.type === 'text') {
                //     html = "<span class='digits'>" + current_minutes_str + "</span>";
                //     obj.html(html);
                //     var el = obj.find('.digits');
                //     if (o.css_class) {
                //         // if a class was provided, use it
                //         el.addClass(o.css_class);
                //     } else {
                //         // otherwise, use css object
                //         el.css(o.css);
                //     }
                // } else 
                if (o.type === 'image') {
                    html = "<div class='counter-wrap'>";
                    var numheight = o.image_height;
                    // console.log(current_minutes_str)
                    for (i=1;i<=current_minutes_str.length;i++) {
                        html = html + "<div class='counter-number counter-place-" + (i-1) + "'>&nbsp;</div>";
                        // if (i !== current_minutes_str.length) {
                        //     html = html + "<div class='counter-spliter'>&nbsp;</div>";
                        // }
                    }
                    html = html + (o.end_text?'<div class="count-txt ">{0}</div>'.format(o.end_text):'') + "</div>";
                    obj.html(html);
                    var place = 0;
                    
                    obj.find(".counter-number").each(function() {
                        var $this = $(this);
                        var digit_string = current_minutes_str.charAt(place++);
                        if (!isNaN(digit_string)) {
                            var digit = Number(digit_string);
                            $this.data("digit", digit);
                            $this.data("digit_string", digit_string);
                            var numHeight = digit * numheight * -1;
                            $this.wrap("<div class='wrap-counter'>").animate({top: numHeight +'px'}, o.speed);
                        }
                        switch(digit_string){
                            case ",":
                                $this.addClass('count-txt').html(',');
                                break

                            case "d":
                                $this.addClass('count-txt count-day').html('天');
                                break

                            case "h":
                                $this.addClass('count-txt count-hour').html('小时');
                                break

                            case "m":
                                $this.addClass('count-txt count-min').html('分');
                                break

                            case ".":
                                $this.addClass('count-dot').wrap("<div class='wrap-counter'>").html('.');
                                break

                            case "Y":
                                $this.addClass('count-txt').html('亿');
                                break

                            case "W":
                                $this.addClass('count-txt').html('万');
                                break

                        }
                    });
                }
                if(typeof(o.onComplete) === 'function'){
                    setTimeout(o.onComplete,o.speed);
                }
            });
        }
    });
})(jQuery);