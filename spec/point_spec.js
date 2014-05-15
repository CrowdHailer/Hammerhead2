describe('Point', function(){
  describe('initialisation', function(){
    it('from two coordinates', function(){
      pt = Hammerhead.Point(2, 3);
      expect(pt.x).toEqual(2);
      expect(pt.y).toEqual(3);
    });

    it('should be imutable', function(){
      pt = Hammerhead.Point(2, 3);
      pt.x = 5;
      pt.y = 6;
      expect(pt.x).toEqual(2);
      expect(pt.y).toEqual(3);
    });
  });
});