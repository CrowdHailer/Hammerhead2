(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  parent.mousewheelDispatch = function(){
    
    var SVGElement = this.$element[0];
    var scale;
    var factor = 1 + this.getConfig('mousewheelSensitivity');

    var finishScrolling = _.debounce(this.getConfig('mousewheelDelay'))(function(scaleFactor){
      alertEnd({scale: scaleFactor});
      scale = null;
    });

    var handleMousewheel = function(event){
      if (!scale) {
        if (!this.isComponent(event.target)) return;

        scale = 1;
        alertStart('wheel');
      }

      if (event.wheelDelta > 0) {
        scale *= factor;
      } else {
        scale /= factor;
      }

      alertPinch({
        element: SVGElement,
        scale: scale});
      finishScrolling(scale);
    }.bind(this);

    $(document).on('mousewheel', handleMousewheel);
  };

}(Hammerhead));