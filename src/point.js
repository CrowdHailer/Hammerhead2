(function(parent){
  function create(x, y){
    return Object.freeze({x: x|0, y: y|0});
  }
  parent.Point = create;
}(Hammerhead));