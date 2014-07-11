/* global Hammerhead, _, bean, SVGroovy, transformObject, missingCTM, requestAnimationFrame, cancelAnimationFrame*/

(function(parent){
  'use strict';
  //cumin compose map map
  // limit zoom
  // round pixels

  var Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox,
    xBtransform = _.compose(transformObject, Mx.asCss3d);

  parent.managePosition = function(){
    var $element = this.$element,
      element = this.element,
      properFix = missingCTM($element), // windows FIX
      viewBox = VB($element.attr('viewBox')),
      animationLoop,
      currentMatrix;
    console.log(VB($element.attr('viewBox')));
    console.log(VB.attrString(viewBox));

    function renderCSS(){
      if (!animationLoop) {
        animationLoop = requestAnimationFrame(function(){
          $element.css(xBtransform(currentMatrix));
          animationLoop = false;
        });
      }
    }

    function renderViewBox(){
      cancelAnimationFrame(animationLoop);
      animationLoop = false;
      requestAnimationFrame( function(){
        $element.css(xBtransform());
        $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
      });
    }

    bean.on(element, 'displace', function(point){
      currentMatrix = Mx.toTranslate(point);
      renderCSS();
    });

    bean.on(element, 'inflate', function(scaleFactor){
      currentMatrix = Mx.toScale(scaleFactor);
      renderCSS();
    });

    bean.on(element, 'translate', function(delta){
      properFix = 1;
      var fixedTranslation = Pt.scalar(properFix)(delta);
      var inverseCTM = $element[0].getScreenCTM().inverse();
      inverseCTM.e = 0;
      inverseCTM.f = 0;
      var scaleTo = Pt.matrixTransform(inverseCTM);
      var svgTrans = scaleTo(fixedTranslation);
      viewBox = VB.translate(svgTrans)(viewBox);
      renderViewBox();
    });

    bean.on(element, 'magnify', function(scale){
      viewBox = VB.zoom(scale)()(viewBox);
      renderViewBox();
    });

    $element.css(xBtransform());
    $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));

    return function(){
      bean.off(element);
    };
  };
}(Hammerhead));