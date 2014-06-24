(function(parent){
  var tower = Belfry.getTower(),
    Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox;

  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  var XBtransform = _.compose(transformObject, Mx.asCss);

  parent.managePosition = function(){
    var $element = this.$element;
    var properFix = missingCTM($element), // windows FIX
      viewBoxZoom = 1;

    var HOME = viewBox = VB($element.attr('viewBox'));

    var animationLoop,
      thisScale,
      maxScale,
      minScale,
      currentMatrix;

    listenStart(function(){
      beginAnimation();
      maxScale = this.getConfig('maxZoom')/viewBoxZoom;
      minScale = this.getConfig('minZoom')/viewBoxZoom;
      thisScale = 1;
    }.bind(this));

    listenDrag(function(data){
      currentMatrix = Mx.forTranslation(data.delta);
    });

    listenPinch(function(data){
      var scale = Math.max(Math.min(data.scale, maxScale), minScale);
      currentMatrix = Mx.forMagnification(scale);
      thisScale = scale;
    });

    listenEnd(function(data){
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
    });

    function render(){
      $element.css(XBtransform(currentMatrix));
      animationLoop = requestAnimationFrame( render );
    }

    function beginAnimation(){
      animationLoop = requestAnimationFrame( render );
    }

    $element.css(XBtransform());
    $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));

    tower.subscribe('home')(function(){
      $element.css(XBtransform());
      viewBox = HOME;
      $element.attr('viewBox', VB.attrString(VB.zoom(0.5)()(viewBox)));
    });
  };
}(Hammerhead));