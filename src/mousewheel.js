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

  var standardOptions = _.foundation({
    sensitivity: 0.1
  });

  parent.mousewheelDispatch = function($element, options){
    options = standardOptions(options);
    
    var SVGElement = $element[0], scale;
    var onTarget = checkSVGTarget(SVGElement);
    var factor = 1 + options.sensitivity;

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
        scale *= factor;
      } else{
        scale /= factor;
      }

      alertPinch({element: SVGElement, scale: scale});
      finishScrolling();
    });
  };

}(Hammerhead));