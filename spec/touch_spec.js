describe('notification of gestures', function(){
  'use strict';
  // nothing for touch release without pinch or drag
  // use last drag or pinch data
  // might need throttling but animframe could be acceptable

  var $svg, $path, defaultGesture, remove,
    onDisplace, onInflate, onTranslate, onMagnify;
  var hammertime = Hammer(document);
  beforeEach(function(){
    $(document.body).append('<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>');
    $svg = $('#test');
    $path = $('#test-path');
    defaultGesture = {target: $path[0], preventDefault: function(){}};
    remove = Hammerhead.dispatchTouch.call({
      $element: $svg,
      element: $svg[0],
      isComponent: function(el){
        return el === $path[0];
      }
    });
    onDisplace = jasmine.createSpy();
    onInflate = jasmine.createSpy();
    onTranslate = jasmine.createSpy();
    onMagnify = jasmine.createSpy();
    bean.on($svg[0], 'displace', onDisplace);
    bean.on($svg[0], 'inflate', onInflate);
    bean.on($svg[0], 'translate', onTranslate);
    bean.on($svg[0], 'magnify', onMagnify);
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
