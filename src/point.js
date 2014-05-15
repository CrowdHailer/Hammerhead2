(function(parent){
  function create(x, y){
    return Object.freeze({x: x, y: y});
  }
  parent.Point = create;
}(Hammerhead));