describe('ViewBox', function(){
  'use strict';

  var Pt, VB, p1, p2, viewBox, newViewBox;
  beforeEach(function(){
    Pt = SVGroovy.Point;
    VB = Hammerhead.ViewBox;
    p1 = Pt(0, 1);
    p2 = Pt(8, 7);
  });
  describe('initialise', function(){
    it('from maximum and minimum', function(){
      viewBox = VB(p1, p2);
      expect(viewBox.minimal).toEqual(p1);
      expect(viewBox.maximal).toEqual(p2);
    });

    xit('should be immutable', function(){
      viewBox = VB(p1, p2);
      viewBox.minimal = 3;
      expect(viewBox.minimal).toEqual(p1);
    });

    it('from a viewbox attribute string', function(){
      viewBox = VB('1 2 3 4');
      expect(viewBox.minimal.x).toEqual(1);
      expect(viewBox.maximal.y).toEqual(6);
    });
  });

  describe('geometry', function(){
    beforeEach(function(){
      viewBox = VB(p1, p2);
    });

    it('should return an attribute string', function(){
      expect(VB.attrString(viewBox)).toEqual('0 1 8 6');
    });
    
    it('should be return a midpoint', function(){
      var midpoint = VB.midpoint(viewBox);
      expect(midpoint.x).toEqual(4);
      expect(midpoint.y).toEqual(4);
    });
  });

  describe('transformations "of content"', function(){
    beforeEach(function(){
      viewBox = VB(p1, p2);
    });
    it('should translate', function(){
      newViewBox = VB.translate(Pt(1, 1))(viewBox);
      expect(newViewBox.minimal.x).toEqual(-1);
      expect(newViewBox.minimal.y).toEqual(0);
      expect(newViewBox.maximal.x).toEqual(7);
      expect(newViewBox.maximal.y).toEqual(6);
      expect(Object.isFrozen(newViewBox)).toBe(true);
    });

    it('should scale from origin', function(){
      newViewBox = VB.scale(2)(viewBox);
      expect(newViewBox.minimal.x).toEqual(0);
      expect(newViewBox.minimal.y).toEqual(0.5);
      expect(newViewBox.maximal.x).toEqual(4);
      expect(newViewBox.maximal.y).toEqual(3.5);
      expect(Object.isFrozen(newViewBox)).toBe(true);
    });
    
    it('should zoom to center', function(){
      newViewBox = VB.zoom(2)()(viewBox);
      expect(newViewBox.minimal.x).toEqual(2);
      expect(newViewBox.minimal.y).toEqual(2.5);
      expect(newViewBox.maximal.x).toEqual(6);
      expect(newViewBox.maximal.y).toEqual(5.5);
      expect(Object.isFrozen(newViewBox)).toBe(true);
    });
  });
});