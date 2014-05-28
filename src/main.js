(function(parent){
  function create(elementId){
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