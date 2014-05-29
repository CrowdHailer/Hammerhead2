describe('tower', function(){
  it('should publish events to the subscribed handlers', function(){
    var tower = Tower.getTower();
    dummy = jasmine.createSpy();
    tower.subscribe('channel1')(dummy);
    tower.publish('channel1')({x: 1});
    expect(dummy).toHaveBeenCalledWith({x: 1});
  });
});