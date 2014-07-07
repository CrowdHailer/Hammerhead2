describe('managing overflow padding of active elements', function(){
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
        overflowSurplus: 0.5
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

  it('should update inner element overflow on resize', function(){
    $container.width(300).height(150);
    bean.fire(window, 'resize');
    expect($svg.css('margin')).toEqual('-75px -150px');
  });

  it('should update inner dimensions', function(){
    $container.width(300).height(150);
    bean.fire(window, 'resize');
    expect($svg.width()).toEqual(600);
    expect($svg.height()).toEqual(300);
  });

  it('should return event clearing function', function(){
    remove();
    $container.width(300).height(150);
    bean.fire(window, 'resize');
    expect($svg.width()).toEqual(400);
    expect($svg.height()).toEqual(200);
    expect($svg.css('margin')).toEqual('-50px -100px');
  });

    //throttle neads leading edge
});