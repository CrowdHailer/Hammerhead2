(function(parent){
  "use strict";

  var darkSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  function create(){
    return darkSVG.createSVGMatrix();
  }
  parent.Matrix = create;
  parent.Matrix.toScale = function(scalar){
    return create().scale(scalar);
  };
  parent.Matrix.toTranslate = function(point){
    return create().translate(point.x, point.y);
  };
}(SVGroovy));