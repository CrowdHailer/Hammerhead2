describe('element manipulation', function(){
  'use strict';

  var $svg, $container;
  var Pt = SVGroovy.Point;
  beforeEach(function(){
    $(document.body).append('<div id="container"><svg id="svg" viewBox="0 0 2000 1000"></svg></div>');
    $svg = $('#svg');
    $container = $('#container');
    $container.width(200).height(100);
  });

  afterEach(function(){
    $container.remove();
  });

  it('it should displace', function(done){
    Hammerhead.managePosition.call({
      $element: $svg,
      element: $svg[0],
      getConfig: _.peruse({})
    });
    bean.fire($svg[0], 'displace', Pt(2, 3));
    setTimeout(function(){
      expect($svg.css('-webkit-transform')).toEqual('matrix(1, 0, 0, 1, 2, 3)');
      done();
    }, 20);
  });

  it('should inflate', function(done){
    Hammerhead.managePosition.call({
      $element: $svg,
      element: $svg[0],
      getConfig: _.peruse({})
    });
    bean.fire($svg[0], 'inflate', 2);
    setTimeout(function(){
      expect($svg.css('-webkit-transform')).toEqual('matrix(2, 0, 0, 2, 0, 0)');
      done();
    }, 20);
  });

  it('should translate', function(done){
    Hammerhead.managePosition.call({
      $element: $svg,
      element: $svg[0],
      getConfig: _.peruse({})
    });
    bean.fire($svg[0], 'translate', Pt(100, 0));
    setTimeout(function(){
      expect($svg.attr('viewBox')).toEqual('-3000 -500 4000 2000');
      done();
    }, 20);
  });
});

