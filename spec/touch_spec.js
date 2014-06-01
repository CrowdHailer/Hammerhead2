describe('dispatch touch notifications', function(){
  // console.log(hammertime) -very busy all elements not evenHandlers array;
  var testSVG, testPath, preventDefault, defaultGesture, dummy, tower, emitter;
  beforeEach(function(){
    // setting up DOM
    preventDefault = function(){};
    svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
    document.body.innerHTML += svgString;
    testSVG = $('#test');
    testPath = $('#test-path');

    // test apparatus
    tower = Belfry.getTower();
    dummy = jasmine.createSpy();
    defaultGesture = {target: testPath[0], preventDefault: preventDefault};
    var allChannels = ['start', 'drag', 'pinch', 'end'];

    _.map(_.compose(_.invoke(dummy), tower.subscribe))(allChannels);
    // hammerhead instance
    emitter = Hammerhead.touchDispatch(testSVG);
  });

  afterEach(function(){
    testSVG.remove();
    emitter.deactivate();
    // lots of dummies subscribe each new instance so works but might be nice to clean
  });
  describe('start circumstances', function(){
    it('should call start on touch event over path', function(){
      hammertime.trigger('touch', defaultGesture);
      expect(dummy).toHaveBeenCalledWith($('svg#test')[0], 'start');
    });

    it('should only call start once', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('touch', defaultGesture);
      expect(dummy.calls.length).toEqual(1);
    });

    it('should not call start if misses target', function(){
      var gesture = _.foundation(defaultGesture)({target: 'not-element'});
      hammertime.trigger('touch', gesture);
      expect(dummy).not.toHaveBeenCalled();
    });

    it('should not call drag pinch or end before start', function(){
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      expect(dummy).not.toHaveBeenCalled();
    });

    it('should keep watch after incorrect start events', function(){
      hammertime.trigger('drag', defaultGesture);
      var gesture = _.foundation(defaultGesture)({target: 'not-element'});
      hammertime.trigger('touch', gesture);
      hammertime.trigger('touch', defaultGesture);
      expect(dummy).toHaveBeenCalledWith($('svg#test')[0], 'start');
    });
  });
  describe('manipulations', function(){
    it('should not call any drags during a pinch event', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      expect(dummy.calls.length).toEqual(4);
    });
    it('should not call a pinches during a drag event', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      expect(dummy.calls.length).toEqual(4);
    });
  });
  describe('end event handling', function(){
    it('should be ready to accept new start event after release event', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      hammertime.trigger('touch', defaultGesture);
      expect(dummy.calls.length).toEqual(3);
      expect(dummy.mostRecentCall.args).toEqual([testSVG[0], 'start']);
    });

    it('should not accept any further drag or pinch after release', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      expect(dummy.calls.length).toEqual(2);
      expect(dummy.mostRecentCall.args[1]).toEqual('end');
    });
  });
});