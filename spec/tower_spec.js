describe('tower', function(){
  var tower;
  beforeEach(function(){
    tower = Tower.getTower();
  });
  it('should publish events to the subscribed handler', function(){
    dummy = jasmine.createSpy();
    tower.subscribe('channel1')(dummy);
    tower.publish('channel1')({x: 1});
    expect(dummy).toHaveBeenCalledWith({x: 1});
  });

  it('should publish events to all the subscribed handlers', function(){
    dummy = jasmine.createSpy();
    dummy2 = jasmine.createSpy();
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
});