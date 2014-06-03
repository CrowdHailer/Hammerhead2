(function(parent){
  var tower = Belfry.getTower();

  var matrixAsCss = interpolate('matrix(%(a)s, %(b)s, %(c)s, %(d)s, %(e)s, %(f)s)');

  var Mx = SVGroovy.Matrix;
  var identityMatrix = Mx();

  var Pt = SVGroovy.Point;


  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');

  parent.managePosition = function($element){
    // windows FIX
    var elWidth = $element.width();
    var elHeight = $element.height();
    var ctmScale = $element[0].getScreenCTM().a;
    var boxWidth = $element.attr('viewBox').split(' ')[2];
    var boxHeight = $element.attr('viewBox').split(' ')[3];

    var widthRatio = (boxWidth* ctmScale) / elWidth;
    var heightRatio = (boxHeight * ctmScale) / elHeight;
    var properFix = widthRatio > heightRatio ? widthRatio : heightRatio;
    properFix = limitDecPlaces(1)(properFix);

    ////////////////////////////

    var aniFrame, matrixString;
    var agile = Hammerhead.AgileView($element[0]);

    listenStart(function(){
      beginAnimation();
    });

    listenDrag(function(data){
      // compose matrix creating from data and matrixAsCss using cumin
      matrixString = matrixAsCss(Mx.translating(data.delta.x, data.delta.y));
      var translation = Pt(data.delta);
      var fixedTranslation = Pt.scalar(properFix)(translation);
      agile.drag(fixedTranslation);
    });

    listenPinch(function(data, topic){
      matrixString = matrixAsCss(Mx.scaling(data.scale));
      agile.zoom(data.scale);
    });

    listenEnd(function(){
      agile.fix();
      vbString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      matrixString =  matrixAsCss(identityMatrix);
      cancelAnimationFrame(aniFrame);
      requestAnimationFrame(function(){
        $element.attr('viewBox', vbString);
        $element.css({
          '-webkit-transform': matrixString,
          '-ms-transform': matrixString,
          'transform': matrixString
        });
      });
    });

    function render(){
      $element.css({
        '-webkit-transform': matrixString,
        '-ms-transform': matrixString,
        'transform': matrixString
      });
      aniFrame = requestAnimationFrame( render );
    }

    function beginAnimation(){
      aniFrame = requestAnimationFrame( render );
    }

    $element.css({
      '-webkit-transform': matrixAsCss(identityMatrix),
      'transform': matrixAsCss(identityMatrix),
      '-webkit-backface-visibility': 'hidden',
      '-webkit-transform-origin': '50% 50%',
      '-ms-transform-origin': '50% 50%',
      'transform-origin': '50% 50%'
    });


  };
}(Hammerhead));