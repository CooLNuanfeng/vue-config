(function(a){a.fn.emailsuggest=function(b){b=a.extend({emailList:["@qq.com","@163.com","@126.com","@sina.com","@sina.cn","@hotmail.com","@gmail.com","@sohu.com","@139.com","@vip.qq.com","@vip.sina.com","@foxmail.com","@sogou.com"],maxList:null,delay:200,appendTo:"body",position:{offset:"0 -1"},onOpen:null,onClose:null,btnClear:false},b);return this.each(function(){var c=a(this);var e=a('<a class="btn-clear" href="javascript:void(0);"></a>');var d=c.outerWidth();if(b.btnClear){c.wrap('<span class="wrap-mail"></span>').after(e).on("keyup.suggest",function(f){if(b.btnClear){if(c.val()!=""){e.show()}else{e.hide()}c.html("")}})}c.on("input.autocomplete",function(){a(this).trigger("keydown.autocomplete")}).autocomplete({source:function(l,i){var h=b.emailList;var g=l.term;var n=g.indexOf("@");var o=(n>-1)?g.substring(0,n):g;var f=[];a(h).each(function(j,p){f.push(o+p)});var m=[];m.push(g);for(var k=0;k<=f.length-1;k++){if(f[k].indexOf(l.term)>-1&&f[k]!=l.term){m.push(f[k])}}if(b.maxList){m=m.slice(0,b.maxList+1)}i(m)},open:function(f,g){if(typeof(b.onOpen)==="function"){b.onOpen()}c.autocomplete("widget").css("width","{0}px".format(d-2)).prepend('<li class="nine">&#35831;&#36873;&#25321;&#25110;&#32487;&#32493;&#36755;&#20837;&#8230;</li>')},minLength:1,focus:function(f,g){return false},select:function(g,h){var f=h.item.value;c.val(f);return false},close:function(f,g){if(typeof(b.onClose)==="function"){b.onClose()}if(c.val()==""){c.focus()}return false},autoFocus:true,delay:b.delay,appendTo:b.appendTo,position:b.position}).data("autocomplete")._renderItem=function(f,g){var h=a("<li></li>");return h.data("item.autocomplete",g).append('<a href="javascript:void(0);">{0}</a>'.format(g.label)).appendTo(f)};e.click(function(){c.val("");e.hide()})})}})(jQuery);