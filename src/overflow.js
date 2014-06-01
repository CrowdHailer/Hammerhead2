(function(parent){
  var tower = Belfry.getTower();
  parent.regulateOverflow = function(element){
    tower.publish('windowResize');
  };
}(Hammerhead));