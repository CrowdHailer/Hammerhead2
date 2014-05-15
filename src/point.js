(function(parent){
  function create(x, y){
    return Object.freeze({x: x|0, y: y|0});
  }

  function add(a){
    return function(b){
      return {x: a.x + b.x, y: a.y + b.y};
    };
  }

  parent.Point = _.extend(create, {add: add});
}(Hammerhead));