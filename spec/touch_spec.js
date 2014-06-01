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

    // hammerhead instance
    emitter = Hammerhead.touchDispatch(testSVG);
  });

  afterEach(function(){
    testSVG.remove();
    emitter.deactivate();
  });

  it('should call start on touch event over path', function(){
    tower.subscribe('start')(dummy);
    hammertime.trigger('touch', defaultGesture);
    expect(dummy).toHaveBeenCalledWith($('svg#test')[0], 'start');
  });

  it('should not call start misses target', function(){
    tower.subscribe('start')(dummy);
    var gesture = _.foundation(defaultGesture)({target: 'not-element'});
    hammertime.trigger('touch', gesture);
    expect(dummy).not.toHaveBeenCalled();
  });
});