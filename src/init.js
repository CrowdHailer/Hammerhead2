(function(parent){
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
  }
  parent.create = init;
}(Hammerhead));