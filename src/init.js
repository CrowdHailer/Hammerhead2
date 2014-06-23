(function(parent){
  var tower = Belfry.getTower();

  var overflowSettings = _.pick('overflowSurplus', 'resizeDelay');
  var managePositionSettings = _.pick('maxZoom', 'minZoom');
  var mousewheelSettings = _.pick('mousewheelSensitivity', 'mousewheelDelay');

  var prototype = {
    home: tower.publish('home')
  };

  function init(svgId, options){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    options = options || {};

    var instance = Object.create(prototype);
    instance.$element = $svg;

    parent.regulateOverflow($svg, overflowSettings(options));
    parent.touchDispatch($svg);
    parent.managePosition($svg, managePositionSettings(options));
    parent.mousewheelDispatch($svg, mousewheelSettings(options));

    return instance;
  }
  parent.create = init;
}(Hammerhead));