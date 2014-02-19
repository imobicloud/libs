function UIManager(onChange) {
    function emptyFunction() {}
    function set(params) {
        if (false === onChange(0, params)) return;
        cache.length && cache[cache.length - 1].controller.cleanup();
        var controller = Alloy.createController(params.url, params.data);
        null == controller.cleanup && (controller.cleanup = emptyFunction);
        null == controller.reload && (controller.reload = emptyFunction);
        null == controller.unload && (controller.unload = emptyFunction);
        params.controller = controller;
        false !== params.isReset && reset();
        cache.push(params);
        var view = controller.getView();
        onChange(1, params, view);
        controller.init && controller.init(params);
        return view;
    }
    function destroyObject(params) {
        var controller = params.controller;
        controller.cleanup();
        controller.unload();
        onChange(2, params, controller.getView());
    }
    function setPrevious(data, count) {
        var len = cache.length;
        if (2 > len) return;
        !count && (count = 1);
        var start = len - 1, end = len - count;
        1 > end && (end = 1);
        cache[end - 1].controller.reload(data);
        remove(start, end);
    }
    function get(index) {
        if (null == index) return cache;
        0 > index && (index = cache.length + index);
        return cache[index];
    }
    function remove(start, end) {
        null == start ? start = cache.length - 1 : 0 > start && (start = cache.length + start);
        for (var i = start; i >= end; i--) {
            destroyObject(cache[i]);
            cache.splice(i, 1);
        }
    }
    function reset() {
        for (var i = cache.length - 1; i >= 0; i--) destroyObject(cache[i]);
        cache.length = 0;
    }
    var cache = [];
    null == onChange && (onChange = emptyFunction);
    return {
        get: get,
        set: set,
        setPrevious: setPrevious,
        remove: remove,
        reset: reset
    };
}

var Alloy = require("alloy");

module.exports = UIManager;