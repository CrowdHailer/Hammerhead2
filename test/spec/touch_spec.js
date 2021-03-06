describe('notification of gestures', function(){
  'use strict';
  // nothing for touch release without pinch or drag
  // use last drag or pinch data
  // might need throttling but animframe could be acceptable
  // SVGPoint could use string method

  var $svg, $path, svg, path, defaultGesture, remove, preventDefault,
    onDisplace, onInflate, onTranslate, onMagnify;
  var hammertime = Hammer(document);
  beforeEach(function(){
    $(document.body).append('<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>');
    $svg = $('#test');
    $path = $('#test-path');
    svg = $svg[0];
    path = $path[0];
    preventDefault = jasmine.createSpy('preventDefault');
    defaultGesture = {target: path, preventDefault: preventDefault};
    remove = Hammerhead.dispatchTouch.call({
      $element: $svg,
      element: $svg[0],
      isComponent: function(el){
        return el === path;
      }
    });
    onDisplace = jasmine.createSpy('displace');
    onInflate = jasmine.createSpy('inflate');
    onTranslate = jasmine.createSpy('translate');
    onMagnify = jasmine.createSpy('magnify');
    bean.on(svg, 'displace', onDisplace);
    bean.on(svg, 'inflate', onInflate);
    bean.on(svg, 'translate', onTranslate);
    bean.on(svg, 'magnify', onMagnify);
  });

  afterEach(function(){
    remove();
    $svg.remove();
  });

  it('should displace after touch on acive element', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', _.augment(defaultGesture)({deltaX: 2, deltaY: 3}));
    expect(onDisplace).toHaveBeenCalledWith(SVGroovy.Point(2, 3));
  });

  it('should inflate after touch on acive element', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', _.augment(defaultGesture)({scale: 2}));
    expect(onInflate).toHaveBeenCalledWith(2);
  });

  it('should translate on release after dragging', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', defaultGesture);
    hammertime.trigger('release', defaultGesture);
    expect(onTranslate).toHaveBeenCalled();
  });

  it('should magnify on release after pinch', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', _.augment(defaultGesture)({scale: 2}));
    hammertime.trigger('release', defaultGesture);
    expect(onMagnify).toHaveBeenCalled();
  });

  it('should not call without pinch or drag action', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('release', defaultGesture);
    expect(onTranslate).not.toHaveBeenCalled();
    expect(onMagnify).not.toHaveBeenCalled();
  });

  it('should prevent default touch action', function(){
    hammertime.trigger('touch', defaultGesture);
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should prevent default drag action', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', defaultGesture);
    expect(preventDefault.calls.count()).toEqual(2);
  });

  it('should prevent default pinch action', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', defaultGesture);
    expect(preventDefault.calls.count()).toEqual(2);
  });

  it('should prevent default release action', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('release', defaultGesture);
    expect(preventDefault.calls.count()).toEqual(2);
  });

  it('should not drag after a pinch', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', _.augment(defaultGesture)({scale: 2}));
    hammertime.trigger('drag', defaultGesture);
    expect(onDisplace).not.toHaveBeenCalled();
  });

  it('should not displace after touch on inacive element', function(){
    hammertime.trigger('touch', _.augment(defaultGesture)({target: {}}));
    hammertime.trigger('drag', defaultGesture);
    expect(onDisplace).not.toHaveBeenCalled();
  });

  it('should not inflate after touch on inacive element', function(){
    hammertime.trigger('touch', _.augment(defaultGesture)({target: {}}));
    hammertime.trigger('pinch', defaultGesture);
    expect(onInflate).not.toHaveBeenCalled();
  });

  it('should pass translation as displace argument', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', _.augment(defaultGesture)({deltaX: 2, deltaY: 3}));
    expect(onDisplace).toHaveBeenCalledWith(SVGroovy.Point(2, 3));
  });

  it('should pass scale as inflate argument', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', _.augment(defaultGesture)({scale: 2}));
    expect(onInflate).toHaveBeenCalledWith(2);
  });

  it('should pass last translation as translate argument', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', _.augment(defaultGesture)({deltaX: 2, deltaY: 3}));
    hammertime.trigger('drag', _.augment(defaultGesture)({deltaX: 4, deltaY: 5}));
    hammertime.trigger('release', _.augment(defaultGesture)({deltaX: 6, deltaY: 7}));
    expect(onTranslate).toHaveBeenCalledWith(SVGroovy.Point(4, 5));
  });

  it('should pass last pinch scale as magnify argument', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', _.augment(defaultGesture)({scale: 2}));
    hammertime.trigger('pinch', _.augment(defaultGesture)({scale: 3}));
    hammertime.trigger('release', _.augment(defaultGesture)({scale: 4}));
    expect(onMagnify).toHaveBeenCalledWith(3);
  });
});
