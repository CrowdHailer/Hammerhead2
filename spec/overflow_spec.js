describe('managing overflow padding of active elements', function(){
  var inner, outer;
  beforeEach(function(){
    $(document.body).append('<div id="outer"><div id="inner"></div><div>');
    inner = $('#inner');
    outer = $('#outer');
  });

  afterEach(function(){
    $('#outer').remove();
  });

  it('should set a elements margin outside the parent, default 50%', function(){
    outer.width(200).height(100);
    Hammerhead.regulateOverflow.call({
      $element: inner,
      getConfig: _.peruse({
        overflowSurplus: 0.5,
        resizeDelay: 200
      })
    });
    expect($('#inner').width()).toEqual(400);
    expect($('#inner').height()).toEqual(200);
    expect($('#inner').css('margin')).toEqual('-50px -100px');
    $('#outer').width(300).height(100);
    bean.fire(window, 'resize');
    expect($('#inner').width()).toEqual(600);
    expect($('#inner').css('margin')).toEqual('-50px -150px');
    //requires separating after hammerhead teardown
  });
});