(function(parent){
  function init(svgId){
    console.log('initialising');
    $svg = $('svg#' + svgId);

    if (!$svg[0]) {
      return false;
    }

    parent.regulateOverflow($svg);
  }
  parent.create = init;
}(Hammerhead));