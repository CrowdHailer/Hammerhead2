(function(parent){
  function create(element, options){
    var hammertime = options.hammertime;
    var active;

    hammertime.on('touch', touchHandler);
    hammertime.on('drag', dragHandler);

    function touchHandler(event){
      if (event.target.ownerSVGElement === element) {
        pubsubz.publish('hammerhead', {x:1});
        active = true;
      }
    }

    function dragHandler(event){
      if (active) {
        pubsubz.publish('drag', {args: 2});
      }
    }

    function kill(){
      hammertime.off('touch', touchHandler);
      hammertime.off('drag', dragHandler);
    }

    var instance = Object.create({});
    _.extend({
      kill: kill
    })(instance);
    return instance;

  }

  parent.Controller = create;
}(Hammerhead));
