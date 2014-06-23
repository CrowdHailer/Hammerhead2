(function(parent){
  var tower = Belfry.getTower();

  // var buildConfig = _.foundation({
  //   overflowSurplus: 0.5,
  //   resizeDelay: 200
  // });

  var marginTemp = interpolate('-%(height)spx -%(width)spx');

  $(window).on('resize', tower.publish('windowResize'));

  function createOverflowUpdater(){
    // var config = buildConfig(options);

    var surplus = this.getConfig('overflowSurplus');
    var factor = 2 * surplus + 1;
    var $parent = this.$element.parent();

    return _.debounce(this.getConfig('resizeDelay'))(function(){
      var height = $parent.height();
      var width = $parent.width();
      this.$element
        .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
        .width(width * factor)
        .height(height * factor);
    }).bind(this);
  }

  parent.regulateOverflow = function(){
    var updateOverflow = createOverflowUpdater.call(this);
    
    updateOverflow();
    tower.subscribe('windowResize')(updateOverflow);
  };
}(Hammerhead));