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
var _ = (function () {
  'use strict';

  var FROZEN = true;
  var BREAKER = {};

// basic iterators

  function eachArray(operation) {
  // iterates array left to right
  // assumes array type
    return function (array) {
      for (var i = 0; i < array.length; i++) {
        if (operation.call(this, array[i], i) === BREAKER) { return; }
      }
    };
  }

  function eachArrayRight(operation) {
  // iterates array right to left
  // assumes array type
    return function (array) {
      for (var i = array.length - 1; i > -1; i--) {
        if (operation.call(this, array[i], i) === BREAKER) { return; }
      }
    };
  }

  function eachObject(operation) {
  // iterates through object key/value pairs
  // no order assumed
    return function (object) {
      var context = this;
      eachArray(function (key) {
        return operation.call(context, object[key], key);
      })(Object.keys(object));
    };
  }

  function each(operation) {
  // iterates through object/array/arguments
  // iterates left to right when given array/arguments
    return function (collection) {
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        eachArray(operation).call(this, collection);
      } else {
        eachObject(operation).call(this, collection);
      }
    };
  }

// Basic collection operations

  function mapArray(operation) {
    return function (array) {
      var results = [];
      eachArray(function (element, index) {
        results.push(operation.call(this, element, index));
      }).call(this, array);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function mapObject(operation) {
    return function (object) {
      var results = {};
      eachObject(function (value, key) {
        results[key] = operation.call(this, value, key);
      }).call(this, object);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function map(operation) {
    return function (collection) {
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return mapArray(operation).call(this, collection);
      } else {
        return mapObject(operation).call(this, collection);
      }
    };
  }

  function filterArray(operation) {
    return function (array) {
      var results = [];
      eachArray(function (element, index) {
        if (operation.call(this, element, index)) { results.push(element); }
      }).call(this, array);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function filterObject(operation) {
    return function (object) {
      var results = {};
      eachObject(function (value, key) {
        if (operation.call(this, value, key)) { results[key] = value; }
      }).call(this, object);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function filter(operation) {
    return function (collection) {
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return filterArray(operation).call(this, collection);
      } else {
        return filterObject(operation).call(this, collection);
      }
    };
  }

  function reduce(initial) {
    // The same code works here for arrays and objects so does not have varient.
    return function (operation) {
      return function () {
        var memo = initial;
        each(function (item, location) {
          memo = isDefined(memo) ? operation.call(this, memo).call(this, item, location) : item;
        }).apply(this, arguments);
        return memo;
      };
    };
  }

// Higher collection operations

  function find(predicate) {
    return function() {
      var result;
      each(function (item) {
        if (predicate.call(this, item)) {
          result = item;
          return BREAKER;
        }
      }).apply(this, arguments);
      return result;
    };
  }

  function all(operation) {
    operation = operation || I;
    return function () {
      var memo = true;
      each(function (item, location) {
        memo = operation.call(this, item, location);
        return memo ? undefined : BREAKER;
      }).apply(this, arguments);
      return memo;
    };
    // return location of first fail or length as location??
  }

  function any(operation) {
    operation = operation || I;
    return function () {
      var memo = false;
      each(function (item, location) {
        memo = operation.call(this, item, location);
        return memo ? BREAKER : undefined;
      }).apply(this, arguments);
      return memo;
    };
    // return location of first success or length as location??
  }

  function min(operation) {
    operation = operation || I;
    return function () {
      var memo;
      each(function (item) {
        memo = memo && (operation.call(this, memo) < operation.call(this, item)) ? memo : item;
      }).apply(this, arguments);
      return memo;
    };
  }

  function max(operation) {
    operation = operation || I;
    return function () {
      var memo;
      each(function (item) {
        memo = memo && (operation.call(this, memo) > operation.call(this, item)) ? memo : item;
      }).apply(this, arguments);
      return memo;
    };
  }

// Array

  function cleave(n) {
    return function (array) {
      n = n < 0 ? array.length + n : n;
      return [array.slice(0, n), array.slice(n)];
    };
  }

  function cyclic(n) {
    var results = [];
    times(n)(function () {
      results.push([]);
    });
    return function (collection) {
      eachArray(function (element, index) {
        results[index % n].push(element);
      })(collection);
      return results;
    };
  }

  function within(array) {
    if (arguments.length > 1) {
      array = argsToList(arguments);
    }
    return function (item) {
      return array.indexOf(item) !== -1;
    };
  }

// Object 

  function extend(extra) {
    // adds extra key vales to second passed object
    return function (object) {
      eachObject(function (value, key) {
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function augment(object) {
    return function (extra) {
      eachObject(function (value, key) {
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function foundation(object) {
    // builds a new object from the properties of a foundation object and extention object.
    return function (extra) {
      var results = {};
      each(eachObject(function (value, key) {
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function overlay(extra) {
    // builds a new object from the properties of a foundation object and extention object.
    return function (object) {
      var results = {};
      each(eachObject(function (value, key) {
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN ? Object.freeze(results) : results;
    };
  }

// Function operations

  function adjoin(f) {
    return function (g) {
      return function () {
        return f.call(this, (g.apply(this, arguments)));
      };
    };
  }

  function invoke() {
    var args = arguments;
    return function (func) {
      return func.apply(this, args);
    };
  }

  function postpone(func) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
      return func.apply(this, args);
    };
  }

  function times(n) {
    return function (operation) {
      for (var i = 0; i < n; i++) {
        operation.call(this, i);
      }
    };
  }

  function debounce(wait) {
    return function (func) {
      var timeout, args;
      return function () {
        var context = this;
        args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      };
    };
  }

  function throttle(wait) {
    return function (func) {
      var timeout, args;
      return function () {
        args = arguments;
        var context = this;
        if (timeout) { return; }
        timeout = setTimeout(function () {
          timeout = null;
          func.apply(context, args);
        }, wait);
      };
    };
  }

  function not(func) {
    return function () {
      return !func.apply(this, arguments);
    };
  }

// Utilities

  function I(x) {
    return x;
  }

  function dot(key) {
    return function (obj) {
      if (isArray(key) || isObj(key)) {
        return map(invoke(obj))(map(dot)(key));
      }
      return obj[key];
    };
  }

  function method(key) {
    return function (obj) {
      return obj && obj[key] && obj[key]();
    };
  }

  var now = Date.now || function () { return new Date().getTime(); };

  function expose(nameList) {
    var fNames = nameList.split(' ');
    eachArray(function (fName) {
      window[fName] = _[fName];
    })(fNames);
  }

  function defreeze() {
    FROZEN = false;
  }

  function refreeze() {
    FROZEN = true;
  }

  function BREAK() {
    return BREAKER;
  }

  function size(collection) {
    return collection.length || Object.keys(collection).length;
  }

  function log() {
    console.log.apply(console, arguments);
  }

  function position(func) {
    return function (item, position) {
      return func(position);
    };
  }

  function equals(a) {
    return function (b) {
      return a === b;
    };
  }

  var compose = reduce()(adjoin);
  var rejectArray = compose(filterArray, not);
  var rejectObject = compose(filterObject, not);
  var reject = compose(filter, not);

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

    find: find,
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

    adjoin: adjoin,
    compose: compose,
    invoke: invoke,
    postpone: postpone,
    debounce: debounce,
    throttle: throttle,
    not: not,

    I: I,
    dot: dot,
    method: method,
    now: now,
    times: times,

    expose: expose,
    defreeze: defreeze,
    refreeze: refreeze,
    size: size,
    log: log,
    position: position,
    equals: equals,
    BREAK: BREAK
  };
  return _;
}());
/*! cumin 04-07-2014 */
!function(a){"use strict";function b(a){a=a||0;var b=Math.pow(10,a),c=Math.pow(.1,a+1);return function(a){return Math.round(a*b+c)/b}}function c(a){return a=a||0,function(){return Math.random()*a|0}}a.round=b,a.random=c}(_);
/*! cumin 04-07-2014 */
!function(a){a.pluck=a.compose(a.map,a.dot),a.pick=a.compose(a.filter,a.position,a.within),a.omit=a.compose(a.filter,a.position,a.not,a.within)}(_);
var SVGroovy = {};
(function(parent){
  "use strict";

  var darkSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

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
  parent.Matrix.toScale = function(scalar){
    return create().scale(scalar);
  };
  parent.Matrix.toTranslate = function(point){
    return create().translate(point.x, point.y);
  };
}(SVGroovy));
/* global _, SVGroovy*/

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

/* global Hammerhead, _, SVGroovy*/

(function(parent){
  'use strict';

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
/* global Hammerhead, bean, interpolate*/

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
/* global Hammerhead, bean, SVGroovy, Hammer*/

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
        dragging = Pt(event.gesture);
        bean.fire(element, 'displace', Pt(event.gesture));
      }
    });

    hammertime.on('pinch', function(event){
      event.gesture.preventDefault();
      if (live) {
        dragging = false;
        pinching = event.gesture.scale;
        bean.fire(element, 'inflate', pinching);
      }
    });

    hammertime.on('release', function(){
      event.gesture.preventDefault();
      if (live) {
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
}(Hammerhead));
/* global Hammerhead, _, bean, SVGroovy, transformObject, missingCTM, requestAnimationFrame, cancelAnimationFrame*/

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
      requestAnimationFrame( function(){
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
/* global Hammerhead, _, bean*/

(function(parent){
  'use strict';

  parent.mousewheelDispatch = function(){

    
    var element = this.$element[0];
    var scale;
    var factor = 1 + this.getConfig('mousewheelSensitivity');

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

}(Hammerhead));
/* global Hammerhead, _, interpolate*/

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