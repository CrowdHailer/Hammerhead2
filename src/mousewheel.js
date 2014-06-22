(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');


  function checkSVGTarget(svg){
    return function(target){
      return (target.ownerSVGElement || target) === svg;
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
        if (!onTarget(event.target)) return;

        scale = 1;
        alertStart('wheel');
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