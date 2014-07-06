(function(parent){
  var Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox;

  var XBtransform = _.compose(transformObject, Mx.asCss);
  //cumin compose map map

  parent.managePosition = function(){
    var $element = this.$element;
    var element = this.element;
    var properFix = missingCTM($element), // windows FIX
      viewBoxZoom = 1;

    var HOME = viewBox = VB($element.attr('viewBox'));

    var animationLoop,
      thisScale,
      maxScale,
      minScale,
      currentMatrix;

    function render(){
      $element.css(XBtransform(currentMatrix));
      animationLoop = false;
    }

    function beginAnimation(){
      animationLoop = requestAnimationFrame( render );
    }

    bean.on(element, 'displace', function(point){
      currentMatrix = Mx.toTranslate(point);
      if (!animationLoop) {
        animationLoop = requestAnimationFrame( render );
      }
    });

    bean.on(element, 'inflate', function(scaleFactor){
      currentMatrix = Mx.toScale(scaleFactor);
      if (!animationLoop) {
        animationLoop = requestAnimationFrame( render );
      }
    });

    bean.on(element, 'translate', function(delta){
      $element.css(XBtransform(Mx()));
      properFix = 1;
      var fixedTranslation = Pt.scalar(properFix)(delta);
      var inverseCTM = $element[0].getScreenCTM().inverse();
      inverseCTM.e = 0;
      inverseCTM.f = 0;
      var scaleTo = Pt.matrixTransform(inverseCTM);
      var svgTrans = scaleTo(fixedTranslation);
      viewBox = VB.translate(svgTrans)(viewBox);
      $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
      //end animation as separate public function
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
        $element.css(XBtransform());
      });
    };

    

    $element.css(XBtransform());
    $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
    

  };
}(Hammerhead));