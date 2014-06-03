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
    var vbString;
    listenEnd(function(){
      agile.fix();
      vbString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      matrixString =  matrixAsCss(identityMatrix);
      continueAnimate = false;
    });

    function render(){
      $element.css({
        '-webkit-transform': matrixString,
        '-ms-transform': matrixString,
        'transform': matrixString
      });
      $element.attr('viewBox', vbString);
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
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertDrag = tower.publish('drag');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  var scrolling = false;
  var scroll = 0;
  var finishScrolling = _.debounce(200)(function(){
    alertEnd('wheel');
    scrolling = false;
  });
  parent.mousewheelDispatch = function($element){
    $(document).on('mousewheel', function(event){
      if (!scrolling) {
        scrolling = true;
        alertStart('wheel');
      }
      // return if outside 0.5 2 fire end and restart with high res.
      scroll += event.wheelDelta;
      alertPinch({element: $element[0], scale: Math.pow(2,scroll/6000)});
      finishScrolling();
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