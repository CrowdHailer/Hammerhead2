(function(parent){

  function create(element, options){
    var currentHandler;
    var hammertime = options.hammertime;

    var watchTouch = function(event){
      if (event.type === 'touch') {
        if (event.target.ownerSVGElement === element) {
          pubsubz.publish('start', event.gesture);
          return gestureStart;
        }
      }
    };

    var gestureStart = function(event){
      if (event.type === 'drag') {
        pubsubz.publish('drag', event.gesture);
        return trackDrag;
      } else if (event.type === 'pinch') {
        pubsubz.publish('pinch', event.gesture);
        return trackPinch;
      } else if (event.type === 'release') {
        pubsubz.publish('end', event.gesture);
        return watchTouch;
      }
    };

    var trackDrag = function(event){
      if (event.type === 'drag') {
        pubsubz.publish('drag', event.gesture);
      } else if (event.type === 'release') {
        pubsubz.publish('end', event.gesture);
        return watchTouch;
      }
    };

    var trackPinch = function(event){
      if (event.type === 'pinch') {
        pubsubz.publish('pinch', event.gesture);
      } else if (event.type === 'release') {
        pubsubz.publish('end', event.gesture);
        return watchTouch;
      }
    };

    var gestureHandler = function(event){
      currentHandler = currentHandler(event) || currentHandler;
    };

    hammertime.on('touch drag pinch release', gestureHandler);
    currentHandler = watchTouch;

    function kill(){
      hammertime.off('touch drag pinch release', gestureHandler);
    }

    var instance = Object.create({});
    _.extend({
      kill: kill
    })(instance);
    return instance;

  }

  parent.Controller = create;
}(Hammerhead));
