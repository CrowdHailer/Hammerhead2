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
  parent.regulateOverflow = function(element){

    $(window).on('resize', function(){
      _.debounce(400)(tower.publish('windowResize'));
    });

    var updateOverflow = createOverflowUpdater(element);
    updateOverflow();
    tower.subscribe('resize')(updateOverflow);
  };
}(Hammerhead));