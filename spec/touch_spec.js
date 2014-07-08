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
    defaultGesture = {target: path, preventDefault: function(){}};
    remove = Hammerhead.dispatchTouch.call({
      $element: $svg,
      element: $svg[0],
      isComponent: function(el){
        return el === path;
      }
    });
    onDisplace = jasmine.createSpy();
    onInflate = jasmine.createSpy();
    onTranslate = jasmine.createSpy();
    onMagnify = jasmine.createSpy();
    bean.on(svg, 'displace', onDisplace);
    bean.on(svg, 'inflate', onInflate);
    bean.on(svg, 'translate', onTranslate);
    bean.on(svg, 'magnify', onMagnify);
  });

  afterEach(function(){
    remove();
    $svg.remove();
  });

  it('should displace on acive element', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', defaultGesture);
    expect(onDisplace).toHaveBeenCalled();
  });

  it('should inflate on acive element', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', defaultGesture);
    expect(onInflate).toHaveBeenCalled();
  });

  it('should translate after dragging', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('drag', defaultGesture);
    hammertime.trigger('release', defaultGesture);
    expect(onTranslate).toHaveBeenCalled();
  });

  it('should magnify after pinch', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('pinch', defaultGesture);
    hammertime.trigger('release', defaultGesture);
    expect(onMagnify).toHaveBeenCalled();
  });

  it('should not call without pinch or drag', function(){
    hammertime.trigger('touch', defaultGesture);
    hammertime.trigger('release', defaultGesture);
    expect(onTranslate).not.toHaveBeenCalled();
    expect(onMagnify).not.toHaveBeenCalled();
  });
});
