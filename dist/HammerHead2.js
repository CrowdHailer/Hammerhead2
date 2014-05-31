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

Hammerhead = {};

(function(parent){
  "use strict";
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
    return Object.freeze({x: x || 0, y: y || 0});
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
      var x = m.a * q.x + m.c * q.y + m.e;
      var y = m.b * q.x + m.d * q.y + m.f;
      return create(x, y);
    };
  }

  var methodsToExtend = _.extend({
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
  });

  methodsToExtend(create);
  parent.Point = create;
}(Hammerhead));
(function(parent){
  var Pt = parent.Point;
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
  var Pt = parent.Point;
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
      return Pt.matrixTransform(_.foundation(this.getScreenCTM().inverse())({e: 0, f: 0}));
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
/*!
* Pub/Sub implementation
* http://addyosmani.com/
* Licensed under the GPL
* http://jsfiddle.net/LxPrq/
*/


;(function ( window, doc, undef ) {

    var topics = {},
        subUid = -1,
        pubsubz ={};

    pubsubz.publish = function ( topic, args ) {

        if (!topics[topic]) {
            return false;
        }

        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;

        while (len--) {
            subscribers[len].func(topic, args);
        }

        return true;

    };

    pubsubz.subscribe = function ( topic, func ) {

        if (!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };

    pubsubz.unsubscribe = function ( token ) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    };

    getPubSubz = function(){
        return pubsubz;
    };

    window.pubsubz = getPubSubz();

}( this, this.document ));
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

  global.Tower = {
    getTower: function(){
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
}(this));
(function(parent){

  function create(element, options){
    var currentHandler;
    var hammertime = options.hammertime;

    var watchTouch = function(event){
      if (event.type === 'touch') {
        if (event.target.ownerSVGElement === element) {
          pubsubz.publish('start', event.gesture);
          return gestureStart;
        }
      }
    };

    var gestureStart = function(event){
      if (event.type === 'drag') {
        pubsubz.publish('drag', event.gesture);
        return trackDrag;
      } else if (event.type === 'pinch') {
        pubsubz.publish('pinch', event.gesture);
        return trackPinch;
      } else if (event.type === 'release') {
        pubsubz.publish('end', event.gesture);
        return watchTouch;
      }
    };

    var trackDrag = function(event){
      console.log(event.type);
      if (event.type === 'drag') {
        pubsubz.publish('drag', event.gesture);
      } else if (event.type === 'release') {
        pubsubz.publish('end', event.gesture);
        return watchTouch;
      }
    };

    var trackPinch = function(event){
      if (event.type === 'pinch') {
        pubsubz.publish('pinch', event.gesture);
      } else if (event.type === 'release') {
        pubsubz.publish('end', event.gesture);
        return watchTouch;
      }
    };

    var gestureHandler = function(event){
      currentHandler = currentHandler(event) || currentHandler;
    };

    hammertime.on('touch drag pinch release', gestureHandler);
    hammertime.on('touch drag pinch release', function(event){
      console.log('ruddy', event.type);
    });
    currentHandler = watchTouch;

    function kill(){
      hammertime.off('touch drag pinch release', gestureHandler);
    }

    var instance = Object.create({});
    _.extend({
      kill: kill
    })(instance);
    return instance;

  }

  parent.Controller = create;
}(Hammerhead));

(function(parent){
  var $window = $(window);

  var publishResize = _.debounce(function(event){
    pubsubz.publish('resize');
  }, 400);

  function setOverspill($element){
    $parent = $element.parent();
    return function(){
      var height = $parent.height();
      var width = $parent.width();
      $element.css('margin', -height/2 + ' ' + -width/2);
      $element.width(width * 2);
      $element.height(height * 2);
    };
  }

  function create(elementId, options){
    var $el = $('#' + elementId);
    var el = $el[0];

    console.log('started with options ', options);

    var updateOverspill = setOverspill($el);

    Hammerhead.Controller(el, {hammertime: options.hammertime});
    var agile = Hammerhead.AgileView(el);

    // Initial styling
    updateOverspill();
    $el.css({
      '-webkit-transform': 'translate(0px, 0px)',
      'transform': 'translate(0px, 0px)',
      '-webkit-backface-visibility': 'hidden',
      '-webkit-transform-origin': '50% 50%',
      '-ms-transform-origin': '50% 50%',
      'transform-origin': '50% 50%'
    });

    // Watch resize -  should be singleton object
    $window.on('resize', function(event){
      publishResize(event);
    });

    // Deliver resize
    pubsubz.subscribe('resize', function(){
      updateOverspill();
    });

    pubsubz.subscribe('end', function(){
      agile.fix();
      var newString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      $el.css('-webkit-transform', 'translate(0px, 0px)');
      $el.css('-ms-transform', 'translate(0px, 0px)');
      $el.css('transform', 'translate(0px, 0px)');
      $el.attr('viewBox', newString);
    });

    pubsubz.subscribe('drag', function(gesture, other){
      var dx = other.deltaX;
      var dy = other.deltaY;
      $el.css('-webkit-transform', 'translate(' + dx + 'px, ' + dy + 'px)');
      $el.css('-ms-transform', 'translate(' + dx + 'px, ' + dy + 'px)');
      $el.css('transform', 'translate(' + dx + 'px, ' + dy + 'px)');
      pt = Hammerhead.Point(other);
      agile.drag(pt);
    });

    pubsubz.subscribe('pinch', function(item, gesture){
      $el.css('-webkit-transform', 'scale(' + gesture.scale + ')');
      $el.css('-ms-transform', 'scale(' + gesture.scale + ')');
      $el.css('transform', 'scale(' + gesture.scale + ')');
      agile.zoom(gesture.scale);
    });
  }
  parent.Create = create;
}(Hammerhead));