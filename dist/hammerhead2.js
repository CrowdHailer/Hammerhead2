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
        var elWidth = $element.width() || $element[0].width.baseVal.value,
        elHeight = $element.height() || $element[0].height.baseVal.value,
        CTMScale = $element[0].getScreenCTM().a,
        boxWidth = $element.attr('viewBox').split(' ')[2],
        boxHeight = $element.attr('viewBox').split(' ')[3],
        widthRatio = (boxWidth* CTMScale) / elWidth,
        heightRatio = (boxHeight * CTMScale) / elHeight,
        properFix = widthRatio > heightRatio ? widthRatio : heightRatio;
        return properFix;
    };

    window.Hammerhead = {};
}());

;/* global Hammerhead, _, SVGroovy*/

(function(parent){
    'use strict';

    var Pt = SVGroovy.Point;
    function create(minimal, maximal){
        if (typeof minimal === 'string') { return createFromString(minimal); }
        return {minimal: minimal, maximal: maximal};
    }

    function createFromString(viewBoxString){
        function returnInt(string){ return parseInt(string, 10); }

        var limits  = viewBoxString.split(' ').map(returnInt),
            minimal = Pt(limits[0], limits[1]),
            delta   = Pt(limits[2], limits[3]),
            maximal = Pt.add(minimal)(delta);
        return create(minimal, maximal);
    }

    function attrString(view){
        var x0 = view.minimal.x, y0 = view.minimal.y, x1 = view.maximal.x, y1 = view.maximal.y;
        var values = [x0, y0, x1-x0, y1-y0];
        return values.join(' ');
    }

    function midpoint(view){
        return Pt.scalar(0.5)(Pt.add(view.minimal)(view.maximal));
    }

    function translate(delta){
        return function(view){
            var transformAll = _.map(Pt.negate(delta));
            return transformAll(view);
        };
    }

    function scale(factor){
        return function(view){
            var transformAll = _.map(Pt.scalar(1.0/factor));
            return transformAll(view);
        };
    }

    function zoom(magnification){
        return function(center){
            return function(view){
                center = center || midpoint(view);
                return _.compose(
                  translate(Pt.negate(center)()),
                  scale(magnification),
                  translate(center)
                )(view);
            };
        };
    }

    var extendMethods = _.extend({
        midpoint: midpoint,
        translate: translate,
        scale: scale,
        zoom: zoom,
        attrString: attrString
    });

    extendMethods(create);
    parent.ViewBox = create;
}(Hammerhead));;/* global Hammerhead, bean, interpolate*/

(function(parent){
    'use strict';

    var marginTemp = interpolate('-%(height)spx -%(width)spx');

    parent.regulateOverflow = function(){
        var surplus = this.getConfig('overflowSurplus'),
            factor = 2 * surplus + 1,
            $element = this.$element,
            $parent = $element.parent();

        var update = function(){
            var height = $parent.height(),
                width = $parent.width();

            $element
                .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
                .width(width * factor)
                .height(height * factor);
        };
        
        update();
        setTimeout(update, 1000); //Android fix as early window sizes are incorrect

        bean.on(window, 'resize', update);

        return function(){
            bean.off(window, 'resize', update);
        };
    };

}(Hammerhead));;/* global Hammerhead, _, bean, SVGroovy, missingCTM, requestAnimationFrame, cancelAnimationFrame*/

(function(parent){
    'use strict';
    //cumin compose map map
    // limit zoom
    // round pixels

    var transformObject = function(matrixString){
        return {
            '-webkit-transform': matrixString,
            '-ms-transform': matrixString,
            'transform': matrixString
        };
    };

    var Pt = SVGroovy.Point,
        Mx = SVGroovy.Matrix,
        VB = parent.ViewBox,
        xBtransform = _.compose(transformObject, Mx.asCss3d);

    parent.managePosition = function(){
        var $element = this.$element,
            element = this.element,
            properFix = missingCTM($element), // windows FIX
            viewBox = VB($element.attr('viewBox')),
            animationLoop,
            currentMatrix;

        function renderCSS(){
            if (!animationLoop) {
                animationLoop = requestAnimationFrame(function(){
                    $element.css(xBtransform(currentMatrix));
                    animationLoop = false;
                });
            }
        }

        function renderViewBox(){
            cancelAnimationFrame(animationLoop);
            animationLoop = false;
            requestAnimationFrame(function(){
                $element.css(xBtransform());
                $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
            });
        }

        bean.on(element, 'displace', function(point){
            currentMatrix = Mx.toTranslate(point);
            renderCSS();
        });

        bean.on(element, 'inflate', function(scaleFactor){
            currentMatrix = Mx.toScale(scaleFactor);
            renderCSS();
        });

        bean.on(element, 'translate', function(delta){
            properFix = window.missingCTM($element);
            properFix = 1;
            var fixedTranslation = Pt.scalar(properFix)(delta);
            var inverseCTM = $element[0].getScreenCTM().inverse();
            inverseCTM.e = 0;
            inverseCTM.f = 0;
            var scaleTo = Pt.matrixTransform(inverseCTM);
            var svgTrans = scaleTo(fixedTranslation);
            viewBox = VB.translate(svgTrans)(viewBox);
            renderViewBox();
        });

        bean.on(element, 'magnify', function(scale){
            viewBox = VB.zoom(scale)()(viewBox);
            renderViewBox();
        });

        $element.css(xBtransform());
        $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));

        return function(){
            bean.off(element);
        };
    };
}(Hammerhead));;/* global Hammerhead, bean, SVGroovy, Hammer*/

