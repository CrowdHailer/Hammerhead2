(function() {
    'use strict';

    // String interpolations
    window.interpolate = function(s) {
        var i = 0;
        return function(args){
            return s.replace(/%(?:\(([^)]+)\))?([%diouxXeEfFgGcrs])/g, function (match, v, t) {
                if (t === "%") {return "%";}
                return args[v || i++];
            });
        };
    };

    // Request animation frame polyfill
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    // Missing windows pixel density fix 
    window.missingCTM = function ($element){
        var elWidth = $element.width(),
        elHeight = $element.height(),
        CTMScale = $element[0].getScreenCTM().a,
        boxWidth = $element.attr('viewBox').split(' ')[2],
        boxHeight = $element.attr('viewBox').split(' ')[3],
        widthRatio = (boxWidth* CTMScale) / elWidth,
        heightRatio = (boxHeight * CTMScale) / elHeight,
        properFix = widthRatio > heightRatio ? widthRatio : heightRatio;

        return _.round(1)(properFix);
    };
    
    window.Hammerhead = {};
}());

