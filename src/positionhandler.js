(function(parent){
  var matrixAsCss = interpolate('matrix(%(a)s, %(b)s, %(c)s, %(d)s, %(e)s, %(f)s)');

  var identityMatrix = SVGroovy.Matrix();
  tower = Belfry.getTower();

  var listenStart = tower.subscribe('start');
  var listenDrag = tower.subscribe('drag');
  var listenPinch = tower.subscribe('pinch');
  var listenEnd = tower.subscribe('end');
  parent.managePosition = function($element){
    var matrixString;
    var agile = Hammerhead.AgileView($element[0]);

    listenDrag(function(data){
      var matrix = SVGroovy.Matrix.translating(data.delta.x, data.delta.y);
      matrixString = matrixAsCss(matrix);
      pt = SVGroovy.Point(data.delta);
      agile.drag(pt);
    });

    listenPinch(function(data, topic){
      var matrix = SVGroovy.Matrix.scaling(data.scale);
      matrixString = matrixAsCss(matrix);
      pt = SVGroovy.Point(data.center);
      agile.zoom(data.scale);
    });

    listenEnd(function(){
      agile.fix();
      var vbString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      console.log(vbString);
      matrixString =  matrixAsCss(identityMatrix);
      $element.attr('viewBox', vbString);
    });

    var aniFrame;

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

    function decistAnimation(){
      // cancelAnimationFrame(aniFrame);
    }

    tower.subscribe('start')(function(data, topic){
      beginAnimation();
    });

    tower.subscribe('end')(function(data, topic){
      decistAnimation();
    });

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