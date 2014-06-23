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

    options = options || {};
    var config = buildConfig(options);

    var instance = Object.create(prototype);
    instance.$element = $svg;
    instance.isComponent = checkSVGTarget($svg[0]);
    instance.getConfig = function(setting){
      return config[setting];
    };

    parent.regulateOverflow.call(instance);
    parent.touchDispatch($svg);
    parent.managePosition.call(instance);
    parent.mousewheelDispatch.call(instance);

    return instance;
  }
  parent.create = init;
}(Hammerhead));