describe('managing overflow padding of active elements', function(){
  xit('should subscribe to the tower', function(){
    var tower = Belfry.getTower();
    spyOn(tower, 'publish');
    Hammerhead.regulateOverflow();
    expect(tower.publish).toHaveBeenCalledWith('windowResize');
  });
  it('should set a elements margin outside the parent', function(){
    var spy = jasmine.createSpy();
    spy.parent = function(){};
    spyOn(spy, 'parent');
    Hammerhead.regulateOverflow(spy);
    expect(spy.parent).toHaveBeenCalled();
  });
});