describe('initialisation process', function(){
  var element = {};
  var created;
  beforeEach(function(){
    spyOn(Hammerhead, 'regulateOverflow');
    spyOn(Hammerhead, 'touchDispatch');
    spyOn(Hammerhead, 'managePosition');
    spyOn(Hammerhead, 'mousewheelDispatch');
  });
  describe('invalid setup', function(){
    beforeEach(function(){
      spyOn(window, '$').andReturn([]);
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
  describe('valid element', function(){
    beforeEach(function(){
      spyOn(window, '$').andReturn([element]);
      created = Hammerhead.create('name');
    });
    it('should create a zepto element when given a valid SVG element', function(){
      expect(window.$).toHaveBeenCalledWith('svg#name');
    });
    it('should initialise all components when given valid id', function(){
      expect(Hammerhead.regulateOverflow).toHaveBeenCalledWith();
      expect(Hammerhead.touchDispatch).toHaveBeenCalledWith([element]);
      expect(Hammerhead.managePosition).toHaveBeenCalledWith();
      expect(Hammerhead.mousewheelDispatch).toHaveBeenCalledWith();
    });
    it('should make available the element', function(){
      expect(created.$element[0]).toBe(element);
      expect(created.element).toBe(element);
    });
    it('should make available a home call', function(){
      var dummy = jasmine.createSpy();
      var tower = Belfry.getTower();
      tower.subscribe('home')(dummy);
      created.home();
      expect(dummy).toHaveBeenCalledWith(element, 'home');
    });
    var defaultConfigs = {
      mousewheelSensitivity: 0.1,
      mousewheelDelay: 200,
      maxZoom: 2,
      minZoom: 0.5,
      overflowSurplus: 0.5,
      resizeDelay: 200
    };
    _.each(function(value, setting){
      it('should return config accessor for ' + setting, function(){
        expect(created.getConfig(setting)).toEqual(value);
      });
    })(defaultConfigs);
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