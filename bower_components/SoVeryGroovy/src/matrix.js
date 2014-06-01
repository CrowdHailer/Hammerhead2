(function(parent){
  "use strict";

  var darkSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  function create(){
    return darkSVG.createSVGMatrix();
  }
  parent.Matrix = create;
  parent.Matrix.scaling = function(scalar){
    return create().scale(scalar);
  };
  parent.Matrix.translating = function(x, y){
    return create().translate(x, y);
  };
}(SVGroovy));