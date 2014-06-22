(function(parent){
  var tower = Belfry.getTower(), scale;

  var alertStart = tower.publish('start');
  var alertDrag = tower.publish('drag');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  var finishScrolling = _.debounce(200)(function(){
    alertEnd('wheel');
    scale = null;
  });
  parent.mousewheelDispatch = function($element){
    $(document).on('mousewheel', function(event){
      if (!scale) {
        scale = 1;
        console.log((event.target.ownerSVGElement || event.target) === $element[0] );
        alertStart('wheel');
      }
      if (event.wheelDelta > 0) {
        scale *= 1.1;
      } else{
        scale /= 1.1;
      }
      alertPinch({element: $element[0], scale: scale});
      finishScrolling();
    });
  };

}(Hammerhead));