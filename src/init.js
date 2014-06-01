(function(parent){
  function init(svgId){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    parent.regulateOverflow($svg);
    parent.touchDispatch($svg);
    parent.managePosition($svg);
  }
  parent.create = init;
}(Hammerhead));