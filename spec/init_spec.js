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

});