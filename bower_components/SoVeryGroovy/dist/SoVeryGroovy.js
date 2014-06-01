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