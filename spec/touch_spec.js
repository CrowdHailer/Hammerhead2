ddescribe('notification of gestures', function(){
  'use strict';
  // nothing for touch release without pinch or drag
  // use last drag or pinch data

  var $svg, $path, defaultGesture, remove;
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
  });

  afterEach(function(){
    remove();
    $svg.remove();
  });

  describe('on target gestures', function(){
    var dummy;
    beforeEach(function(){
      dummy = jasmine.createSpy();
    });

    it('should displace on acive element', function(){
      bean.on($svg[0], 'displace', dummy);
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      expect(dummy).toHaveBeenCalled();
    });

    it('should inflate on acive element', function(){
      bean.on($svg[0], 'inflate', dummy);
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      expect(dummy).toHaveBeenCalled();
    });

    it('should translate after dragging', function(){
      bean.on($svg[0], 'translate', dummy);
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      expect(dummy).toHaveBeenCalled();
    });

    it('should magnify after pinch', function(){
      bean.on($svg[0], 'magnify', dummy);
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      expect(dummy).toHaveBeenCalled();
    });

    it('should not call without pinch or drag', function(){
      bean.on($svg[0], 'translate', dummy);
      bean.on($svg[0], 'magnify', dummy);
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      expect(dummy).not.toHaveBeenCalled();
    });
  });


});
