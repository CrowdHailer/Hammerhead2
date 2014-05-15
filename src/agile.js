(function(parent){
  prototype = {};
  function create(element, options){
    var temporary, current, HOME;
    current = temporary = HOME =  parent.ViewBox(element.getAttribute('viewBox'));



    function translate(){

    }
    var instance = Object.create(prototype);
    instance.getCurrent = function(){ return current; };
    return instance;
  }

  parent.AgileView = create;
}(Hammerhead));