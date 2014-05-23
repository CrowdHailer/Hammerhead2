describe('Point', function(){
  var Pt = Hammerhead.Point;
  describe('initialisation', function(){
    it('from two coordinates', function(){
      pt = Pt(2, 3);
      expect(pt.x).toEqual(2);
      expect(pt.y).toEqual(3);
    });

    it('specifically from a coordinate object', function(){
      pt = Pt.createFromCoordinate({x: 4, y: 5});
      expect(pt.x).toEqual(4);
      expect(pt.y).toEqual(5);
    });

    it('specifically from a page point', function(){
      pt = Pt.createFromPagePoint({pageX: 4, pageY: 5});
      expect(pt.x).toEqual(4);
      expect(pt.y).toEqual(5);
    });

    it('specifically from a displacement vector', function(){
      pt = Pt.createFromDisplacementVector({deltaX: 4, deltaY: 5});
      expect(pt.x).toEqual(4);
      expect(pt.y).toEqual(5);
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
      expect(Object.isFrozen(p3)).toBe(true);
    });

    it('should be able to subtract points', function(){
      p3 = Pt.subtract(p1)(p2);
      expect(p3.x).toEqual(-2);
      expect(p3.y).toEqual(-2);
      expect(Object.isFrozen(p3)).toBe(true);
    });

    it('should be able to multiply by a scalar', function(){
      p3 = Pt.scalar(3)(p1);
      expect(p3.x).toEqual(6);
      expect(p3.y).toEqual(9);
      expect(Object.isFrozen(p3)).toBe(true);
    });

    it('should be able to multiply decimal scalar', function(){
      p3 = Pt.scalar(0.5)(p1);
      expect(p3.x).toEqual(1);
      expect(p3.y).toEqual(1.5);
      expect(Object.isFrozen(p3)).toBe(true);
    });

    it('should be able to negate a point', function(){
      p3 = Pt.negate(p1)();
      expect(p3.x).toEqual(-2);
      expect(p3.y).toEqual(-3);
      expect(Object.isFrozen(p3)).toBe(true);
    });
  });
  describe('comparison operations "curried"', function(){
    var p1, p2, p3;
    it('should calculate BBox min', function(){
      p1 = Pt(4, 3);
      p2 = Pt(2, 5);
      p3 = Pt.min(p1)(p2);
      expect(p3.x).toEqual(2);
      expect(p3.y).toEqual(3);
      expect(Object.isFrozen(p3)).toBe(true);
    });

    it('should calculate BBox max', function(){
      p1 = Pt(4, 3);
      p2 = Pt(2, 5);
      p3 = Pt.max(p1)(p2);
      expect(p3.x).toEqual(4);
      expect(p3.y).toEqual(5);
      expect(Object.isFrozen(p3)).toBe(true);
    });
  });
  describe('matrix operations "curried"', function(){
    var m1, m2, pt, qt;
    it('should scale by matrix', function(){
      pt = Pt(2, 3);
      m1 = {a: 2, b: 0, c: 0, d: 2, e: 0, f: 0};
      qt = Pt.matrixTransform(m1)(pt);
      expect(qt.x).toEqual(4);
      expect(qt.y).toEqual(6);
      expect(Object.isFrozen(qt)).toBe(true);
    });

    it('should rotate by matrix', function(){
      pt = Pt(2, 3);
      m1 = {a: 0, b: 1, c: -1, d: 0, e: 0, f: 0};
      qt = Pt.matrixTransform(m1)(pt);
      expect(qt.x).toEqual(-3);
      expect(qt.y).toEqual(2);
      expect(Object.isFrozen(qt)).toBe(true);
    });

    it('should translate by matrix', function(){
      pt = Pt(2, 3);
      m1 = {a: 1, b: 0, c: 0, d: 1, e: 10, f: 20};
      qt = Pt.matrixTransform(m1)(pt);
      expect(qt.x).toEqual(12);
      expect(qt.y).toEqual(23);
      expect(Object.isFrozen(qt)).toBe(true);
    });
  });
  describe('collected operations', function(){
    it('should map points', function(){

    });
    it('NO TESTS - DEMO ONLY', function(){
      var collection = [Pt(2, 3), Pt(0, 1), Pt(-2, 0)];
      var double = Pt.scalar(2);
      var scaledCollection = _.map(collection, double);
      console.log(scaledCollection);
      var translate = Pt.add(Pt(0, 10));
      var translatedCollection = _.map(collection, translate);
      console.log(translatedCollection);
    });
  });
});