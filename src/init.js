(function(parent){
  function init(svgId, options){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    options = options || {};

    mousewheelOptions = _.dot({
      sensitivity: 'mousewheelSensitivity'
    })(options);

    parent.regulateOverflow($svg);
    parent.touchDispatch($svg);
    parent.managePosition($svg);
    parent.mousewheelDispatch($svg, mousewheelOptions);
  }
  parent.create = init;
}(Hammerhead));