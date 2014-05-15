describe('ViewBox', function(){
  var Pt, VB, p1, p2, viewBox, newViewBox;
  beforeEach(function(){
    Pt = Hammerhead.Point;
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

    it('should be immutable', function(){
      viewBox = VB(p1, p2);
      viewBox.minimal = 3;
      expect(viewBox.minimal).toEqual(p1);
    });
  });

  describe('geometry', function(){
    beforeEach(function(){
      viewBox = VB(p1, p2);
    });
    it('should be return a midpoint', function(){
      var midpoint = VB.midpoint(viewBox);
      expect(midpoint.x).toEqual(4);
      expect(midpoint.y).toEqual(4);
    });
  });

  describe('transformations "of content"', function(){
    it('should translate', function(){
      viewBox = VB(p1, p2);
      newViewBox = VB.translate(Pt(1, 1))(viewBox);
      expect(newViewBox.minimal.x).toEqual(-1);
      expect(newViewBox.minimal.y).toEqual(0);
      expect(newViewBox.maximal.x).toEqual(7);
      expect(newViewBox.maximal.y).toEqual(6);
      expect(Object.isFrozen(newViewBox)).toBe(true);
    });
  });
});