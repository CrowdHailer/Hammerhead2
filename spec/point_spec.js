describe('Point', function(){
  var Pt = Hammerhead.Point;
  describe('initialisation', function(){
    it('from two coordinates', function(){
      pt = Pt(2, 3);
      expect(pt.x).toEqual(2);
      expect(pt.y).toEqual(3);
    });

    it('should be imutable', function(){
      pt = Pt(2, 3);
      pt.x = 5;
      pt.y = 6;
      expect(pt.x).toEqual(2);
      expect(pt.y).toEqual(3);
    });

    it('should default to the origin point', function(){
      pt = Pt();
      expect(pt.x).toEqual(0);
      expect(pt.y).toEqual(0);
    });
  });
  describe('geometric operations "curried"', function(){
    var p1, p2, p3;
    beforeEach(function(){
      p1 = Pt(2, 3);
      p2 = Pt(4, 5);
    });
    it('should be able to add points', function(){
      p3 = Pt.add(p1)(p2);
      expect(p3.x).toEqual(6);
      expect(p3.y).toEqual(8);

    });
  });
});