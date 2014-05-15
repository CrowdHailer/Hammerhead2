describe('agile SVG', function(){
  var VB = Hammerhead.ViewBox;
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
      expect(VB.attrString(agile.getCurrent())).toEqual('0 1 8 6');
    });
  });

  describe('manipulations in SVG units', function(){
    it('should translate in SVG units', function(){
      agile.translate(delta).fix();
      expect(VB.attrString(agile.getCurrent())).toEqual('-1 0 8 6');
    });

    it('should not affect current view without a fix', function(){
      agile.translate(delta);
      expect(VB.attrString(agile.getCurrent())).toEqual('0 1 8 6');
    });

    it('should scale in SVG units', function(){
      agile.scale(2, center).fix();
      expect(VB.attrString(agile.getCurrent())).toEqual('0 1 4 3');
    });
  });

  describe('manipulations in screen units', function(){
    it('should drag in screen units', function(){
      agile.drag(delta).fix();
      expect(VB.attrString(agile.getCurrent())).toEqual('-2 -1 8 6');
    });

    it('should zoom in screen units', function(){
      agile.zoom(2, screenCenter).fix();
      expect(VB.attrString(agile.getCurrent())).toEqual('0 1 4 3');
    });
  });
  // displace distort 
});