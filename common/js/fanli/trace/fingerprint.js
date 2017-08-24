(function () {
    if (!UBT) {
        return;
    }
    
    UBT.fingerprint = function (features) {
        if (!this.uswitch || !features) {
            return;
        }
        
        var builder = [];
        
        Object.keys(features).forEach(function (key) {
            builder.push(key + "=" + encodeURIComponent(features[key]));
        });
        this._buildTrackImg(builder.join("&"));

        return false;
    };
    
    var keys = [
            'userAgentKey', 'languageKey', 'colorDepthKey', 'pixelRatioKey', 'screenResolutionKey',
            'availableScreenResolutionKey', 'timezoneOffsetKey', 'sessionStorageKey', 'localStorageKey',
            'indexedDbKey', 'addBehaviorKey', 'openDatabaseKey', 'cpuClassKey', 'platformKey',
            'doNotTrackKey', 'pluginsKey', 'adBlockKey', 'hasLiedLanguagesKey',
            'hasLiedResolutionKey', 'hasLiedOsKey', 'hasLiedBrowserKey', 'touchSupportKey', 'fontsKey'
        ],
        vals = [],
        features = {},
        fp;

    (fp = new Fingerprint2()).get(function(res){
        keys.forEach(function (key, i) {
            var method = key;
            if (typeof fp[method] === 'function' && key !== 'fontsKey') {
                typeof fp[method] === 'function' && fp[method].call(fp, vals);
            }
            else if (key == 'fontsKey') {
                typeof fp[method] === 'function' && fp[method].call(fp, vals, function () {
                    vals.forEach(function (obj) {
                        if (!(obj && obj.value !== undefined)) {
                            return;
                        }
                        features[obj.key] = JSON.stringify(obj.value);
                    });
                    features.hash = res;
                    UBT.fingerprint(features);
                });
            }
        });
    });
})();