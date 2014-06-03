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
    console.log(elHeight, elWidth)
    properFix = limitDecPlaces(1)(properFix);
    console.log(properFix, screen.devicePixelRatio);

    ////////////////////////////

    var aniFrame, continueAnimate, matrixString;
    var agile = Hammerhead.AgileView($element[0]);

    listenStart(function(){
      continueAnimate = true;
      beginAnimation();
    });

    listenDrag(function(data){
      // compose matrix creating from data and matrixAsCss using cumin
      matrixString = matrixAsCss(Mx.translating(data.delta.x, data.delta.y));
      console.log(properFix)
      console.log('booch', Pt.scalar(properFix)(Pt(data.delta)))
      agile.drag(Pt(data.delta));
    });

    listenPinch(function(data, topic){
      matrixString = matrixAsCss(Mx.scaling(data.scale));
      agile.zoom(data.scale);
    });

    listenEnd(function(){
      agile.fix();
      var vbString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      matrixString =  matrixAsCss(identityMatrix);
      $element.attr('viewBox', vbString);
      continueAnimate = false;
    });

    function render(){
      $element.css({
        '-webkit-transform': matrixString,
        '-ms-transform': matrixString,
        'transform': matrixString
      });
      if (continueAnimate) {
        aniFrame = requestAnimationFrame( render );
      }
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