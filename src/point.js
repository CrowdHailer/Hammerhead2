(function(parent){
  function create(x, y){
    return Object.freeze({x: x|0, y: y|0});
  }

  function add(a){
    return function(b){
      return create(a.x + b.x, a.y + b.y);
    };
  }

  function subtract(a){
    return function(b){
      return create(a.x - b.x, a.y - b.y);
    };
  }

  var operands ={
    add: add,
    subtract: subtract
  };

  parent.Point = _.extend(create, operands);
}(Hammerhead));