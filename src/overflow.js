(function(parent){
  var tower = Belfry.getTower();

  function createOverflowUpdater($element){
    $parent = $element.parent();
  }
  parent.regulateOverflow = function(element){
    tower.publish('windowResize');

    var update = createOverflowUpdater(element)
  };
}(Hammerhead));