(function(parent){
  var tower = Belfry.getTower();

  var buildConfig = _.foundation({
    overflowSurplus: 0.5,
    resizeDelay: 200
  });

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  $(window).on('resize', tower.publish('windowResize'));

  function createOverflowUpdater($element, options){
    var config = buildConfig(options);

    var surplus = config.overflowSurplus;
    var factor = 2 * surplus + 1;
    var $parent = $element.parent();

    return _.debounce(config.resizeDelay)(function(){
      var height = $parent.height();
      var width = $parent.width();
      $element
        .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
        .width(width * factor)
        .height(height * factor);
    });
  }

  parent.regulateOverflow = function(element, options){
    var updateOverflow = createOverflowUpdater(element, options);
    
    updateOverflow();
    tower.subscribe('windowResize')(updateOverflow);
  };
}(Hammerhead));