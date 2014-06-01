describe('agile SVG', function(){
  var VB = Hammerhead.ViewBox;
  var element, agile, delta, center;
  beforeEach(function(){
    element = {
      getAttribute: function(){},
      setAttribute: function(){},
      getScreenCTM: function(){}
    };
    var inverse = function(){ return SVGroovy.Matrix.scaling(2); };
    spyOn(element, 'getAttribute').andReturn('0 1 8 6');
    spyOn(element, 'setAttribute');
    spyOn(element, 'getScreenCTM').andReturn({inverse: inverse});
    agile = Hammerhead.AgileView(element, {throttleDelay: 0, conditions: function(){ return true; }});
    delta = SVGroovy.Point(1, 1);
    center = SVGroovy.Point(0, 1);
    screenCenter = SVGroovy.Point(0, 0.5);
  });

  describe('initialisation', function(){
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

    it('should scale to center if not given one', function(){
      agile.scale(2).fix();
      expect(VB.attrString(agile.getCurrent())).toEqual('2 2.5 4 3');
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

    it('should zoom to center if not given one', function(){
      agile.zoom(2).fix();
      expect(VB.attrString(agile.getCurrent())).toEqual('2 2.5 4 3');
    });
  });
  // displace distort 
});