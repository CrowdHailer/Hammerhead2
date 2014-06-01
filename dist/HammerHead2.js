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

Hammerhead = {};

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
  function init(svgId){
    console.log('initialising');
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    parent.regulateOverflow($svg);
  }
  parent.create = init;
}(Hammerhead));