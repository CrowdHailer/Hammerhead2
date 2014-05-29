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

  it('should return true if it has published to any listeners', function(){
    //option silent listeners
    tower.subscribe('channel1')(dummy);
    var response = tower.publish('channel1')({x: 1});
    expect(response).toBe(true);
  });

  it('should respond false if there are no listeners', function(){
    var response = tower.publish('channelEmpty')({x: 1});
    expect(response).toBe(false);
  });

  it('should create a singleton instance of tower', function(){
    var otherTower = Tower.getTower();
    expect(otherTower).toBe(tower);
  });

  it('should return a unique identifier', function(){
    var uid1 = tower.subscribe('channel1')(dummy);
    var uid2 = tower.subscribe('channel2')(dummy2);
    expect(uid2).not.toBe(uid1);
  });

  it('should be possible to unsubscribe with a uid and topic', function(){
    var uid = tower.subscribe('channelX')(dummy);
    tower.unsubscribe('channelX')(uid);
    tower.publish('channelX')({x: 1});
    expect(dummy).not.toHaveBeenCalled();
  });

  it('should be able to clear a topic/channel', function(){
    tower.subscribe('channel1')(dummy);
    tower.subscribe('channel1')(dummy2);
    tower.unsubscribe('channel1')();
    expect(tower.publish('channel1')({x: 1})).toBe(false);
    expect(dummy).not.toHaveBeenCalled();
    expect(dummy2).not.toHaveBeenCalled();
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