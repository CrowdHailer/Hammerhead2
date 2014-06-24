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
