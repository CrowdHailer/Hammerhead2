describe('element manipulation', function(){
  var $svg, $container;
  Mx = SVGroovy.Matrix;
  Pt = SVGroovy.Point;
  beforeEach(function(){
    $(document.body).append('<div id="container"><svg id="svg" viewBox="0 0 2000 1000"></svg></div>');
    $svg = $('#svg');
    $container = $('#container');
    $container.width(200).height(100);
    Hammerhead.regulateOverflow.call({
      $element: $svg,
      getConfig: _.peruse({
        overflowSurplus: 0.5,
        resizeDelay: 200
      })
    });
  });
  iit('it should displace', function(done){
    Hammerhead.managePosition.call({
      $element: $svg,
      element: $svg[0],
      getConfig: _.peruse({
        overflowSurplus: 0.5,
        resizeDelay: 200
      })
    });
    var XBtransform = _.compose(transformObject, Mx.asCss);
    $svg.css(XBtransform());
    bean.fire($svg[0], 'displace', Pt(2, 3));
    expect($svg.css('-webkit-transform')).toEqual(3);
    setTimeout(function(){
      console.log($svg.css('-webkit-transform'));
      done();
    }, 25);
    // bean.fire($svg[0], 'inflate', 3);
    // console.log($svg.css('-webkit-transform'));
    // bean.fire($svg[0], 'translate', Pt(2, 3));
    // console.log($svg.css('-webkit-transform'));
    // console.log($svg.attr('viewBox'));
    // setTimeout(function(){
    //   done();
    // }, 10);
  });
});

