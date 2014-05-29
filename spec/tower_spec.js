describe('tower', function(){
  var tower, dummy, dummy2;
  beforeEach(function(){
    tower = Tower.getTower();
    dummy = jasmine.createSpy();
    dummy2 = jasmine.createSpy();
  });

  it('should publish events to the subscribed handler', function(){
    tower.subscribe('channel1')(dummy);
    tower.publish('channel1')({x: 1});
    expect(dummy).toHaveBeenCalledWith({x: 1});
  });

  it('should publish events to all the subscribed handlers', function(){
    tower.subscribe('channel1')(dummy);
    tower.subscribe('channel1')(dummy2);
    tower.publish('channel1')({x: 1});
    expect(dummy).toHaveBeenCalledWith({x: 1});
    expect(dummy2).toHaveBeenCalledWith({x: 1});
  });

  it('should create a singleton instance of tower', function(){
    var otherTower = Tower.getTower();
    expect(otherTower).toBe(tower);
  });

  it('should publish events to only the correct channel', function(){
    tower.subscribe('channel1')(dummy);
    tower.subscribe('channel2')(dummy2);
    tower.publish('channel1')({x: 1});
    expect(dummy).toHaveBeenCalledWith({x: 1});
    expect(dummy2).not.toHaveBeenCalledWith({x: 1});
    tower.publish('channel2')({x: 2});
    expect(dummy).not.toHaveBeenCalledWith({x: 2});
    expect(dummy2).toHaveBeenCalledWith({x: 2});
  });
});