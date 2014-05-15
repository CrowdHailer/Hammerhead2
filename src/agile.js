(function(parent){
  var VB = parent.ViewBox;
  var Pt = parent.Point;
  prototype = {
    translate: function(delta){
      var newViewBox = VB.translate(delta)(this.getCurrent());
      this.setTemporary(newViewBox);
      return this;
    },
    scale: function(magnification, center){
      var newViewBox = VB.zoom(magnification)(center)(this.getCurrent());
      this.setTemporary(newViewBox);
      return this;
    },
    drag: function(screenDelta){
      var matrix = _.extend(this.getScreenCTM().inverse(), {e: 0, f: 0});
      var delta = Pt.matrixTransform(matrix)(screenDelta);
      return this.translate(delta);
    }
  };
  function create(element, options){
    var temporary, current, HOME;
    current = temporary = HOME =  parent.ViewBox(element.getAttribute('viewBox'));

    var instance = Object.create(prototype);
    _.extend(instance, {
      getCurrent: function(){ return current; },
      setTemporary: function(value){ temporary = value; },
      fix: function(){ current = temporary; },
      getScreenCTM: function(){ return element.getScreenCTM(); }
    });
    return instance;
  }

  parent.AgileView = create;
}(Hammerhead));