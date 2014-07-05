(function(_){
  'use strict';

  function round (dp){
    dp = dp || 0;
    var factor = Math.pow(10, dp);
    var bump = Math.pow(0.1, dp + 1); // needed for case 2 d.p on 1.005
    return function(num){
      return Math.round(num * factor + bump) / factor;
    };
  }

  function random(max){
    max = max || 0;
    return function(){
      return Math.random()*max|0;
    };
  }

  _.round = round;
  _.random = random;
}(_));