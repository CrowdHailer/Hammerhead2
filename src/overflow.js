(function(parent){
  'use strict';
  // var tower = Belfry.getTower();

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  // $(window).on('resize', tower.publish('windowResize'));

  function createOverflowUpdater(){

    var surplus = this.getConfig('overflowSurplus');
    var factor = 2 * surplus + 1;
    var $parent = this.$element.parent();

    // _.debounce(this.getConfig('resizeDelay'))(function(){
    //   var height = $parent.height();
    //   var width = $parent.width();
    //   this.$element
    //     .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
    //     .width(width * factor)
    //     .height(height * factor);
    // }).bind(this);

    var $element = this.$element;
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
    console.log(this)
    var updateOverflow = createOverflowUpdater.call(this);
    
    updateOverflow();
    // tower.subscribe('windowResize')(updateOverflow);
  };
}(Hammerhead));