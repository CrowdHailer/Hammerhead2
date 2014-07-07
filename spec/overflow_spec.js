describe('managing overflow padding of active elements', function(){
  'use strict';

  var $svg, $container, remove;
  beforeEach(function(){
    $(document.body).append('<div id="container"><svg id="svg" viewBox="0 0 2000 1000"></svg></div>');
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

  iit('should set an elements overflow margin', function(){
    expect($svg.css('margin')).toEqual('-50px -100px');
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