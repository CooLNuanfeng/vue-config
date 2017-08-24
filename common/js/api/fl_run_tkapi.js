/*
  * run tkapi
  * demo: http://open.alimama.com/api/apijs.php?spm=0.0.0.0.Vlj452
  * html:
  * <a data-itemid="22074980066" href="" class="J_tklink_tmall" [data-trackcode=""] [data-tcparam=""]> item (itemid=22074980066)</a>
  * <a data-sellerid="263817957" href="" class="J_tklink_tmall" [data-trackcode=""] [data-tcparam=""]> shop (shopid=263817957)</a>
*/
function flRunTkApi( opts )
{
    var _default = { //set data of "taobao.fanli.com" as default
            tkpid:"mm_13127418_3401890_13104572",
            tkappkey : "12019508"
        };

    //simply clone opts & _default to settings(like jquery extend)
    var settings = (function(){  
            for(var e,f,a={},b=0,c=arguments,d=c.length;d>b;b++)if(null!=(f=c[b]))for(e in f)a[e]=f[e];return a
        })(_default,opts);

    /*
        local: "http://static2.51fanli.net/common/js/api/tkapi.js?" + parseInt(new Date().getTime() / 300000)
        remote:"http://a.alimama.cn/tkapi.js"
    */
    var tksrc    = "http://static2.51fanli.net/common/js/api/tkapi.js?" + parseInt(new Date().getTime() / 300000),
        tkappkey = settings.tkappkey,
        tkpid    = settings.tkpid;

    (function(win,doc){
        var s = doc.createElement("script"), h = doc.getElementsByTagName("head")[0];
        if (!win.alimamatk_show) {
            s.charset = 'gbk';
            s.async = true;
            s.src = tksrc;
            s.kslite = "";
            h.insertBefore(s, h.firstChild);
        }
        var o = {
           pid: tkpid,
           appkey: tkappkey,
           rd:1
        }
        win.alimamatk_onload = win.alimamatk_onload || [];
        win.alimamatk_onload.push(o);
    })(window,document);
}