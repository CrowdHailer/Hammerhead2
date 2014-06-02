(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertDrag = tower.publish('drag');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  var scrolling = false;
  var scroll = 0;
  var finishScrolling = _.debounce(200)(function(){
    alertEnd('wheel');
    scrolling = false;
  });
  parent.mousewheelDispatch = function($element){
    $(document).on('mousewheel', function(event){
      if (!scrolling) {
        scrolling = true;
        alertStart('wheel');
      }
      scroll += event.wheelDelta;
      alertPinch({element: $element[0], scale: Math.pow(1.2,scroll/720)});
      finishScrolling();
    });
  };

}(Hammerhead));