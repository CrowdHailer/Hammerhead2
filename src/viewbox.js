(function(parent){
  Pt = parent.Point;
  function create(minimal, maximal){
    return Object.freeze({minimal: minimal, maximal: maximal});
  }

  function midpoint(view){
    return Pt.scalar(0.5)(Pt.add(view.minimal)(view.maximal));
  }

  function translate(delta){
    return function(view){
      translation = parent.Point.negate(delta);
      return Object.freeze(_.objMap(view, translation));
    };
  }

  var operands = {
    midpoint: midpoint,
    translate: translate
  };

  parent.ViewBox = _.extend(create, operands);
}(Hammerhead));