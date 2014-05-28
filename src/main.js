_.now = Date.now || function() { return new Date().getTime(); };

_.debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = _.now() - timestamp;
    if (last < wait) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = _.now();
    var callNow = immediate && !timeout;
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

(function(parent){
  var $window = $(window);

  var hammertime = Hammer(document);

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

  function create(elementId){
    var $el = $('#' + elementId);
    var el = $el[0];

    var updateOverspill = setOverspill($el);

    Hammerhead.Controller(el, {hammertime: hammertime});
    var agile = Hammerhead.AgileView(el);

    // Initial styling
    updateOverspill();
    $el.css({
      '-webkit-transform': 'translate(0px, 0px)',
      'transform': 'translate(0px, 0px)',
      '-webkit-backface-visibility': 'hidden',
      '-webkit-transform-origin': '50% 50%'
    });

    // Watch resize -  should be singleton object
    $window.on('resize', function(event){
      publishResize(event);
    });

    // Deliver resize
    pubsubz.subscribe('resize', function(){
      updateOverspill();
    });

    pubsubz.subscribe('start', function(){
      console.log('start');
    });

    pubsubz.subscribe('end', function(){
      agile.fix();
      var newString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      $el.css('-webkit-transform', 'translate(0px, 0px)');
      console.log(newString);
      $el.attr('viewBox', newString);
    });

    pubsubz.subscribe('drag', function(gesture, other){
      var dx = other.deltaX;
      var dy = other.deltaY;
      $el.css('-webkit-transform', 'translate(' + dx + 'px, ' + dy + 'px)');
      pt = Hammerhead.Point(other);
      agile.drag(pt);
      // console.log(dx, dy);
      // console.log(Hammerhead.ViewBox.attrString(agile.getTemporary()));
    });

    pubsubz.subscribe('pinch', function(item, gesture){
      $el.css('style', '-webkit-transform: scale(' + gesture.scale + ')');
      agile.zoom(gesture.scale);
    });
  }
  parent.Create = create;
}(Hammerhead));