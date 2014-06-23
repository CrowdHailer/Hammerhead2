(function(parent){
  var tower = Belfry.getTower(),
    Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox;

  var buildConfig = _.foundation({
    maxZoom: 2,
    minZoom: 0.5
  });

  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  var XBtransform = _.compose(transformObject, Mx.asCss);

  parent.managePosition = function($element, options){
    var config = buildConfig(options);
    var properFix = missingCTM($element); // windows FIX

    var animationLoop, vbString;
    var HOME = viewBox = VB($element.attr('viewBox'));
    var viewBoxZoom = 1;
    var maxScale = config.maxZoom;
    var minScale = config.minZoom;
    var thisScale = 1;

    var currentMatrix;

    listenStart(function(){
      beginAnimation();
      maxScale = config.maxZoom/viewBoxZoom;
      minScale = config.minZoom/viewBoxZoom;
      thisScale = 1;
    });

    listenDrag(function(data){
      // matrixString = matrixAsCss(Mx.translating(data.delta.x, data.delta.y));
      currentMatrix = Mx.forTranslation(data.delta);
    });

    listenPinch(function(data){
      var scale = Math.max(Math.min(data.scale, maxScale), minScale);
      // matrixString = matrixAsCss(Mx.scaling(scale));
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
      vbString = VB.attrString(VB.zoom(0.5)()(viewBox));
      // matrixString =  matrixAsCss(identityMatrix);
      cancelAnimationFrame(animationLoop);
      currentMatrix = Mx();
      requestAnimationFrame(function(){
        $element.attr('viewBox', vbString);
        $element.css(transformObject(Mx.asCss()));
      });
    });

    function render(){
      $element.css(transformObject(Mx.asCss(currentMatrix)));
      animationLoop = requestAnimationFrame( render );
    }

    function beginAnimation(){
      animationLoop = requestAnimationFrame( render );
    }

    $element.css(transformObject(Mx.asCss()));
    vbString = VB.attrString(VB.zoom(0.5)()(viewBox));
    $element.attr('viewBox', vbString);

    tower.subscribe('home')(function(){
      // matrixString =  matrixAsCss(identityMatrix);
      $element.css(transformObject(Mx.asCss()));
      viewBox = HOME;
      vbString = VB.attrString(viewBox);
      $element.attr('viewBox', vbString);
    });
  };
}(Hammerhead));