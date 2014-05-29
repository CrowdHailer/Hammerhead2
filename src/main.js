(function(parent){
  var $window = $(window);

  var publishResize = _.debounce(function(event){
    pubsubz.publish('resize');
  }, 400);

  function setOverspill($element){
    $parent = $element.parent();
    return function(){
      var height = $parent.height();
      var width = $parent.width();
      $element.css('margin', -height/2 + ' ' + -width/2);
      $element.width(width * 2);
      $element.height(height * 2);
    };
  }

  function create(elementId, options){
    var $el = $('#' + elementId);
    var el = $el[0];

    console.log('started with options ', options);

    var updateOverspill = setOverspill($el);

    Hammerhead.Controller(el, {hammertime: options.hammertime});
    var agile = Hammerhead.AgileView(el);

    // Initial styling
    updateOverspill();
    $el.css({
      '-webkit-transform': 'translate(0px, 0px)',
      'transform': 'translate(0px, 0px)',
      '-webkit-backface-visibility': 'hidden',
      '-webkit-transform-origin': '50% 50%',
      '-ms-transform-origin': '50% 50%',
      'transform-origin': '50% 50%'
    });

    // Watch resize -  should be singleton object
    $window.on('resize', function(event){
      publishResize(event);
    });

    // Deliver resize
    pubsubz.subscribe('resize', function(){
      updateOverspill();
    });

    pubsubz.subscribe('end', function(){
      agile.fix();
      var newString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      $el.css('-webkit-transform', 'translate(0px, 0px)');
      $el.css('-ms-transform', 'translate(0px, 0px)');
      $el.css('transform', 'translate(0px, 0px)');
      $el.attr('viewBox', newString);
    });

    pubsubz.subscribe('drag', function(gesture, other){
      var dx = other.deltaX;
      var dy = other.deltaY;
      $el.css('-webkit-transform', 'translate(' + dx + 'px, ' + dy + 'px)');
      $el.css('-ms-transform', 'translate(' + dx + 'px, ' + dy + 'px)');
      $el.css('transform', 'translate(' + dx + 'px, ' + dy + 'px)');
      pt = Hammerhead.Point(other);
      agile.drag(pt);
    });

    pubsubz.subscribe('pinch', function(item, gesture){
      $el.css('-webkit-transform', 'scale(' + gesture.scale + ')');
      $el.css('-ms-transform', 'scale(' + gesture.scale + ')');
      $el.css('transform', 'scale(' + gesture.scale + ')');
      agile.zoom(gesture.scale);
    });
  }
  parent.Create = create;
}(Hammerhead));