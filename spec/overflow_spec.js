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

  iit('should set a elements margin outside the parent, default 50%', function(){
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
  });
  
  xit('should update overflow on tower announcement', function(){
    $('#outer').width(300).height(100);
    Belfry.getTower().publish('windowResize')();
    expect($('#inner').width()).toEqual(600);
  });

  // warning does not clear channels so test order matters
  xit('should set a elements margin outside the parent dependant on configuration', function(){
  $('#outer').width(200).height(100);
    Hammerhead.regulateOverflow($('#inner'), {overflowSurplus: 0.2});
    expect($('#inner').width()).toEqual(280);
    expect($('#inner').height()).toEqual(140);
    expect($('#inner').css('margin')).toEqual('-20px -40px');
  });
});