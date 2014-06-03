describe('responding to tower broadcasts', function(){
  var testSVG, tower, live;
  var Pt = SVGroovy.Point;
  beforeEach(function(){
    //setting up DOM
    svgString = '<div id="overflow" width="500px" height="250px"><svg id="test" viewBox="0 0 2000 1000"></svg></div>';
    document.body.innerHTML += svgString;
    testSVG = $('#test');
    testSVG.parent().width(500);
    testSVG.parent().height(250);
    live = Hammerhead.managePosition(testSVG);

    // test apparatus
    tower = Belfry.getTower();
  });
  afterEach(function(){
    testSVG.remove();
  });
  it('should fail', function(){
    expect(testSVG.attr('viewBox')).toEqual('0 0 2000 1000');
    tower.publish('start')(testSVG[0]);
    tower.publish('drag')({
      element: testSVG[0],
      delta: Pt(100, 200)
    });
    var start = _.now();
    var rounds = 0;
    while (_.now()-start < 1000){
      rounds += 1;
    }
    expect(testSVG.attr('viewBox')).toEqual('0 0 2000 1000');
    console.log(testSVG.css('transform'));
    console.log(testSVG.css('-webkit-transform')); //possibly not working due to render loop;
    tower.publish('end')({
      element: testSVG[0]
    });
    expect(testSVG.attr('viewBox')).toEqual('-400 -800 2000 1000');
  });
});