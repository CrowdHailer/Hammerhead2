(function(parent){
  var tower = Belfry.getTower();

  var buildConfig = _.foundation({
    surplus: 0.5
  });

  function createOverflowUpdater($element, options){
    config = buildConfig(options);

    var factor = 2 * config.surplus + 1;

    var $parent = $element.parent();
    return function(){
      var height = $parent.height();
      var width = $parent.width();
      $element.css('margin', interpolate('-%(height)spx -%(width)spx')({height: height*config.surplus, width: width*config.surplus}));
      $element.width(width * factor);
      $element.height(height * factor);
    };
  }

  var publishResize = _.debounce(200)(tower.publish('windowResize'));

  $(window).on('resize', function(){
    publishResize();
  });

  parent.regulateOverflow = function(element, options){
    var updateOverflow = createOverflowUpdater(element, options);
    
    updateOverflow();
    tower.subscribe('windowResize')(updateOverflow);
  };
}(Hammerhead));