(function(parent){
  var tower = Belfry.getTower(), scrolling, scroll;

  var alertStart = tower.publish('start');
  var alertDrag = tower.publish('drag');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  var finishScrolling = _.debounce(200)(function(){
    alertEnd('wheel');
    scrolling = false;
  });
  parent.mousewheelDispatch = function($element){
    $(document).on('mousewheel', function(event){
      if (!scrolling) {
        scrolling = true;
        scroll = 1;
        console.log((event.target.ownerSVGElement || event.target) === $element[0] );
        alertStart('wheel');
      }
      if (event.wheelDelta > 0) {
        scroll *= 1.1;
      } else{
        scroll /= 1.1;
      }
      alertPinch({element: $element[0], scale: scroll});
      finishScrolling();
    });
  };

}(Hammerhead));