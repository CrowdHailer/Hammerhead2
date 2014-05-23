(function(parent){
  function create(elementId){
    hammertime = Hammer(document);
    var el = document.getElementById(elementId);
    var bosh = Hammerhead.Controller(el, {hammertime: hammertime});
    var agile = Hammerhead.AgileView(el);
    pubsubz.subscribe('start', function(){
      console.log('start');
    });
    pubsubz.subscribe('end', function(){
      agile.fix();
      var newString = Hammerhead.ViewBox.attrString(agile.getCurrent());
      el.setAttribute('style', '');
      el.setAttribute('viewBox', newString);
    });
    pubsubz.subscribe('drag', function(gesture, other){
      var dx = other.deltaX;
      var dy = other.deltaY;
      el.setAttribute('style', '-webkit-transform: translate(' + dx + 'px, ' + dy + 'px)');
      pt = Hammerhead.Point(other);
      agile.drag(pt);

    });
    pubsubz.subscribe('pinch', function(item, gesture){
      el.setAttribute('style', '-webkit-transform: scale(' + gesture.scale + ')');
      agile.zoom(gesture.scale);
    });
  }
  parent.Create = create;
}(Hammerhead));