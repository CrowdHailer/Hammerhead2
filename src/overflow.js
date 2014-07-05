(function(parent){
  'use strict';
  // var tower = Belfry.getTower();

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  // $(window).on('resize', tower.publish('windowResize'));

  function createOverflowUpdater(){

    var surplus = this.getConfig('overflowSurplus');
    var factor = 2 * surplus + 1;
    var $element = this.$element;
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

  parent.regulateOverflow = function(){
    var updateOverflow = createOverflowUpdater.call(this);
    updateOverflow();
    bean.on(window, 'resize', updateOverflow);
    return function(){
      bean.off(window, 'resize', updateOverflow);
    };
  };
}(Hammerhead));