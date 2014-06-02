describe('initialisation process', function(){
  it('should create a zepto element', function(){
    spyOn(window, '$').andReturn([]);
    Hammerhead.create('name');
    expect(window.$).toHaveBeenCalledWith('svg#name');
  });
  it('should return when no element found', function(){
    spyOn(window, '$').andReturn([]);
    var created = Hammerhead.create('name');
    expect(created).toBe(false);
  });
  it('initialise components when element found', function(){
    var element = {id: 'svg'};
    spyOn(window, '$').andReturn([element]);
    spyOn(Hammerhead, 'regulateOverflow');
    spyOn(Hammerhead, 'touchDispatch');
    spyOn(Hammerhead, 'managePosition');
    spyOn(Hammerhead, 'mousewheelDispatch');
    var created = Hammerhead.create('name');
    expect(Hammerhead.regulateOverflow).toHaveBeenCalledWith([element]);
    expect(Hammerhead.touchDispatch).toHaveBeenCalledWith([element]);
    expect(Hammerhead.managePosition).toHaveBeenCalledWith([element]);
    expect(Hammerhead.mousewheelDispatch).toHaveBeenCalledWith([element]);
  });
});