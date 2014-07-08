(function(parent){
  'use strict';

  var Pt = SVGroovy.Point;
  var hammertime = Hammer(document);
  
  parent.dispatchTouch = function(){
    // TDD with cumin method, gesture handler and deactivate return.
    var element = this.element,
      isComponent = this.isComponent,
      live = false,
      dragging = false,
      pinching = false;

    hammertime.on('touch', function(event){
      event.gesture.preventDefault();
      live = isComponent(event.target);
    });

    hammertime.on('drag', function(event){
      event.gesture.preventDefault();
      if (live && !pinching) {
        dragging = Pt(event.gesture);
        bean.fire(element, 'displace', Pt(event.gesture));
      }
    });

    hammertime.on('pinch', function(event){
      event.gesture.preventDefault();
      if (live) {
        dragging = false;
        pinching = event;
        bean.fire(element, 'inflate', event.gesture.scale);
      }
    });

    hammertime.on('release', function(){
      event.gesture.preventDefault();
      if (live) {
        if (dragging) { 
          bean.fire(element, 'translate', dragging);
        }
        if (pinching) {
          bean.fire(element, 'magnify', pinching.gesture.scale);
        }
        live = false;
        pinching = false;
        dragging = false;
      }
    });

    return function(){
      hammertime.dispose();
    };
  };
}(Hammerhead));