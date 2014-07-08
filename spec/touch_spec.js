describe('notification of gestures', function(){
  'use strict';
  // nothing for touch release without pinch or drag
  // use last drag or pinch data
  // might need throttling but animframe could be acceptable

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
    hammertime.trigger('drag', defaultGesture);
    expect(onDisplace).toHaveBeenCalled();
  });

  it('should inflate after touch on acive element', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', defaultGesture);
    expect(onInflate).toHaveBeenCalled();
  });

  it('should translate on release after dragging', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', defaultGesture);
    hammertime.trigger('release', defaultGesture);
    expect(onTranslate).toHaveBeenCalled();
  });

  it('should magnify on release after pinch', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', defaultGesture);
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
    hammertime.trigger('pinch', defaultGesture);
    hammertime.trigger('drag', defaultGesture);
    expect(onDisplace).not.toHaveBeenCalled();
  });

  it('should not displace after touch on inacive element', function(){
    hammertime.trigger('touch', _.augment(defaultGesture)({target: {}}));
    hammertime.trigger('drag', defaultGesture);
    expect(onDisplace).not.toHaveBeenCalled();
  });
});
