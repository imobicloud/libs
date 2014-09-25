function UIManager() {
    function emptyFunction() {}
    function load(params) {
        if (cache.length) {
            var prev = cache[cache.length - 1];
            prev._alreadyCleanup = true;
            prev.controller.cleanup();
        }
        var controller = Alloy.createController(params.url, params.data);
        delete params.data;
        null == controller.cleanup && (controller.cleanup = emptyFunction);
        null == controller.reload && (controller.reload = emptyFunction);
        null == controller.unload && (controller.unload = emptyFunction);
        params.controller = controller;
        cache.push(params);
        var view = controller.getView();
        fireEvent("ui:show", params);
        false !== params.isReset && remove(-2, 0);
        return view;
    }
    function destroyObject(params) {
        var controller = params.controller;
        true !== params._alreadyCleanup && controller.cleanup();
        controller.unload();
        fireEvent("ui:hide", params);
    }
    function loadPrevious(data, count, isReload) {
        var len = cache.length;
        if (2 > len) return false;
        !count && (count = 1);
        var start = len - 1, end = len - count;
        1 > end && (end = 1);
        var current = cache[start];
        current.controller.cleanup();
        current._alreadyCleanup = true;
        if (false !== isReload) {
            var prev = cache[end - 1];
            prev.controller.reload(data);
            prev._alreadyCleanup = false;
        }
        remove(start, end);
        return true;
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
    function on(type, callback) {
        events[type] ? events[type].push(callback) : events[type] = [ callback ];
        return this;
    }
    function fireEvent(type, data) {
        var callbacks = events[type];
        if (callbacks) for (var i = 0, ii = callbacks.length; ii > i; i++) callbacks[i](data, {
            type: type
        });
    }
    var cache = [], events = {};
    return {
        on: on,
        get: get,
        load: load,
        loadPrevious: loadPrevious,
        remove: remove,
        reset: reset
    };
}

var Alloy = require("alloy");

module.exports = UIManager;