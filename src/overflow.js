/* global Hammerhead, bean, interpolate*/

(function(parent){
    'use strict';

    var marginTemp = interpolate('-%(height)spx -%(width)spx');

    parent.regulateOverflow = function(){
        var surplus = this.getConfig('overflowSurplus'),
            factor = 2 * surplus + 1,
            $element = this.$element,
            $parent = $element.parent();

        var update = function(){
            var height = $parent.height(),
                width = $parent.width();

            $element
                .css('margin', marginTemp({height: height * surplus, width: width * surplus}))
                .width(width * factor)
                .height(height * factor);
        };
        
        update();
        setTimeout(update, 1000); //Android fix as early window sizes are incorrect

        bean.on(window, 'resize', update);

        return function(){
            bean.off(window, 'resize', update);
        };
    };

}(Hammerhead));