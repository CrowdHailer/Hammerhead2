/* global Hammerhead, _, bean*/

(function(parent){
    'use strict';

    parent.mousewheelDispatch = function(){

        var element = this.$element[0];
        var scale;
        var factor = 1 + this.getConfig('mousewheelSensitivity');

        var finishScrolling = _.debounce(this.getConfig('mousewheelDelay'))(function(scaleFactor){
            bean.fire(element, 'magnify', scaleFactor);
            scale = null;
        });

        var handleMousewheel = function(event){
            if (!scale) {
                if (!this.isComponent(event.target)) {
                    return;
                }

                scale = 1;
            }

            if (event.wheelDelta > 0) {
                scale *= factor;
            } else {
                scale /= factor;
            }

            bean.fire(element, 'inflate', scale);
            finishScrolling(scale);
        }.bind(this);

        $(document).on('mousewheel', handleMousewheel);
    };

}(Hammerhead));