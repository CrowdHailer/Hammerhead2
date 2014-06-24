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

_.debounce = function(wait){
  return function(func){
    var timeout, args;
    return function(){
      var context = this;
      args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function(){
        func.apply(context, args);
      }, wait);
    };
  };
};

_.peruse = function(obj){
  return function(key){
    return obj[key];
  };
};

//SVGroovy fills NB requires interpolate

SVGroovy.Matrix.asCss = function(matrix){
  return interpolate('matrix(%(a)s, %(b)s, %(c)s, %(d)s, %(e)s, %(f)s)')(matrix || SVGroovy.Matrix());
};

SVGroovy.Matrix.forTranslation = function(point){
  return SVGroovy.Matrix.translating(point.x, point.y);
};

SVGroovy.Matrix.forMagnification = function(scale){
  return SVGroovy.Matrix.scaling(scale);
};

// check svg owner

function checkSVGTarget(svg){
  return function(target){
    return (target.ownerSVGElement || target) === svg;
  };
}

var hammertime = Hammer(document);

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
  var tower = Belfry.getTower();

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  $(window).on('resize', tower.publish('windowResize'));

  function createOverflowUpdater(){

    var surplus = this.getConfig('overflowSurplus');
    var factor = 2 * surplus + 1;
    var $parent = this.$element.parent();

    return _.debounce(this.getConfig('resizeDelay'))(function(){
      var height = $parent.height();
      var width = $parent.width();
      this.$element
        .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
        .width(width * factor)
        .height(height * factor);
    }).bind(this);
  }

  parent.regulateOverflow = function(){
    var updateOverflow = createOverflowUpdater.call(this);
    
    updateOverflow();
    tower.subscribe('windowResize')(updateOverflow);
  };
}(Hammerhead));
(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertDrag = tower.publish('drag');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  function watchTouch(event){
    if (event.target.ownerSVGElement === this.getElement()) {
      this.handlers.touch = false;
      this.handlers.drag = handleDrag;
      this.handlers.pinch = handlePinch;
      this.handlers.release = endHandler;
      alertStart(this.getElement());
    }
    return this;
  }

  function handleDrag(event){
    alertDrag({
      element: this.getElement(),
      delta: SVGroovy.Point(event.gesture)
    });
    return this;
  }

  function handlePinch(event){
    this.handlers.drag = false;
    alertPinch({
      element: this.getElement(),
      center: SVGroovy.Point(event.gesture.center),
      scale: event.gesture.scale
    });
    return this;
  }

  function endHandler(event){
    this.handlers.touch = watchTouch;
    this.handlers.drag = false;
    this.handlers.pinch = false;
    alertEnd({
      element: this.getElement(),
      delta: SVGroovy.Point(event.gesture),
      scale: event.gesture.scale
    });
    return this;
  }

  parent.touchDispatch = function($element){
    var element = $element[0];

    var instance = Object.create({});
    instance.getElement = function(){
      return element;
    };
    instance.handlers = {
      touch: watchTouch,
    };

    function gestureHandler(event){
      event.gesture.preventDefault();
      if(instance.handlers[event.type]) {
        instance = instance.handlers[event.type].call(instance, event);
      }
    }

    instance.activate = function activate(){
      hammertime.on('touch drag pinch release', gestureHandler);
    };

    instance.deactivate = function deactivate(){
      hammertime.off('touch drag pinch release', gestureHandler);
    };

    instance.activate();
    return instance;

  };
}(Hammerhead));
(function(parent){
  var tower = Belfry.getTower(),
    Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox;

  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  var XBtransform = _.compose(transformObject, Mx.asCss);

  parent.managePosition = function(){
    var $element = this.$element;
    var properFix = missingCTM($element), // windows FIX
      viewBoxZoom = 1;

    var HOME = viewBox = VB($element.attr('viewBox'));

    var animationLoop,
      thisScale,
      maxScale,
      minScale,
      currentMatrix;

    listenStart(function(){
      beginAnimation();
      maxScale = this.getConfig('maxZoom')/viewBoxZoom;
      minScale = this.getConfig('minZoom')/viewBoxZoom;
      thisScale = 1;
    }.bind(this));

    listenDrag(function(data){
      currentMatrix = Mx.forTranslation(data.delta);
    });

    listenPinch(function(data){
      var scale = Math.max(Math.min(data.scale, maxScale), minScale);
      currentMatrix = Mx.forMagnification(scale);
      thisScale = scale;
    });

    listenEnd(function(data){
      if (thisScale === 1) {
        var fixedTranslation = Pt.scalar(properFix)(data.delta);
        var inverseCTM = $element[0].getScreenCTM().inverse();
        inverseCTM.e = 0;
        inverseCTM.f = 0;
        var scaleTo = Pt.matrixTransform(inverseCTM);
        var svgTrans = scaleTo(fixedTranslation);
        viewBox = VB.translate(svgTrans)(viewBox);
      } else{
        var scale = Math.max(Math.min(thisScale, maxScale), minScale);
        viewBoxZoom *= scale;
        viewBox = VB.zoom(scale)()(viewBox);
      }
      cancelAnimationFrame(animationLoop);
      currentMatrix = Mx();
      requestAnimationFrame(function(){
        $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
        $element.css(XBtransform());
      });
    });

    function render(){
      $element.css(XBtransform(currentMatrix));
      animationLoop = requestAnimationFrame( render );
    }

    function beginAnimation(){
      animationLoop = requestAnimationFrame( render );
    }

    $element.css(XBtransform());
    $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));

    tower.subscribe('home')(function(){
      $element.css(XBtransform());
      viewBox = HOME;
      $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
    });
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

  var tower = Belfry.getTower();

  var prototype = {
    home: function(){
      tower.publish('home')(this.$element[0]);
    }
  };

  var buildConfig = _.foundation({
    mousewheelSensitivity: 0.1,
    mousewheelDelay: 200,
    maxZoom: 2,
    minZoom: 0.5,
    overflowSurplus: 0.5,
    resizeDelay: 200
  });

  var noElement = interpolate("SVG element '%(id)s' not found");

  function init(svgId, options){
    var $svg = $('svg#' + svgId);
    var element = $svg[0];

    if (!element) {
      console.warn(noElement({id: svgId}));
      return false;
    }

    var instance = Object.create(prototype);
    instance.$element = $svg;
    instance.element = element;
    instance.isComponent = checkSVGTarget(element);
    instance.getConfig = _.peruse(buildConfig(options));

    parent.regulateOverflow.call(instance);
    parent.touchDispatch($svg);
    parent.managePosition.call(instance);
    parent.mousewheelDispatch.call(instance);

    return instance;
  }
  parent.create = init;
}(Hammerhead));