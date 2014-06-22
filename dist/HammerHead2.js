// String interpolations

function interpolate(s) {
  var i = 0;
  return function(args){
    return s.replace(/%(?:\(([^)]+)\))?([%diouxXeEfFgGcrs])/g, function (match, v, t) {
      if (t == "%") return "%";
      return args[v || i++];
    });
  };
}

// check svg owner

function checkSVGTarget(svg){
  return function(target){
    return (target.ownerSVGElement || target) === svg;
  };
}

// Request animation frame polyfill

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
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

  var buildConfig = _.foundation({
    overflowSurplus: 0.5,
    resizeDelay: 200
  });

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  $(window).on('resize', tower.publish('windowResize'));

  function createOverflowUpdater($element, options){
    var config = buildConfig(options);

    var surplus = config.overflowSurplus;
    var factor = 2 * surplus + 1;
    var $parent = $element.parent();

    return _.debounce(config.resizeDelay)(function(){
      var height = $parent.height();
      var width = $parent.width();
      $element
        .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
        .width(width * factor)
        .height(height * factor);
    });
  }

  parent.regulateOverflow = function(element, options){
    var updateOverflow = createOverflowUpdater(element, options);
    
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
    VB = parent.ViewBox,
    identityMatrix = Mx(),
    matrixAsCss = interpolate('matrix(%(a)s, %(b)s, %(c)s, %(d)s, %(e)s, %(f)s)');

  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  var transformObject = function(matrixString){
    return {
      '-webkit-transform': matrixString,
      '-ms-transform': matrixString,
      'transform': matrixString
    };
  };

  parent.managePosition = function($element){
    var properFix = missingCTM($element); // windows FIX

    var animationLoop, matrixString;
    var viewBox = VB($element.attr('viewBox'));

    listenStart(function(){
      beginAnimation();
    });

    listenDrag(function(data){
      matrixString = matrixAsCss(Mx.translating(data.delta.x, data.delta.y));
    });

    listenPinch(function(data){
      matrixString = matrixAsCss(Mx.scaling(data.scale));
    });

    listenEnd(function(data){
      if (data.scale === 1) {
        var fixedTranslation = Pt.scalar(properFix)(data.delta);
        var inverseCTM = $element[0].getScreenCTM().inverse();
        inverseCTM.e = 0;
        inverseCTM.f = 0;
        var scaleTo = Pt.matrixTransform(inverseCTM);
        var svgTrans = scaleTo(fixedTranslation);
        viewBox = VB.translate(svgTrans)(viewBox);
      } else{
        viewBox = VB.zoom(data.scale)()(viewBox);
      }
      vbString = VB.attrString(viewBox);
      matrixString =  matrixAsCss(identityMatrix);
      cancelAnimationFrame(animationLoop);
      requestAnimationFrame(function(){
        $element.attr('viewBox', vbString);
        $element.css(transformObject(matrixString));
      });
    });

    function render(){
      $element.css(transformObject(matrixString));
      animationLoop = requestAnimationFrame( render );
    }

    function beginAnimation(){
      animationLoop = requestAnimationFrame( render );
    }

    $element.css(transformObject(matrixAsCss(identityMatrix)))
      .css({
        '-webkit-backface-visibility': 'hidden',
        '-webkit-transform-origin': '50% 50%',
        '-ms-transform-origin': '50% 50%',
        'transform-origin': '50% 50%'
      });
  };
}(Hammerhead));
(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  var buildConfig = _.foundation({
    mousewheelSensitivity: 0.1
  });

  parent.mousewheelDispatch = function($element, options){
    var config = buildConfig(options);
    
    var SVGElement = $element[0];
    var scale;
    var onTarget = checkSVGTarget(SVGElement);
    var factor = 1 + config.mousewheelSensitivity;

    var finishScrolling = _.debounce(200)(function(scaleFactor){
      alertEnd({scale: scaleFactor});
      scale = null;
    });

    $(document).on('mousewheel', function(event){
      if (!scale) {
        if (!onTarget(event.target)) return;

        scale = 1;
        alertStart('wheel');
      }

      if (event.wheelDelta > 0) {
        scale *= factor;
      } else{
        scale /= factor;
      }

      alertPinch({
        element: SVGElement,
        scale: scale});
      finishScrolling(scale);
    });
  };

}(Hammerhead));
(function(parent){
  var mousewheelSettings = _.pick('mousewheelSensitivity');

  var overflowSettings = _.pick('overflowSurplus');

  function init(svgId, options){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    options = options || {};

    parent.regulateOverflow($svg, overflowSettings(options));
    parent.touchDispatch($svg);
    parent.managePosition($svg);
    parent.mousewheelDispatch($svg, mousewheelSettings(options));
  }
  parent.create = init;
}(Hammerhead));