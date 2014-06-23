(function(parent){
  "use strict";

  var tower = Belfry.getTower();

  var prototype = {
    home: tower.publish('home')
  };

  var buildConfig = _.foundation({
    mousewheelSensitivity: 0.1,
    mousewheelDelay: 200,
    maxZoom: 2,
    minZoom: 0.5,
    overflowSurplus: 0.5,
    resizeDelay: 200
  });

  function init(svgId, options){
    var $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    var instance = Object.create(prototype);
    instance.$element = $svg;
    instance.isComponent = checkSVGTarget($svg[0]);
    instance.getConfig = _.peruse(buildConfig(options));

    parent.regulateOverflow.call(instance);
    parent.touchDispatch($svg);
    parent.managePosition.call(instance);
    parent.mousewheelDispatch.call(instance);

    return instance;
  }
  parent.create = init;
}(Hammerhead));