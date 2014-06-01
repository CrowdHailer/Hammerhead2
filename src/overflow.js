(function(parent){
  var tower = Belfry.getTower();

  function createOverflowUpdater($element){
    $parent = $element.parent();
    return function(){
      var height = $parent.height();
      var width = $parent.width();
      $element.css('margin', -height/2 + ' ' + -width/2);
      $element.width(width * 2);
      $element.height(height * 2);
    };
  }

  var publishResize = _.debounce(200)(tower.publish('windowResize'));

  $(window).on('resize', function(){
    publishResize();
  });

  parent.regulateOverflow = function(element){
    var updateOverflow = createOverflowUpdater(element);
    
    updateOverflow();
    tower.subscribe('windowResize')(updateOverflow);
  };
}(Hammerhead));