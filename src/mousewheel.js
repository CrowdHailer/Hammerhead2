(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  var buildConfig = _.foundation({
    mousewheelSensitivity: 0.1
  });

  parent.mousewheelDispatch = function($element, options){
    var config = buildConfig(options);
    
    var SVGElement = $element[0];
    var scale;
    var onTarget = checkSVGTarget(SVGElement);
    var factor = 1 + config.mousewheelSensitivity;

    var finishScrolling = _.debounce(200)(function(scaleFactor){
      alertEnd({scale: scaleFactor});
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

      alertPinch({
        element: SVGElement,
        scale: scale});
      finishScrolling(scale);
    });
  };

}(Hammerhead));