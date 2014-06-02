(function(parent){
  function init(svgId){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    parent.regulateOverflow($svg);
    parent.touchDispatch($svg);
    parent.managePosition($svg);
    parent.mousewheelDispatch($svg);
  }
  parent.create = init;
}(Hammerhead));