var argsToList = function(x){
  return Array.prototype.slice.call(x);
};

var isArray = function(obj) {
  return (obj && obj.constructor === Array);
};

var isObj = function(obj) {
  return (typeof obj === "object" && !isArray(obj));
};

var isDefined = function(obj) {
  return (obj !== undefined);
};
// Definitions
// Arrays have index, element
// Objects have key, value
// Colletions have location, item

// uses underscore namespace,
// provides duplicate functionality for underscore.

// functions return frozen objects

// JavaScript all things? function(executable method invokable), collection, primitive, void(null undef)
var _ = (function(){

  var FROZEN = true;

// basic iterators

  function eachArray(operation){
  // iterates array left to right
  // assumes array type
    return function(array){
      for (var i = 0; i < array.length; i++) {
        operation(array[i], i);
      }
    };
  }

  function eachArrayRight(operation){
  // iterates array right to left
  // assumes array type
    return function(array){
      for (var i = array.length - 1; i > -1; i--) {
        operation(array[i], i);
      }
    };
  }

  function eachObject(operation){
  // iterates through object key/value pairs
  // no order assumed
    return function(object){
      eachArray(function(key){
        operation(object[key], key);
      })(Object.keys(object));
    };
  }

  function each(operation){
  // iterates through object/array/arguments
  // iterates left to right when given array/arguments
    return function(collection){
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        eachArray(operation)(collection);
      } else {
        eachObject(operation)(collection);
      }
    };
  }

// Basic collection operations

  function mapArray(operation){
    return function(array){
      var results = [];
      eachArray(function(element, index){
        results.push(operation(element, index));
      })(array);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  function mapObject(operation){
    return function(object){
      var results = {};
      eachObject(function(value, key){
        results[key] = operation(value, key);
      })(object);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  function map(operation){
    return function(collection){
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return mapArray(operation)(collection);
      } else {
        return mapObject(operation)(collection);
      }
    };
  }

  function filterArray(operation){
    return function(array){
      var results = [];
      eachArray(function(element, index){
        if (operation(element, index)) { results.push(element); }
      })(array);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  var rejectArray = compose(filterArray, not);

  function filterObject(operation){
    return function(object){
      var results = {};
      eachObject(function(value, key){
        if (operation(value, key)) { results[key] = value;}
      })(object);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  var rejectObject = compose(filterObject, not);

  function filter(operation){
    return function(collection){
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return filterArray(operation)(collection);
      } else {
        return filterObject(operation)(collection);
      }
    };
  }

  var reject = compose(filter, not);

  function reduce(initial){
    // The same code works here for arrays and objects so does not have varient.
    return function(operation){
      return function(){
        var memo = initial;
        each(function(item, location){
          memo = isDefined(memo) ? operation(memo)(item, location) : item;
        }).apply({}, arguments);
        return memo;
      };
    };
  }

// Higher collection operations

  function all(operation){
    operation = operation || I;
    return function(){
      var memo = true;
      each(function(item, location){
        memo = memo && operation(item, location);
      }).apply({}, arguments);
      return memo;
    };
    // return location of first fail or length as location??
  }

  function any(operation){
    operation = operation || I;
    return function(){
      var memo = false;
      each(function(item, location){
        memo = memo || operation(item, location);
      }).apply({}, arguments);
      return memo;
    };
    // return location of first success or length as location??
  }

  function min(operation){
    operation = operation || I;
    return function(){
      var memo;
      each(function(item){
        memo = memo && (operation(memo) < operation(item)) ? memo : item;
      }).apply({}, arguments);
      return memo;
    };
  }

  function max(operation){
    operation = operation || I;
    return function(){
      var memo;
      each(function(item){
        memo = memo && (operation(memo) > operation(item)) ? memo : item;
      }).apply({}, arguments);
      return memo;
    };
  }

// Array

  function cleave(n){
    return function(array){
      n = n < 0 ? array.length + n : n ;
      return [array.slice(0, n), array.slice(n)];
    };
  }

  function cyclic(n){
    var results = [];
    times(n)(function(){
      results.push([]);
    });
    return function(collection){
      eachArray(function(element, index){
        results[index % n].push(element);
      })(collection);
      return results;
    };
  }

  function within(array){
    if (arguments.length > 1) {
      array = argsToList(arguments);
    }
    return function(item){
      return array.indexOf(item) !== -1;
    };
  }

// Object 

  function extend(extra){
    // adds extra key vales to second passed object
    return function(object){
      eachObject(function(value, key){
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function augment(object){
    return function(extra){
      eachObject(function(value, key){
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function foundation(object){
    // builds a new object from the properties of a foundation object and extention object.
    return function(extra){
      var results = {};
      each(eachObject(function(value, key){
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN? Object.freeze(results) : results;
    };
  }

  function overlay(extra){
    // builds a new object from the properties of a foundation object and extention object.
    return function(object){
      var results = {};
      each(eachObject(function(value, key){
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN? Object.freeze(results) : results;
    };
  }  

// Function operations

  function compose(){
    var funcs = arguments;
    return function(){
      var args = arguments;
      eachArrayRight(function(func){
        args = [func.apply(this, args)];
      })(funcs);
      return args[0];
    };
  }

  function invoke(){
    var args = arguments;
    return function(func){
      return func.apply({}, args);
    };
  }

  function debounce(wait){
    return function(func){
      var timeout, args;
      return function(){
        args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          func.apply({}, args);
        }, wait);
      };
    };
  }

  function throttle(wait){
    return function(func){
      var timeout, args;
      return function(){
        args = arguments;
        if (timeout) { return; }
        timeout = setTimeout(function(){
          timeout = null;
          func.apply({}, args);
        }, wait);
      };
    };
  }

  function times(n){
    return function(operation){
      for (var i = 0; i < n; i++){
        operation(i);
      }
    };
  }

  function not(func){
    return function(){
      return !func.apply({}, arguments);
    };
  }

// Utilities

  function I(x){
    return x;
  }

  function dot(key){
    return function(obj){
      if (isArray(key) || isObj(key)) {
        return map(invoke(obj))(map(dot)(key));
      }
      return obj[key];
    };
  }

  var now = Date.now || function() { return new Date().getTime(); };

  function random(max){
    return function(){
      return Math.random()*max|0;
    };
  }

  function expose(nameList){
    var fNames = nameList.split(' ');
    eachArray(function(fName){
      window[fName] = _[fName];
    })(fNames);
  }

  function defreeze(){
    FROZEN = false;
  }

  function refreeze(){
    FROZEN = true;
  }

  function size(collection){
    return collection.length || Object.keys(collection).length;
  }

  function log(){
    console.log.apply(console, arguments);
  }

  function position(func){
    return function(item, position){
      return func(position);
    };
  }

  function equals(a){
    return function(b){
      return a === b;
    };
  }
  var _ =  {
    eachArray: eachArray,
    eachArrayRight: eachArrayRight,
    eachObject: eachObject,
    each: each,

    mapArray: mapArray,
    mapObject: mapObject,
    map: map,

    filterArray: filterArray,
    rejectArray: rejectArray,
    filterObject: filterObject,
    rejectObject: rejectObject,
    filter: filter,
    reject: reject,
    reduce: reduce,

    all: all, //poss every 
    any: any, //poss sum use any as anything eg first from obj or and shift to obj
    min: min, 
    max: max,

    cyclic: cyclic,
    cleave: cleave,
    within: within,

    extend: extend,
    augment: augment,
    foundation: foundation,
    overlay: overlay,

    compose: compose,
    invoke: invoke,
    debounce: debounce,
    throttle: throttle,
    not: not,

    I: I,
    dot: dot,
    now: now,
    times: times,
    random: random,

    expose: expose,
    defreeze: defreeze,
    refreeze: refreeze,
    size: size,
    log: log,
    position: position,
    equals: equals,
  };
  return _;
}());
/*! cumin 22-06-2014 */
!function(a){a.round=function(a){a=a||0;var b=Math.pow(10,a),c=Math.pow(.1,a+1);return function(a){return Math.round(a*b+c)/b}}}(_);
/*! cumin 22-06-2014 */
!function(a){a.pluck=a.compose(a.map,a.dot),a.pick=a.compose(a.filter,a.position,a.within),a.omit=a.compose(a.filter,a.position,a.not,a.within)}(_);
(function (global) {
  "use strict";

  var instance;

  function init(){
    var channels = {};
    var uid = -1;

    function subscribe(topic){
      return function(reaction){
        var channel = channels[topic] = channels[topic] || {};
        channel[++uid] = reaction;
        return uid;
      };
    }

    function publish(topic){
      return function(content){
        var response = false;
        _.eachObject(function(action){
          action(content, topic);
          response = true;
        })(channels[topic] || {});
        return response;
      };
    }

    function unsubscribe(topic){
      return function(uid){
        if (uid) {
          delete channels[topic][uid];
        } else {
          channels[topic] = {};
        }
      };
    }

    return{
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      publish: publish
    };
  }

  global.Belfry = {
    getTower: function(){
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
}(this));
var SVGroovy = {};
(function(parent){
  "use strict";

  var darkSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  var origin = darkSVG.createSVGPoint();

  function create(x, y){
    if (isObj(x)) {
      if (x.x) {
        return createFromCoordinate(x);
      } else if (x.pageX) {
        return createFromPagePoint(x);
      } else if (x.deltaX) {
        return createFromDisplacementVector(x);
      }
    }
    var tmp = darkSVG.createSVGPoint();
    tmp.x = x || 0;
    tmp.y = y || 0;
    return Object.freeze(tmp);
  }

  function createFromCoordinate(point){
    return create(point.x, point.y);
  }

  function createFromPagePoint(pagePoint){
    return create(pagePoint.pageX, pagePoint.pageY);
  }

  function createFromDisplacementVector(pagePoint){
    return create(pagePoint.deltaX, pagePoint.deltaY);
  }

  function add(p){
    return function(q){
      return create(p.x + q.x, p.y + q.y);
    };
  }

  function subtract(p){
    return function(q){
      return create(p.x - q.x, p.y - q.y);
    };
  }

  function negate(p){
    return function(q){
      q = q || create();
      return create(q.x - p.x, q.y - p.y);
    };
  }

  function scalar(a){
    return function(q){
      return create(a * q.x, a * q.y);
    };
  }

  function min(p){
    return function(q){
      var x = (p.x < q.x)? p.x : q.x;
      var y = (p.y < q.y)? p.y : q.y;
      return create(x, y);
    };
  }

  function max(p){
    return function(q){
      var x = (p.x > q.x)? p.x : q.x;
      var y = (p.y > q.y)? p.y : q.y;
      return create(x, y);
    };
  }

  function matrixTransform(m){
    return function(q){
      return Object.freeze(q.matrixTransform(m));
    };
  }

  parent.Point = _.extend({
    createFromCoordinate: createFromCoordinate,
    createFromPagePoint: createFromPagePoint,
    createFromDisplacementVector: createFromDisplacementVector,
    add: add,
    subtract: subtract,
    negate: negate,
    scalar: scalar,
    min: min,
    max: max,
    matrixTransform: matrixTransform
  })(create);
}(SVGroovy));
(function(parent){
  "use strict";

  var darkSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  function create(){
    return darkSVG.createSVGMatrix();
  }
  parent.Matrix = create;
  parent.Matrix.scaling = function(scalar){
    return create().scale(scalar);
  };
  parent.Matrix.translating = function(x, y){
    return create().translate(x, y);
  };
}(SVGroovy));
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

  var buildConfig = _.foundation({
    overflowSurplus: 0.5,
    resizeDelay: 200
  });

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  $(window).on('resize', tower.publish('windowResize'));

  function createOverflowUpdater(options){
    var config = buildConfig(options);

    var surplus = config.overflowSurplus;
    var factor = 2 * surplus + 1;
    var $parent = this.$element.parent();

    return _.debounce(config.resizeDelay)(function(){
      var height = $parent.height();
      var width = $parent.width();
      this.$element
        .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
        .width(width * factor)
        .height(height * factor);
    }).bind(this);
  }

  parent.regulateOverflow = function(options){
    var updateOverflow = createOverflowUpdater.call(this, options);
    
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

  var buildConfig = _.foundation({
    maxZoom: 2,
    minZoom: 0.5
  });

  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  var XBtransform = _.compose(transformObject, Mx.asCss);

  parent.managePosition = function($element, options){
    var config = buildConfig(options),
      properFix = missingCTM($element), // windows FIX
      viewBoxZoom = 1;

    var HOME = viewBox = VB($element.attr('viewBox'));
    
    var animationLoop,
      thisScale,
      maxScale,
      minScale,
      currentMatrix;

    listenStart(function(){
      beginAnimation();
      maxScale = config.maxZoom/viewBoxZoom;
      minScale = config.minZoom/viewBoxZoom;
      thisScale = 1;
    });

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

  var buildConfig = _.foundation({
    mousewheelSensitivity: 0.1,
    mousewheelDelay: 200
  });

  parent.mousewheelDispatch = function(options){
    var config = buildConfig(options);
    
    var SVGElement = this.$element[0];
    var scale;
    var onTarget = checkSVGTarget(SVGElement);
    var factor = 1 + config.mousewheelSensitivity;

    var finishScrolling = _.debounce(config.mousewheelDelay)(function(scaleFactor){
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

  var overflowSettings = _.pick('overflowSurplus', 'resizeDelay');
  var managePositionSettings = _.pick('maxZoom', 'minZoom');
  var mousewheelSettings = _.pick('mousewheelSensitivity', 'mousewheelDelay');

  var prototype = {
    home: tower.publish('home')
  };

  function init(svgId, options){
    var $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    options = options || {};

    var instance = Object.create(prototype);
    instance.$element = $svg;
    instance.isComponent = checkSVGTarget($svg[0]);

    // parent.regulateOverflow($svg, overflowSettings(options));
    parent.regulateOverflow.call(instance, overflowSettings(options));
    parent.touchDispatch($svg);
    parent.managePosition($svg, managePositionSettings(options));
    // parent.mousewheelDispatch($svg, mousewheelSettings(options));
    parent.mousewheelDispatch.call(instance, mousewheelSettings(options));

    return instance;
  }
  parent.create = init;
}(Hammerhead));