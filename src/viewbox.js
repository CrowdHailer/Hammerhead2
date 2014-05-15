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
      var transformation = parent.Point.negate(delta);
      return Object.freeze(_.objMap(view, transformation));
    };
  }

  function scale(factor){
    return function(view){
      var transformation = Pt.scalar(1.0/factor);
      return Object.freeze(_.objMap(view, transformation));
    };
  }

  function zoom(magnification){
    return function(center){
      return function(view){
        center = center || midpoint(view);
        return _.compose(
          translate(Pt.negate(center)()),
          scale(magnification),
          translate(center)
        )(view);
      };
    };
  }

  var operands = {
    midpoint: midpoint,
    translate: translate,
    scale: scale,
    zoom: zoom
  };

  parent.ViewBox = _.extend(create, operands);
}(Hammerhead));