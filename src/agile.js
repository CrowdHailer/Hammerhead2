(function(parent){
  var VB = parent.ViewBox;
  prototype = {
    translate: function(delta){
      var newViewBox = VB.translate(delta)(this.getCurrent());
      this.setTemporary(newViewBox);
      return this;
    }
  };
  function create(element, options){
    var temporary, current, HOME;
    current = temporary = HOME =  parent.ViewBox(element.getAttribute('viewBox'));

    var instance = Object.create(prototype);
    _.extend(instance, {
      getCurrent: function(){ return current; },
      setTemporary: function(value){ temporary = value; },
      fix: function(){ current = temporary; }
    });
    return instance;
  }

  parent.AgileView = create;
}(Hammerhead));