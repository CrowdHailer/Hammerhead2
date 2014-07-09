describe('Failing initialisation process', function(){
  beforeEach(function(){
    spyOn(window, '$').and.returnValue([]);
    spyOn(console, 'warn');
    created = Hammerhead.create('incorrect');
  });
  it('should warn the console if no SVG element found', function(){
    expect(console.warn).toHaveBeenCalledWith("SVG element 'incorrect' not found")
  });
  it('should return false if no SVG element found', function(){
    expect(created).toBe(false);
  });
});

describe('Vaild initialisation process', function(){
  var element = {};
  var created;
  beforeEach(function(){
    spyOn(Hammerhead, 'regulateOverflow');
    spyOn(Hammerhead, 'dispatchTouch');
    spyOn(Hammerhead, 'managePosition');
    spyOn(Hammerhead, 'mousewheelDispatch');
    spyOn(window, '$').and.returnValue([element]);
    created = Hammerhead.create('name');
  });
  it('should create a zepto element', function(){
    expect(window.$).toHaveBeenCalledWith('svg#name');
  });
  it('should initialise all components', function(){
    expect(Hammerhead.regulateOverflow).toHaveBeenCalledWith();
    expect(Hammerhead.dispatchTouch).toHaveBeenCalledWith();
    expect(Hammerhead.managePosition).toHaveBeenCalledWith();
    expect(Hammerhead.mousewheelDispatch).toHaveBeenCalledWith();
  });
  it('should make available the element', function(){
    expect(created.$element[0]).toBe(element);
    expect(created.element).toBe(element);
  });
  describe('should wrap a configuration accessor with defaults', function(){
    var defaultConfigs = {
      mousewheelSensitivity: 0.1,
      mousewheelDelay: 200,
      maxZoom: 2,
      minZoom: 0.5,
      overflowSurplus: 0.5,
      resizeDelay: 200
    };
    _.each(function(value, setting){
      it('should have default for ' + setting +' of ' + value, function(){
        expect(created.getConfig(setting)).toEqual(value);
      });
    })(defaultConfigs);
  });
  describe('it should allow overwrites of configuration', function(){
    var customConfigs = {
      mousewheelSensitivity: 1,
      mousewheelDelay: 2,
      maxZoom: 3,
      minZoom: 4,
      overflowSurplus: 5,
      resizeDelay: 6
    };
     _.each(function(value, setting){
      it('should allow overwrite of ' + setting, function(){
        var custom = Hammerhead.create('name', customConfigs);
        expect(custom.getConfig(setting)).toEqual(value);
      });
    })(customConfigs);
  });
});
