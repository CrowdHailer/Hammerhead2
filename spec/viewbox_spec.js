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
  });
});