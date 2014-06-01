(function(parent){
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertDrag = tower.publish('drag');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  function watchTouch(event){
    if (event.target.ownerSVGElement === this.getElement()) {
      this.handlers.drag = handleDrag;
      this.handlers.pinch = handlePinch;
      this.handlers.release = endHandler;
      alertStart(this.getElement());
      return this;
    }
    return this;
  }

  function handleDrag(event){
    this.handlers.pinch = false;
    alertDrag({element: this.getElement(), delta: {x: event.gesture.deltaX, y: event.gesture.deltaY}});
    return this;
  }

  function handlePinch(event){
    this.handlers.drag = false;
    alertPinch({element: this.getElement(), center: event.gesture.center, scale: event.gesture.scale});
    return this;
  }

  function endHandler(event){
    this.handlers.drag = false;
    this.handlers.pinch = false;
    alertEnd({element: this.getElement(), center: event.gesture.center, scale: event.gesture.scale});
    return this;
  }

  parent.touchDispatch = function($element){
    var element = $element[0];

    var instance = Object.create({});
    instance.getElement = function(){
      return element;
    };
    instance.handlers = {
      touch: watchTouch,
    };

    function gestureHandler(event){
      event.gesture.preventDefault();
      if(instance.handlers[event.type]) {
        instance = instance.handlers[event.type].call(instance, event);
      }
    }

    instance.activate = function activate(){
      hammertime.on('touch drag pinch release', gestureHandler);
    };

    instance.deactivate = function deactivate(){
      hammertime.off('touch drag pinch release', gestureHandler);
    };

    instance.activate();

  };
}(Hammerhead));