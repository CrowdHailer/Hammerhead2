(function(parent){
  function init(svgId){
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    parent.regulateOverflow($svg);
    parent.touchDispatch($svg);
  }
  parent.create = init;
}(Hammerhead));