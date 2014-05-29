(function (global) {
  "use strict";

  var instance;

  function init(){
    var channels = {};

    function subscribe(channel){
      return function(reaction){
        channels[channel] ? channels[channel].push(reaction) : channels[channel] = [reaction];
      };
    }

    function publish(channel){
      return function(content){
        _.each(function(action){
          action(content);
        })(channels[channel]);
      };
    }

    return{
      subscribe: subscribe,
      publish: publish
    };
  }

  global.Tower = {
    getTower: function(){
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
}(this));