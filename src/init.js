(function(parent){
  var mousewheelSettings = _.dot({
    sensitivity: 'mousewheelSensitivity'
  });

  function init(svgId, options){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    options = options || {};

    parent.regulateOverflow($svg);
    parent.touchDispatch($svg);
    parent.managePosition($svg);
    parent.mousewheelDispatch($svg, mousewheelSettings(options));
  }
  parent.create = init;
}(Hammerhead));