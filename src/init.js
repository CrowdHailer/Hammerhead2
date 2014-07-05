(function(parent){
  "use strict";

  var prototype = {};

  var buildConfig = _.foundation({
    mousewheelSensitivity: 0.1,
    mousewheelDelay: 200,
    maxZoom: 2,
    minZoom: 0.5,
    overflowSurplus: 0.5,
    resizeDelay: 200
  });

  function checkSVGTarget(svg){
    return function(target){
      return (target.ownerSVGElement || target) === svg;
    };
  }

  function init(svgId, options){
    var $element = $('svg#' + svgId);
    var element = $element[0];

    if (!element) {
      console.warn(interpolate("SVG element '%(id)s' not found")({id: svgId}));
      return false;
    }

    var instance = _.augment(Object.create(prototype))({
      $element: $element,
      element: element,
      isComponent: checkSVGTarget(element),
      getConfig: _.peruse(buildConfig(options))
    });

    instance.clear = parent.regulateOverflow.call(instance);
    // parent.touchDispatch.call(instance);
    parent.managePosition.call(instance);
    // parent.mousewheelDispatch.call(instance);
    
    return instance;
  }
  parent.create = init;
}(Hammerhead));