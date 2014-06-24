(function(parent){
  "use strict";

  var tower = Belfry.getTower();

  var prototype = {
    home: function(){
      tower.publish('home')(this.$element[0]);
    }
  };

  var buildConfig = _.foundation({
    mousewheelSensitivity: 0.1,
    mousewheelDelay: 200,
    maxZoom: 2,
    minZoom: 0.5,
    overflowSurplus: 0.5,
    resizeDelay: 200
  });

  var noElement = interpolate("SVG element '%(id)s' not found");

  function init(svgId, options){
    var $svg = $('svg#' + svgId);
    var element = $svg[0];

    if (!element) {
      console.warn(noElement({id: svgId}));
      return false;
    }

    var instance = Object.create(prototype);
    instance.$element = $svg;
    instance.element = element;
    instance.isComponent = checkSVGTarget(element);
    instance.getConfig = _.peruse(buildConfig(options));

    parent.regulateOverflow.call(instance);
    parent.touchDispatch($svg);
    parent.managePosition.call(instance);
    parent.mousewheelDispatch.call(instance);

    return instance;
  }
  parent.create = init;
}(Hammerhead));