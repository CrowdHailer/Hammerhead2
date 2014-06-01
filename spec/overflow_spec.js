describe('managing overflow padding of active elements', function(){
  it('should subscribe to the tower', function(){
    var tower = Belfry.getTower();
    spyOn(tower, 'publish');
    Hammerhead.regulateOverflow();
    expect(tower.publish).toHaveBeenCalledWith('windowResize');
  });
});