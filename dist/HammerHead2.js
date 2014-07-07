// String interpolations

function interpolate(s) {
  var i = 0;
  return function(args){
    return s.replace(/%(?:\(([^)]+)\))?([%diouxXeEfFgGcrs])/g, function (match, v, t) {
      if (t === "%") {return "%";}
      return args[v || i++];
    });
  };
}

var transformObject = function(matrixString){
  return {
    '-webkit-transform': matrixString,
    '-ms-transform': matrixString,
    'transform': matrixString
  };
};



// Request animation frame polyfill

(function() {
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
}());

// Missing windows pixel density fix 

function missingCTM($element){
  var elWidth = $element.width(),
    elHeight = $element.height(),
    CTMScale = $element[0].getScreenCTM().a,
    boxWidth = $element.attr('viewBox').split(' ')[2],
    boxHeight = $element.attr('viewBox').split(' ')[3],
    widthRatio = (boxWidth* CTMScale) / elWidth,
    heightRatio = (boxHeight * CTMScale) / elHeight,
    properFix = widthRatio > heightRatio ? widthRatio : heightRatio;

  return _.round(1)(properFix);
}

// cumin fills


_.peruse = function(obj){
  return function(key){
    return obj[key];
  };
};

//SVGroovy fills NB requires interpolate

SVGroovy.Matrix.asCss = function(matrix){
  return interpolate('matrix3d(%(a)s, %(b)s, 0, 0, %(c)s, %(d)s, 0, 0, 0, 0, 1, 0, %(e)s, %(f)s, 0, 1)')(matrix || SVGroovy.Matrix());
};

// check svg owner



var Hammerhead = {};

(function(parent){
  var Pt = SVGroovy.Point;
  function create(minimal, maximal){
    if (typeof minimal === 'string') { return createFromString(minimal); }
    return Object.freeze({minimal: minimal, maximal: maximal});
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
      return Object.freeze(transformAll(view));
    };
  }

  function scale(factor){
    return function(view){
      var transformAll = _.map(Pt.scalar(1.0/factor));
      return Object.freeze(transformAll(view));
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
}(Hammerhead));
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

    bean.on(window, 'resize', update);

    return function(){
      bean.off(window, 'resize', update);
    };
  };

}(Hammerhead));
(function(parent){
  'use strict';

  var Pt = SVGroovy.Point;
  var hammertime = Hammer(document);
  
  parent.dispatchTouch = function(){
    // TDD with cumin method, gesture handler and deactivate return.
    var element = this.element,
      isComponent = this.isComponent,
      live = false,
      dragging = false,
      pinching = false;

    hammertime.on('touch', function(event){
      event.gesture.preventDefault();
      live = isComponent(event.target);
    });

    hammertime.on('drag', function(event){
      event.gesture.preventDefault();
      if (live && !pinching) {
        dragging = event;
        bean.fire(element, 'displace', Pt(event.gesture));
      }
    });

    hammertime.on('pinch', function(event){
      event.gesture.preventDefault();
      if (live) {
        dragging = false;
        pinching = event;
        bean.fire(element, 'inflate', event.gesture.scale);
      }
    });

    hammertime.on('release', function(){
      event.gesture.preventDefault();
      if (live) {
        if (dragging) { 
          bean.fire(element, 'translate', Pt(dragging.gesture));
        }
        if (pinching) {
          bean.fire(element, 'magnify', pinching.gesture.scale);
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
}(Hammerhead));
(function(parent){
  'use strict';
  //cumin compose map map
  // limit zoom
  // round pixels

  var Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox,
    xBtransform = _.compose(transformObject, Mx.asCss);

  parent.managePosition = function(){
    var $element = this.$element,
      element = this.element,
      properFix = missingCTM($element), // windows FIX
      viewBoxZoom = 1,
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
      requestAnimationFrame( function(){
        cancelAnimationFrame(animationLoop);
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
}(Hammerhead));
(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  parent.mousewheelDispatch = function(){
    
    var SVGElement = this.$element[0];
    var scale;
    var factor = 1 + this.getConfig('mousewheelSensitivity');

    var finishScrolling = _.debounce(this.getConfig('mousewheelDelay'))(function(scaleFactor){
      alertEnd({scale: scaleFactor});
      scale = null;
    });

    var handleMousewheel = function(event){
      if (!scale) {
        if (!this.isComponent(event.target)) return;

        scale = 1;
        alertStart('wheel');
      }

      if (event.wheelDelta > 0) {
        scale *= factor;
      } else {
        scale /= factor;
      }

      alertPinch({
        element: SVGElement,
        scale: scale});
      finishScrolling(scale);
    }.bind(this);

    $(document).on('mousewheel', handleMousewheel);
  };

}(Hammerhead));
(function(parent){
  "use strict";

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
    // parent.touchDispatch.call(instance);
    parent.managePosition.call(instance);
    // parent.mousewheelDispatch.call(instance);
    
    return instance;
  }
  parent.create = init;
}(Hammerhead));