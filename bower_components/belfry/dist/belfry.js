(function (global) {
  "use strict";

  var instance;

  function init(){
    var channels = {};
    var uid = -1;

    function subscribe(topic){
      return function(reaction){
        var channel = channels[topic] = channels[topic] || {};
        channel[++uid] = reaction;
        return uid;
      };
    }

    function publish(topic){
      return function(content){
        var response = false;
        _.eachObject(function(action){
          action(content, topic);
          response = true;
        })(channels[topic] || {});
        return response;
      };
    }

    function unsubscribe(topic){
      return function(uid){
        if (uid) {
          delete channels[topic][uid];
        } else {
          channels[topic] = {};
        }
      };
    }

    return{
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      publish: publish
    };
  }

  global.Belfry = {
    getTower: function(){
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
}(this));