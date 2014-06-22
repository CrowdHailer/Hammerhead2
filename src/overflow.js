(function(parent){
  var tower = Belfry.getTower();

  var buildConfig = _.foundation({
    surplus: 0.5
  });

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  function createOverflowUpdater($element, options){
    var config = buildConfig(options);

    var surplus = config.surplus;
    var factor = 2 * surplus + 1;
    var $parent = $element.parent();

    return function(){
      var height = $parent.height();
      var width = $parent.width();
      $element
        .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
        .width(width * factor)
        .height(height * factor);
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