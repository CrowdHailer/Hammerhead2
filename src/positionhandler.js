(function(parent){
  var tower = Belfry.getTower(),
    Pt = SVGroovy.Point,
    Mx = SVGroovy.Matrix,
    VB = parent.ViewBox,
    identityMatrix = Mx(),
    matrixAsCss = interpolate('matrix(%(a)s, %(b)s, %(c)s, %(d)s, %(e)s, %(f)s)');


  var buildConfig = _.foundation({
    maxZoom: 2,
  });

  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  var transformObject = function(matrixString){
    return {
      '-webkit-transform': matrixString,
      '-ms-transform': matrixString,
      'transform': matrixString
    };
  };

  parent.managePosition = function($element, options){
    var config = buildConfig(options);
    var properFix = missingCTM($element); // windows FIX

    var animationLoop, matrixString;
    var HOME = viewBox = VB($element.attr('viewBox'));
    var viewBoxZoom = 1;
    var maxScale = config.maxZoom;

    listenStart(function(){
      beginAnimation();
      maxScale = config.maxZoom/viewBoxZoom;
    });

    listenDrag(function(data){
      matrixString = matrixAsCss(Mx.translating(data.delta.x, data.delta.y));
    });

    listenPinch(function(data){
      var scale = Math.min(data.scale, maxScale);
      matrixString = matrixAsCss(Mx.scaling(scale));
    });

    listenEnd(function(data){
      if (data.scale === 1) {
        var fixedTranslation = Pt.scalar(properFix)(data.delta);
        var inverseCTM = $element[0].getScreenCTM().inverse();
        inverseCTM.e = 0;
        inverseCTM.f = 0;
        var scaleTo = Pt.matrixTransform(inverseCTM);
        var svgTrans = scaleTo(fixedTranslation);
        viewBox = VB.translate(svgTrans)(viewBox);
      } else{
        var scale = Math.min(data.scale, maxScale);
        viewBoxZoom *= scale;
        viewBox = VB.zoom(scale)()(viewBox);
      }
      vbString = VB.attrString(viewBox);
      matrixString =  matrixAsCss(identityMatrix);
      cancelAnimationFrame(animationLoop);
      requestAnimationFrame(function(){
        $element.attr('viewBox', vbString);
        $element.css(transformObject(matrixString));
      });
    });

    function render(){
      $element.css(transformObject(matrixString));
      animationLoop = requestAnimationFrame( render );
    }

    function beginAnimation(){
      animationLoop = requestAnimationFrame( render );
    }

    $element.css(transformObject(matrixAsCss(identityMatrix)))
      .css({
        '-webkit-backface-visibility': 'hidden',
        '-webkit-transform-origin': '50% 50%',
        '-ms-transform-origin': '50% 50%',
        'transform-origin': '50% 50%'
      });

    tower.subscribe('home')(function(){
      matrixString =  matrixAsCss(identityMatrix);
      $element.css(transformObject(matrixString));
      viewBox = HOME;
      vbString = VB.attrString(viewBox);
      $element.attr('viewBox', vbString);
    });
  };
}(Hammerhead));