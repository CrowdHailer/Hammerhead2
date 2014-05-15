describe('agile SVG', function(){
  var element, agile, delta, center;
  beforeEach(function(){
    element = {
      getAttribute: function(){},
      setAttribute: function(){},
      getScreenCTM: function(){}
    };
    var inverse = function(){ return {a: 2, b: 0, c: 0, d: 2, e: 0, f: 0}; };
    spyOn(element, 'getAttribute').andReturn('0 1 8 6');
    spyOn(element, 'setAttribute');
    spyOn(element, 'getScreenCTM').andReturn({inverse: inverse});
    agile = Hammerhead.AgileView(element, {throttleDelay: 0, conditions: function(){ return true; }});
    delta = Hammerhead.Point(1, 1);
    center = Hammerhead.Point(0, 1);
    screenCenter = Hammerhead.Point(0, 0.5);
  });

  describe('itialisation', function(){
    it('should have a current position', function(){
      var current = agile.getCurrent();
      expect(current.minimal.x).toEqual(0);
      expect(current.maximal.y).toEqual(7);
    });
  });

  xdescribe('manipulations in SVG units', function(){
    it('should translate in SVG units', function(){
      agile.translate(delta);
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '-1 0 8 6');
    });
  });
});