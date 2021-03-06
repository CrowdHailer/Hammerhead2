describe('element manipulation', function(){
    'use strict';

    var $svg, $container, remove;
    var Pt = SVGroovy.Point;
    var getTransform = function($element){
        return $element.css('transform') || $element.css('-webkit-transform');
    };
    beforeEach(function(){
        $(document.body).append('<div id="container"><svg id="svg" viewBox="0 0 2000 1000"></svg></div>');
        $svg = $('#svg');
        $container = $('#container');
        $container.width(200).height(100);
        remove = Hammerhead.managePosition.call({
            $element: $svg,
            element: $svg[0],
            getConfig: _.peruse({})
        });
    });

    afterEach(function(){
        remove();
        $container.remove();
    });

    it('it should displace', function(done){
        bean.fire($svg[0], 'displace', Pt(2, 3));
        setTimeout(function(){
            expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 3, 0, 1)');
            done();
        }, 20);
        expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    });

    it('should inflate', function(done){
        bean.fire($svg[0], 'inflate', 2);
        setTimeout(function(){
            expect(getTransform($svg)).toEqual('matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
            done();
        }, 20);
        expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    });

    it('should translate', function(done){
        bean.fire($svg[0], 'translate', Pt(100, 0));
        setTimeout(function(){
            expect($svg.attr('viewBox')).toEqual('-3000 -500 4000 2000');
            done();
        }, 20);
        expect($svg.attr('viewBox')).toEqual('-1000 -500 4000 2000');
    });

    it('should magnify', function(done){
        bean.fire($svg[0], 'magnify', 2);
        setTimeout(function(){
            expect($svg.attr('viewBox')).toEqual('0 0 2000 1000');
            done();
        }, 20);
        expect($svg.attr('viewBox')).toEqual('-1000 -500 4000 2000');
    });

    it('should clear css transform when permanently translated', function(done){
        bean.fire($svg[0], 'inflate', 2);
        setTimeout(function(){
            expect(getTransform($svg)).toEqual('matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
            bean.fire($svg[0], 'translate', Pt(100, 0));
            setTimeout(function(){
                // expect($svg.attr('viewBox')).toEqual('-3000 -500 4000 2000');
                expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
                done();
            }, 20);
            expect(getTransform($svg)).toEqual('matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
        }, 20);
    });

    it('should clear css transform when permanently magnified', function(done){
        bean.fire($svg[0], 'inflate', 2);
        setTimeout(function(){
            expect(getTransform($svg)).toEqual('matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
            bean.fire($svg[0], 'magnify', 2);
            setTimeout(function(){
                expect($svg.attr('viewBox')).toEqual('0 0 2000 1000');
                expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
                done();
            }, 20);
            expect(getTransform($svg)).toEqual('matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
        }, 20);
    });

    it('it should remove all bean events', function(done){
        remove();
        bean.fire($svg[0], 'displace', Pt(2, 3));
        setTimeout(function(){
            expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
            done();
        }, 20);
    });

    it('it should always cancel animation frame', function(done){
      //render viewbox loop is always executed and can collide with subsequent start events'

        bean.fire($svg[0], 'displace', Pt(0, 100));
        bean.fire($svg[0], 'translate', Pt(100, 0));
        setTimeout(function(){
            bean.fire($svg[0], 'displace', Pt(100, 0));
            setTimeout(function(){
                expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 100, 0, 0, 1)');
                done();
            }, 20);
        }, 20);
      // expect(getTransform($svg)).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    });

    it('should respond to goTo events', function(done){
        bean.fire($svg[0], 'goTo', {minimal: {x: 500, y: 500}, maximal: {x: 800, y: 700}});
        setTimeout(function(){
            expect($svg.attr('viewBox')).toEqual('350 400 600 400');
            done();
        }, 20);
    });
});

