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
  function create(elementId){
    var $window = $(window);

    var publishResize = _.debounce(function(event){
      pubsubz.publish('resize');
    }, 400);
    $window.on('resize', function(event){
      publishResize(event);
    });

    pubsubz.subscribe('resize', function(){
      console.log('resize');
    });

    hammertime = Hammer(document);
    var el = document.getElementById(elementId);
    var bosh = Hammerhead.Controller(el, {hammertime: hammertime});
    var agile = Hammerhead.AgileView(el);

    var $el = $('#' + elementId);
    var $parent = $el.parent();
    var marginString = -$parent.height()/2 + ' ' + -$parent.width()/2;
    $el.css('margin', marginString);
    $el.width($parent.width() * 2);
    $el.height($parent.height() * 2);
    console.log(marginString);

    pubsubz.subscribe('start', function(){
      console.log('start');
    });
    pubsubz.subscribe('end', function(){
      agile.fix();
      var newString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      $el.css('-webkit-transform', 'translate(0px, 0px)');
      $el.attr('viewBox', newString);
    });
    pubsubz.subscribe('drag', function(gesture, other){
      var dx = other.deltaX;
      var dy = other.deltaY;
      $el.css('style', '-webkit-backface-visibility: hidden; -webkit-transform-origin: 50% 50%; cursor: move; transition: none; -webkit-transition: none; -webkit-transform: translate(' + dx + 'px, ' + dy + 'px)');
      pt = Hammerhead.Point(other);
      agile.drag(pt);

    });
    pubsubz.subscribe('pinch', function(item, gesture){
      $el.css('style', '-webkit-transform: scale(' + gesture.scale + ')');
      agile.zoom(gesture.scale);
    });
  }
  parent.Create = create;
}(Hammerhead));