(function(parent){
  var tower = Belfry.getTower();

  var mousewheelSettings = _.pick('mousewheelSensitivity', 'mousewheelDelay');

  var overflowSettings = _.pick('overflowSurplus', 'resizeDelay');

  function init(svgId, options){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    options = options || {};

    parent.regulateOverflow($svg, overflowSettings(options));
    parent.touchDispatch($svg);
    parent.managePosition($svg);
    parent.mousewheelDispatch($svg, mousewheelSettings(options));

    return {
      home: tower.publish('home')
    };
  }
  parent.create = init;
}(Hammerhead));