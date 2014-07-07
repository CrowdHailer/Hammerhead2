ddescribe('managing overflow padding of active elements', function(){
  'use strict';

  var $svg, $container, remove;
  beforeEach(function(){
    $(document.body).append('<div id="container"><div id="svg" viewBox="0 0 2000 1000"></div></div>');
    $svg = $('#svg');
    $container = $('#container');
    $container.width(200).height(100);
    remove = Hammerhead.regulateOverflow.call({
      $element: $svg,
      getConfig: _.peruse({
        overflowSurplus: 0.5,
        resizeDelay: 200
      })
    });
  });

  afterEach(function(){
    remove();
    $container.remove();
  });

  it('should set inner element overflow margin', function(){
    expect($svg.css('margin')).toEqual('-50px -100px');
  });

  it('should set inner element dimensions', function(){
    expect($svg.width()).toEqual(400);
    expect($svg.height()).toEqual(200);
  });

  xit('should set a elements margin outside the parent, default 50%', function(){
    outer.width(200).height(100);
    Hammerhead.regulateOverflow.call({
      $element: inner,
      getConfig: _.peruse({
        overflowSurplus: 0.5,
        resizeDelay: 200
      })
    });
    expect($('#inner').width()).toEqual(400);
    expect($('#inner').height()).toEqual(200);
    expect($('#inner').css('margin')).toEqual('-50px -100px');
    $('#outer').width(300).height(100);
    bean.fire(window, 'resize');
    expect($('#inner').width()).toEqual(600);
    expect($('#inner').css('margin')).toEqual('-50px -150px');
    //requires separating after hammerhead teardown
    //throttle neads leading edge
  });
});