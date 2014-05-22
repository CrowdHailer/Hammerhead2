(function(parent){

  function create(element, options){
    var currentHandler;
    var hammertime = options.hammertime;

    var watchTouch = function(event){
      if (event.type === 'touch') {
        if (event.target.ownerSVGElement === element) {
          pubsubz.publish('start', null);
          return gestureStart;
        }
      }
    };

    var gestureStart = function(event){
      if (event.type === 'drag') {
        pubsubz.publish('drag', null);
        return trackDrag;
      } else if (event.type === 'pinch') {
        pubsubz.publish('pinch', null);
        return trackPinch;
      } else if (event.type === 'release') {
        pubsubz.publish('end', null);
        return watchTouch;
      }
    };

    var trackDrag = function(event){
      if (event.type === 'drag') {
        pubsubz.publish('drag', null);
      }
    };

    var trackPinch = function(event){
      if (event.type === 'pinch') {
        pubsubz.publish('pinch', null);
      }
    };



    var gestureHandler = function(event){
      var nextHandler = currentHandler(event);
      currentHandler = nextHandler || currentHandler;
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
