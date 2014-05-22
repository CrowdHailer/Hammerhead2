_.expose('merge map');
var mapChannels = map(function(value){
  return value.args[0];
});

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
    it('should publish a start event on touch', function(){
      hammertime.trigger('touch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls[0]).toEqual('start');
    });
    it('should not publish a start on wrong element', function(){
      var gesture = merge({target: 'not-element'})(defaultGesture);
      hammertime.trigger('touch', gesture);
      expect(pubsubz.publish).not.toHaveBeenCalled();
    });
    it('should keep watching after a touch on wrong element', function(){
      var gesture = merge({target: 'not-element'})(defaultGesture);
      hammertime.trigger('touch', gesture);
      hammertime.trigger('touch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls[0]).toEqual('start');
    });
    it('should publish start only once', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('touch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls.length).toEqual(1);
    });
    it('should publish start after end', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      hammertime.trigger('touch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'end', 'start']));
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
    it('should publish drag events after valid touch', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'drag']));
    });
    it('should publish multiple drag events after valid touch', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'drag', 'drag']));
    });
    it('should not publish zoom events after touch and drag', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'drag']));
    });
    it('should not publish drag events after no touch', function(){
      hammertime.trigger('drag', defaultGesture);
      expect(pubsubz.publish.calls.length).toEqual(0);
    });
    it('should not drag after a release event', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'drag', 'end']));
    });
  });
describe('pinch publishing', function(){
    beforeEach(function(){
      controller = Hammerhead.Controller(testSVG, {hammertime: hammertime});
      spyOn(pubsubz, 'publish');
    });
    afterEach(function(){
      controller.kill();
    });
    it('should publish pinch events after valid touch', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'pinch']));
    });
    it('should publish multiple pinch events after valid touch', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'pinch', 'pinch']));
    });
    it('should not publish zoom events after touch and pinch', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('drag', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'pinch']));
    });
    it('should not publish pinch events after no touch', function(){
      hammertime.trigger('pinch', defaultGesture);
      expect(pubsubz.publish.calls.length).toEqual(0);
    });
    it('should not pinch after a release event', function(){
      hammertime.trigger('touch', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      hammertime.trigger('release', defaultGesture);
      hammertime.trigger('pinch', defaultGesture);
      var calls = mapChannels(pubsubz.publish.calls);
      expect(calls).toEqual(Object.freeze(['start', 'pinch', 'end']));
    });
  });
});