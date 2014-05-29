describe('tower', function(){
  it('should publish events to the subscribed handler', function(){
    var tower = Tower.getTower();
    dummy = jasmine.createSpy();
    tower.subscribe('channel1')(dummy);
    tower.publish('channel1')({x: 1});
    expect(dummy).toHaveBeenCalledWith({x: 1});
  });

  it('should publish events to all the subscribed handlers', function(){
    var tower = Tower.getTower();
    dummy = jasmine.createSpy();
    dummy2 = jasmine.createSpy();
    tower.subscribe('channel1')(dummy);
    tower.subscribe('channel1')(dummy2);
    tower.publish('channel1')({x: 1});
    expect(dummy).toHaveBeenCalledWith({x: 1});
    expect(dummy2).toHaveBeenCalledWith({x: 1});
  });
});