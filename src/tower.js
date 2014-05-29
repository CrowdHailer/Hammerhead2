(function (global) {
  "use strict";

  var instance;

  function init(){
    var channels = {};
    var uid = 0;

    function subscribe(topic){
      return function(reaction){
        var channel = channels[topic] = channels[topic] || {};
        channel[uid++] = reaction;
        return uid;
      };
    }

    function publish(topic){
      return function(content){
        _.each(function(action){
          action(content);
        })(channels[topic]);
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