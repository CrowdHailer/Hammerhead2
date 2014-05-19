describe('controller', function(){
  var hammertime, testSVG, testPath, preventDefault, defaultGesture;
  beforeEach(function(){
    hammertime = Hammer(document);
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

  xdescribe('Setup SVG element', function(){

  });

  describe('event beginning broadcast', function(){
    var controller;
    beforeEach(function(){
      controller = Hammerhead.Controller(testSVG, {hammertime: hammertime});
      spyOn(pubsubz, 'publish');
    });
    afterEach(function(){
      controller.kill();
    });
    it('should publish a start event on touchdown', function(){
      hammertime.trigger('touch', defaultGesture);
      expect(pubsubz.publish).toHaveBeenCalled();
    });
    it('should not publish a start on wrong element', function(){
      defaultGesture.target = 'not-element';
      hammertime.trigger('touch', defaultGesture);
      expect(pubsubz.publish).not.toHaveBeenCalled();
    });
  });

  describe('drag publishing', function(){
    beforeEach(function(){
      controller = Hammerhead.Controller(testSVG, {hammertime: hammertime});
      spyOn(pubsubz, 'publish');
    });
    afterEach(function(){
      controller.kill();
    });
    it('should publish drag events after valid touchdown', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      expect(pubsubz.publish.calls.length).toEqual(2);
    });
    it('should not publish drag events after no touchdown', function(){
      hammertime.trigger('drag', defaultGesture);
      expect(pubsubz.publish.calls.length).toEqual(0);
    });
  });
});