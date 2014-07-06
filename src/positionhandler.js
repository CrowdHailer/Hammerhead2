(function(parent){
  'use strict';

  var Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox,
    xBtransform = _.compose(transformObject, Mx.asCss);
  //cumin compose map map
  // limit zoom
  // round pixels

  parent.managePosition = function(){
    var $element = this.$element,
      element = this.element,
      properFix = missingCTM($element), // windows FIX
      viewBoxZoom = 1,
      viewBox = VB($element.attr('viewBox')),
      HOME = viewBox;

    var animationLoop,
      thisScale,
      maxScale,
      minScale,
      currentMatrix;

    function renderCSS(){
      if (!animationLoop) {
        animationLoop = requestAnimationFrame(function(){
          $element.css(xBtransform(currentMatrix));
          animationLoop = false;
        });
      }
    }

    function renderViewBox(){
      requestAnimationFrame( function(){
        cancelAnimationFrame(animationLoop);
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

    

    

    function startofanim(){
      beginAnimation();
      maxScale = this.getConfig('maxZoom')/viewBoxZoom;
      minScale = this.getConfig('minZoom')/viewBoxZoom;
      thisScale = 1;
    }

    function dragaction(data){
      currentMatrix = Mx.forTranslation(data.delta);
    };

    function pinchaction(data){
      var scale = Math.max(Math.min(data.scale, maxScale), minScale);
      currentMatrix = Mx.forMagnification(scale);
      thisScale = scale;
    };

    function endofanimation(data){
      if (thisScale === 1) {
        var fixedTranslation = Pt.scalar(properFix)(data.delta);
        var inverseCTM = $element[0].getScreenCTM().inverse();
        inverseCTM.e = 0;
        inverseCTM.f = 0;
        var scaleTo = Pt.matrixTransform(inverseCTM);
        var svgTrans = scaleTo(fixedTranslation);
        viewBox = VB.translate(svgTrans)(viewBox);
      } else{
        var scale = Math.max(Math.min(thisScale, maxScale), minScale);
        viewBoxZoom *= scale;
        viewBox = VB.zoom(scale)()(viewBox);
      }
      cancelAnimationFrame(animationLoop);
      currentMatrix = Mx();
      requestAnimationFrame(function(){
        $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
        $element.css(xBtransform());
      });
    };

    

    $element.css(xBtransform());
    $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
    

  };
}(Hammerhead));