(function(parent){
    'use strict';

    var Pt = SVGroovy.Point;
    var hammertime = Hammer(document);
    
    parent.dispatchTouch = function(){
        var element = this.element,
            isComponent = this.isComponent,
            live = false,
            dragging = false,
            pinching = false;

        hammertime.on('touch', function(evt){
            live = isComponent(evt.target);
            if (live) { evt.gesture.preventDefault(); }
        });

        hammertime.on('drag', function(evt){
            if (live) { evt.gesture.preventDefault(); }
            if (live && !pinching) {
                dragging = Pt(evt.gesture);
                bean.fire(element, 'displace', Pt(evt.gesture));
            }
        });

        hammertime.on('pinch', function(evt){
            if (live) { evt.gesture.preventDefault(); }
            if (live) {
                dragging = false;
                pinching = evt.gesture.scale;
                bean.fire(element, 'inflate', pinching);
            }
        });

        hammertime.on('release', function(evt){
            if (live) {
                evt.gesture.preventDefault();
                if (dragging) {
                    bean.fire(element, 'translate', dragging);
                }
                if (pinching) {
                    bean.fire(element, 'magnify', pinching);
                }
                live = false;
                pinching = false;
                dragging = false;
            }
        });

        return function(){
            hammertime.dispose();
        };
    };
}(Hammerhead));;/* global Hammerhead, _, bean*/

(function(parent){
    'use strict';

    parent.mousewheelDispatch = function(){

        var element = this.$element[0],
            scale,
            factor = 1 + this.getConfig('mousewheelSensitivity');

        var finishScrolling = _.debounce(this.getConfig('mousewheelDelay'))(function(scaleFactor){
            bean.fire(element, 'magnify', scaleFactor);
            scale = null;
        });

        var handleMousewheel = function(event){
            if (!scale) {
                if (!this.isComponent(event.target)) {
                    return;
                }

                scale = 1;
            }

            if (event.wheelDelta > 0) {
                scale *= factor;
            } else {
                scale /= factor;
            }

            bean.fire(element, 'inflate', scale);
            finishScrolling(scale);
        }.bind(this);

        $(document).on('mousewheel', handleMousewheel);
    };

}(Hammerhead));;/* global Hammerhead, _, interpolate*/

(function(parent){
    'use strict';

    var prototype = {};

    var buildConfig = _.foundation({
        mousewheelSensitivity: 0.1,
        mousewheelDelay: 200,
        maxZoom: 2,
        minZoom: 0.5,
        overflowSurplus: 0.5,
        resizeDelay: 200
    });

    function checkSVGTarget(svg){
        return function(target){
            return (target.ownerSVGElement || target) === svg;
        };
    }

    function init(svgId, options){
        var $element = $('svg#' + svgId);
        var element = $element[0];

        if (!element) {
            console.warn(interpolate("SVG element '%(id)s' not found")({id: svgId}));
            return false;
        }

        var instance = _.augment(Object.create(prototype))({
            $element: $element,
            element: element,
            isComponent: checkSVGTarget(element),
            getConfig: _.peruse(buildConfig(options))
        });

        instance.clear = parent.regulateOverflow.call(instance);
        parent.dispatchTouch.call(instance);
        parent.managePosition.call(instance);
        parent.mousewheelDispatch.call(instance);
        
        return instance;
    }
    parent.create = init;
}(Hammerhead));