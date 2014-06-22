(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');


  function checkSVGTarget(svg){
    return function(event){
      return (event.target.ownerSVGElement || event.target) === svg;
    };
  }

  parent.mousewheelDispatch = function($element){
    var SVGElement = $element[0], scale;
    var onTarget = checkSVGTarget(SVGElement);

    var finishScrolling = _.debounce(200)(function(){
      alertEnd('wheel');
      scale = null;
    });

    $(document).on('mousewheel', function(event){
      if (!scale) {
        scale = 1;
        console.log((event.target.ownerSVGElement || event.target) === SVGElement );
        alertStart('wheel');
        console.log(onTarget(event));
      }
      if (event.wheelDelta > 0) {
        scale *= 1.1;
      } else{
        scale /= 1.1;
      }
      alertPinch({element: SVGElement, scale: scale});
      finishScrolling();
    });
  };

}(Hammerhead));