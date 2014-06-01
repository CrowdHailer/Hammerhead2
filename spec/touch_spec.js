describe('dispatch touch notifications', function(){
  // console.log(hammertime) -very busy all elements not evenHandlers array;
  var testSVG, testPath, preventDefault, defaultGesture;
  beforeEach(function(){
    preventDefault = function(){};
    svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
    document.body.innerHTML += svgString;
    testSVG = document.getElementById('test');
    testPath = document.getElementById('test-path');
    defaultGesture = {target: testPath, preventDefault: preventDefault};
  });

  afterEach(function(){
    testSVG.parentElement.removeChild(testSVG);
  });

  it('should call start on touch event over path', function(){
    Hammerhead.touchDispatch($('svg#test'));
    var dummy = jasmine.createSpy();
    var tower = Belfry.getTower();
    tower.subscribe('start')(dummy);
    hammertime.trigger('touch', defaultGesture);
    expect(dummy).toHaveBeenCalledWith($('svg#test')[0], 'start');
  });
});