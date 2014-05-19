(function(parent){
  function create(element, options){
    var hammertime = options.hammertime;

    hammertime.on('gesture', touchHandler);

    function touchHandler(){
      pubsubz.publish('hammerhead', {x:1});
    }

  }
  parent.Controller = create;
}(Hammerhead));
