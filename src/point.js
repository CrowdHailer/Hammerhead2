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

  var operands ={
    add: add,
    subtract: subtract,
    scalar: scalar,
    min: min
  };

  parent.Point = _.extend(create, operands);
}(Hammerhead));