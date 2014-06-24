describe('initialisation process', function(){
  var element = {};
  beforeEach(function(){
    spyOn(window, '$').andReturn([element]);
    spyOn(Hammerhead, 'regulateOverflow');
    spyOn(Hammerhead, 'touchDispatch');
    spyOn(Hammerhead, 'managePosition');
    spyOn(Hammerhead, 'mousewheelDispatch');
  });
  it('should create a zepto element when given a valid SVG element', function(){
    Hammerhead.create('name');
    expect(window.$).toHaveBeenCalledWith('svg#name');
  });
  it('should return false and warn the console if no SVG element found', function(){
    window.$.andReturn([]);
    spyOn(console, 'warn');
    var created = Hammerhead.create('incorrect');
    expect(console.warn).toHaveBeenCalledWith("SVG element 'incorrect' not found")
    expect(created).toBe(false);
  });
  it('should initialise all components when given valid id', function(){
    var created = Hammerhead.create('name');
    expect(Hammerhead.regulateOverflow).toHaveBeenCalledWith();
    expect(Hammerhead.touchDispatch).toHaveBeenCalledWith([element]);
    expect(Hammerhead.managePosition).toHaveBeenCalledWith();
    expect(Hammerhead.mousewheelDispatch).toHaveBeenCalledWith();
  });
  it('should make available the element', function(){
    var created = Hammerhead.create('name');
    expect(created.$element[0]).toBe(element)
  });
});