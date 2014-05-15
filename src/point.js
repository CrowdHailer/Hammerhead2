(function(parent){
  function create(x, y){
    return Object.freeze({x: x|0, y: y|0});
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

  var operands ={
    add: add,
    subtract: subtract,
    scalar: scalar,
    min: min,
    max: max,
    matrixTransform: matrixTransform
  };

  parent.Point = _.extend(create, operands);
}(Hammerhead));