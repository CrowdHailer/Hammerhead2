/* global Hammerhead, bean, SVGroovy, Hammer*/

(function(parent){
    'use strict';

    var Pt = SVGroovy.Point;
    var hammertime = Hammer(document);
    
    parent.dispatchTouch = function(){
        var element = this.element,
            isComponent = this.isComponent,
            live = false,
            dragging = false,
            pinching = false;

        hammertime.on('touch', function(evt){
            live = isComponent(evt.target);
            if (live) { evt.gesture.preventDefault(); }
        });

        hammertime.on('drag', function(evt){
            if (live) { evt.gesture.preventDefault(); }
            if (live && !pinching) {
                dragging = Pt(evt.gesture);
                bean.fire(element, 'displace', Pt(evt.gesture));
            }
        });

        hammertime.on('pinch', function(evt){
            if (live) { evt.gesture.preventDefault(); }
            if (live) {
                dragging = false;
                pinching = evt.gesture.scale;
                bean.fire(element, 'inflate', pinching);
            }
        });

        hammertime.on('release', function(evt){
            if (live) {
                evt.gesture.preventDefault();
                if (dragging) {
                    bean.fire(element, 'translate', dragging);
                }
                if (pinching) {
                    bean.fire(element, 'magnify', pinching);
                }
                live = false;
                pinching = false;
                dragging = false;
            }
        });

        return function(){
            hammertime.dispose();
        };
    };
}(Hammerhead));