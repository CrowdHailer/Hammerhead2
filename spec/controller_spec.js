describe('controller', function(){
  var hammertime, testSVG, testPath, preventDefault;
  beforeEach(function(){
    hammertime = Hammer(document);
    preventDefault = function(){};
    svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
    document.body.innerHTML += svgString;
    testSVG = document.getElementById('test');
    testPath = document.getElementById('test-path');
  });

  afterEach(function(){
    testSVG.parentElement.removeChild(testSVG);
  });

  xdescribe('Setup SVG element', function(){

  });

  describe('event beginning broadcast', function(){
    beforeEach(function(){
      Hammerhead.Controller(testSVG, {hammertime: hammertime});
      spyOn(pubsubz, 'publish');
    });
    it('should publish a start event on touchdown', function(){
      hammertime.trigger('touch', {target: testPath, preventDefault: preventDefault});
      expect(pubsubz.publish).toHaveBeenCalledWith('hammerhead', {x: 1});
    });
    it('should not publish a start on wrong element', function(){
      hammertime.trigger('touch', {target: 'not-element', preventDefault: preventDefault});
      expect(pubsubz.publish).not.toHaveBeenCalled();
    });
  });
});