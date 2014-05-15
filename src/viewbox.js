(function(parent){
  function create(minimal, maximal){
    return {minimal: minimal, maximal: maximal};
  }
  parent.ViewBox = create;
}(Hammerhead));