(function(parent){
  function create(element, options){
    var hammertime = options.hammertime;

    hammertime.on('touch', touchHandler);

    function touchHandler(event){
      if (event.target.ownerSVGElement === element) {
        pubsubz.publish('hammerhead', {x:1});
      }
    }

  }
  parent.Controller = create;
}(Hammerhead));
