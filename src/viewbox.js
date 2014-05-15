(function(parent){
  Pt = parent.Point;
  function create(minimal, maximal){
    if (typeof minimal === 'string') { return createFromString(minimal); }
    return Object.freeze({minimal: minimal, maximal: maximal});
  }

  function createFromString(viewBoxString){
    function returnInt(string){ return parseInt(string, 10); }

    var limits  = viewBoxString.split(' ').map(returnInt),
        minimal = Pt(limits[0], limits[1]),
        delta   = Pt(limits[2], limits[3]),
        maximal = Pt.add(minimal)(delta);
    return create(minimal, maximal);
  }

  function midpoint(view){
    return Pt.scalar(0.5)(Pt.add(view.minimal)(view.maximal));
  }

  function translate(delta){
    return function(view){
      var transformation = Pt.negate(delta);
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