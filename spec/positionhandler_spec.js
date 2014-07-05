ddescribe('element manipulation', function(){
  var $svg, $container;
  Mx = SVGroovy.Matrix;
  Pt = SVGroovy.Point;
  beforeEach(function(){
    $(document.body).append('<div id="container"><svg id="svg" viewBox="0 0 2000 1000"></svg></div>');
    $svg = $('#svg');
    $container = $('#container');
  });
  it('it should displace', function(){
    Hammerhead.managePosition.call({
      $element: $svg,
      getConfig: _.peruse({
        overflowSurplus: 0.5,
        resizeDelay: 200
      })
    });
    var XBtransform = _.compose(transformObject, Mx.asCss);
    $svg.css(XBtransform());
    bean.fire($svg[0], 'displace', Pt(2, 3));
    console.log($svg.css('-webkit-transform'));
    bean.fire($svg[0], 'displace', Pt());
    console.log($svg.css('-webkit-transform'));
    bean.fire($svg[0], 'inflate', 3);
    console.log($svg.css('-webkit-transform'));
    // setTimeout(function(){
    //   done();
    // }, 10);
  });
});

