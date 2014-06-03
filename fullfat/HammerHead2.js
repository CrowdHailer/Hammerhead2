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

  function reduce(memo){
    // The same code works here for arrays and objects so does not have varient.
    return function(operation){
      return function(){
        each(function(item, location){
          memo = isDefined(memo) ? operation(memo)(item, location) : item;
        }).apply({}, arguments);
        return memo;
      };
    };
  }

// Higher collection operations

  function all(operation){
    var memo = true;
    operation = operation || I;
    return function(){
      each(function(item, location){
        memo = memo && operation(item, location);
      }).apply({}, arguments);
      return memo;
    };
  }

  function any(operation){
    var memo = false;
    operation = operation || I;
    return function(){
      each(function(item, location){
        memo = memo || operation(item, location);
      }).apply({}, arguments);
      return memo;
    };
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
      results = {};
      each(eachObject(function(value, key){
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN? Object.freeze(results) : results;
    };
  }

  function overlay(extra){
    // builds a new object from the properties of a foundation object and extention object.
    return function(object){
      results = {};
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
      func.apply({}, args);
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
  };
  return _;
}());
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
// Rounding decimals

function limitDecPlaces(dp){
  dp = dp || 0;
  var factor = Math.pow(10, dp);
  var bump = Math.pow(0.1, dp + 1); // needed for case 2 d.p on 1.005
  return function(num){
    return Math.round(num * factor + bump) / factor;
  };
}

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
  var VB = parent.ViewBox;
  var Pt = SVGroovy.Point;
  prototype = {
    translate: function(delta){
      var newViewBox = VB.translate(delta)(this.getCurrent());
      this.setTemporary(newViewBox);
      return this;
    },
    scale: function(magnification, center){
      var newViewBox = VB.zoom(magnification)(center)(this.getCurrent());
      this.setTemporary(newViewBox);
      return this;
    },
    drag: function(screenDelta){
      var delta = this.scaleTo()(screenDelta);
      return this.translate(delta);
    },
    zoom: function(scale, screenCenter){
      var center;
      if (screenCenter) {
        center = this.mapTo()(screenCenter);
      }
      return this.scale(scale, center);
    },
    mapTo: function(){
      return Pt.matrixTransform(this.getScreenCTM().inverse());
    },
    scaleTo: function(){
      var inverseCTM = this.getScreenCTM().inverse();
      inverseCTM.e = 0;
      inverseCTM.f = 0;
      return Pt.matrixTransform(inverseCTM);
    }
  };
  function create(element, options){
    var temporary, current, HOME;
    current = temporary = HOME =  parent.ViewBox(element.getAttribute('viewBox'));

    var instance = Object.create(prototype);
    _.extend({
      getCurrent: function(){ return current; },
      getTemporary: function(){ return temporary; },
      setTemporary: function(value){ temporary = value; },
      fix: function(){ current = temporary; },
      getScreenCTM: function(){ return element.getScreenCTM(); }
    })(instance);
    return instance;
  }

  parent.AgileView = create;
}(Hammerhead));
(function(parent){
  var tower = Belfry.getTower();

  function createOverflowUpdater($element){
    $parent = $element.parent();
    return function(){
      var height = $parent.height();
      var width = $parent.width();
      $element.css('margin', -height/2 + ' ' + -width/2);
      $element.width(width * 2);
      $element.height(height * 2);
    };
  }

  var publishResize = _.debounce(200)(tower.publish('windowResize'));

  $(window).on('resize', function(){
    publishResize();
  });

  parent.regulateOverflow = function(element){
    var updateOverflow = createOverflowUpdater(element);
    
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
    this.handlers.pinch = false;
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
      element: this.getElement()
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
  var tower = Belfry.getTower();

  var matrixAsCss = interpolate('matrix(%(a)s, %(b)s, %(c)s, %(d)s, %(e)s, %(f)s)');

  var Mx = SVGroovy.Matrix;
  var identityMatrix = Mx();

  var Pt = SVGroovy.Point;


  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  parent.managePosition = function($element){
    // windows FIX
    var elWidth = $element.width();
    var elHeight = $element.height();
    var ctmScale = $element[0].getScreenCTM().a;
    var boxWidth = $element.attr('viewBox').split(' ')[2];
    var boxHeight = $element.attr('viewBox').split(' ')[3];

    var widthRatio = (boxWidth* ctmScale) / elWidth;
    var heightRatio = (boxHeight * ctmScale) / elHeight;
    var properFix = widthRatio > heightRatio ? widthRatio : heightRatio;
    properFix = limitDecPlaces(1)(properFix);

    ////////////////////////////

    var aniFrame, continueAnimate, matrixString;
    var agile = Hammerhead.AgileView($element[0]);

    listenStart(function(){
      continueAnimate = true;
      beginAnimation();
    });

    listenDrag(function(data){
      // compose matrix creating from data and matrixAsCss using cumin
      matrixString = matrixAsCss(Mx.translating(data.delta.x, data.delta.y));
      var translation = Pt(data.delta);
      var fixedTranslation = Pt.scalar(properFix)(translation);
      console.log(translation, fixedTranslation);
      agile.drag(fixedTranslation);
    });

    listenPinch(function(data, topic){
      matrixString = matrixAsCss(Mx.scaling(data.scale));
      agile.zoom(data.scale);
    });
    var vbString, vbChange;
    listenEnd(function(){
      agile.fix();
      vbString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      vbChange = true;
      matrixString =  matrixAsCss(identityMatrix);
      continueAnimate = false;
    });

    function render(){
      $element.css({
        '-webkit-transform': matrixString,
        '-ms-transform': matrixString,
        'transform': matrixString
      });
      if (vbString) {
        vbChange = false;
        $element.attr('viewBox', vbString);
      }
      if (continueAnimate) {
        aniFrame = requestAnimationFrame( render );
      }
    }

    function beginAnimation(){
      aniFrame = requestAnimationFrame( render );
    }

    $element.css({
      '-webkit-transform': matrixAsCss(identityMatrix),
      'transform': matrixAsCss(identityMatrix),
      '-webkit-backface-visibility': 'hidden',
      '-webkit-transform-origin': '50% 50%',
      '-ms-transform-origin': '50% 50%',
      'transform-origin': '50% 50%'
    });


  };
}(Hammerhead));
(function(parent){
  function init(svgId){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    parent.regulateOverflow($svg);
    parent.touchDispatch($svg);
    parent.managePosition($svg);
    parent.mousewheelDispatch($svg);
  }
  parent.create = init;
}(Hammerhead));