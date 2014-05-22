(function(parent){

  function create(element, options){
    var currentHandler;
    var hammertime = options.hammertime;

    var touchHandler = function(event){
      if (event.type === 'touch') {
        if (event.target.ownerSVGElement === element) {
          pubsubz.publish('start', null);
          return dragHandler;
        }
      }
    };

    var dragHandler = function boo(event){
      if (event.type === 'drag') {
        pubsubz.publish('drag', null);
      }
    };

    var gestureHandler = function(event){
      var nextHandler = currentHandler(event);
      currentHandler = nextHandler || currentHandler;
    };

    hammertime.on('touch drag', gestureHandler);
    currentHandler = touchHandler;



    function kill(){
      hammertime.off('touch drag', gestureHandler);
    }

    var instance = Object.create({});
    _.extend({
      kill: kill
    })(instance);
    return instance;

  }

  parent.Controller = create;
}(Hammerhead));
