(function(parent){
  function create(minimal, maximal){
    return Object.freeze({minimal: minimal, maximal: maximal});
  }

  function translate(delta){
    return function(view){
      translation = parent.Point.add(delta);
      return _.objMap(view, translation);
    };
  }

  var operands = {
    translate: translate
  };

  parent.ViewBox = _.extend(create, operands);
}(Hammerhead));