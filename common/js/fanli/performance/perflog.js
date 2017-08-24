(function() {

    if (document.readyState == "complete") {
        log();
    } else {
        window.addEventListener("load", log, false);
    }

    function log() {
        setTimeout(function() {
            if (typeof performance == "undefined" || typeof JSON == "undefined" || !performance.timing) {
                return;
            }

            var timing = performance.timing;

            var timingData = {
                // 准备新页面时间耗时
                readyStart: timing.fetchStart - timing.navigationStart,
                // redirect 重定向耗时
                redirectTime: timing.redirectEnd - timing.redirectStart,
                // Appcache 耗时
                appcacheTime: timing.domainLookupStart - timing.fetchStart,
                // unload 前文档耗时
                unloadEventTime: timing.unloadEventEnd - timing.unloadEventStart,
                // DNS 查询耗时
                lookupDomainTime: timing.domainLookupEnd - timing.domainLookupStart,
                // TCP连接耗时
                connectTime: timing.connectEnd - timing.connectStart,
                // request请求耗时
                requestTime: timing.responseEnd - timing.requestStart,
                // 请求完毕至DOM加载
                initDomTreeTime: timing.domInteractive - timing.responseEnd,
                // 解释dom树耗时
                // 过早获取时 domComplete有时会是0
                domReadyTime: timing.domComplete - timing.domInteractive,
                // load事件耗时
                loadEventTime: timing.loadEventEnd - timing.loadEventStart,
                // 从开始至load总耗时
                // 过早获取时 loadEventEnd有时会是0
                loadTime: timing.loadEventEnd - timing.navigationStart
            };

            UBT.track("fe_monitor.perf",
                "redirect-{0}~dnslookup-{1}~tcpconnect-{2}~domready-{3}~load-{4}"
                .format(timingData.redirectTime, timingData.lookupDomainTime, timingData.connectTime, timingData.domReadyTime, timingData.loadTime));
        }, 0);
    }

}());
