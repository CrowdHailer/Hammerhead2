(function(parent){
  'use strict';

  var Pt = SVGroovy.Point;
  
  parent.dispatchTouch = function(){
    // TDD with cumin method, gesture handler and deactivate return.
    var element = this.element,
      isComponent = this.isComponent,
      live = false,
      dragging = true;

    hammertime.on('touch', function(event){
      live = isComponent(event.target);
      console.log(live);
    });

    hammertime.on('drag', function(event){
      if (live && dragging) {
        bean.fire(element, 'displace', Pt(event.gesture));
      }
    });

    hammertime.on('pinch', function(event){
      if (live) {
        dragging = false;
        bean.fire(element, 'inflate', event.gesture.scale);
      }
    });

    hammertime.on('release', function(){
      if (live) {
        if (dragging) {
          bean.fire(element, 'translate', Pt(event.gesture));
        } else{
          bean.fire(element, 'magnify', event.gesture.scale);
        }
        live = false;
        dragging = true;
      }
    });

    return function(){
      hammertime.dispose();
    }
  };
  var tower = Belfry.getTower();

  var alertStart = tower.publish('start');
  var alertDrag = tower.publish('drag');
  var alertPinch = tower.publish('pinch');
  var alertEnd = tower.publish('end');

  function watchTouch(event){
    if (event.target.ownerSVGElement === this.getElement()) {
      this.handlers.touch = false;
      this.handlers.drag = handleDrag;
      this.handlers.pinch = handlePinch;
      this.handlers.release = endHandler;
      alertStart(this.getElement());
    }
    return this;
  }

  function handleDrag(event){
    alertDrag({
      element: this.getElement(),
      delta: SVGroovy.Point(event.gesture)
    });
    return this;
  }

  function handlePinch(event){
    this.handlers.drag = false;
    alertPinch({
      element: this.getElement(),
      center: SVGroovy.Point(event.gesture.center),
      scale: event.gesture.scale
    });
    return this;
  }

  function endHandler(event){
    this.handlers.touch = watchTouch;
    this.handlers.drag = false;
    this.handlers.pinch = false;
    alertEnd({
      element: this.getElement(),
      delta: SVGroovy.Point(event.gesture),
      scale: event.gesture.scale
    });
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

    // instance.activate();
    return instance;

  };
}(Hammerhead));