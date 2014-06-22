var argsToList = function(x){
  return Array.prototype.slice.call(x);
};

var isArray = function(obj) {
  return (obj && obj.constructor === Array);
};

var isObj = function(obj) {
  return (typeof obj === "object" && !isArray(obj));
};

var isDefined = function(obj) {
  return (obj !== undefined);
};
// Definitions
// Arrays have index, element
// Objects have key, value
// Colletions have location, item

// uses underscore namespace,
// provides duplicate functionality for underscore.

// functions return frozen objects

// JavaScript all things? function(executable method invokable), collection, primitive, void(null undef)
var _ = (function(){

  var FROZEN = true;

// basic iterators

  function eachArray(operation){
  // iterates array left to right
  // assumes array type
    return function(array){
      for (var i = 0; i < array.length; i++) {
        operation(array[i], i);
      }
    };
  }

  function eachArrayRight(operation){
  // iterates array right to left
  // assumes array type
    return function(array){
      for (var i = array.length - 1; i > -1; i--) {
        operation(array[i], i);
      }
    };
  }

  function eachObject(operation){
  // iterates through object key/value pairs
  // no order assumed
    return function(object){
      eachArray(function(key){
        operation(object[key], key);
      })(Object.keys(object));
    };
  }

  function each(operation){
  // iterates through object/array/arguments
  // iterates left to right when given array/arguments
    return function(collection){
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        eachArray(operation)(collection);
      } else {
        eachObject(operation)(collection);
      }
    };
  }

// Basic collection operations

  function mapArray(operation){
    return function(array){
      var results = [];
      eachArray(function(element, index){
        results.push(operation(element, index));
      })(array);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  function mapObject(operation){
    return function(object){
      var results = {};
      eachObject(function(value, key){
        results[key] = operation(value, key);
      })(object);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  function map(operation){
    return function(collection){
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return mapArray(operation)(collection);
      } else {
        return mapObject(operation)(collection);
      }
    };
  }

  function filterArray(operation){
    return function(array){
      var results = [];
      eachArray(function(element, index){
        if (operation(element, index)) { results.push(element); }
      })(array);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  var rejectArray = compose(filterArray, not);

  function filterObject(operation){
    return function(object){
      var results = {};
      eachObject(function(value, key){
        if (operation(value, key)) { results[key] = value;}
      })(object);
      return FROZEN? Object.freeze(results) : results;
    };
  }

  var rejectObject = compose(filterObject, not);

  function filter(operation){
    return function(collection){
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return filterArray(operation)(collection);
      } else {
        return filterObject(operation)(collection);
      }
    };
  }

  var reject = compose(filter, not);

  function reduce(initial){
    // The same code works here for arrays and objects so does not have varient.
    return function(operation){
      return function(){
        var memo = initial;
        each(function(item, location){
          memo = isDefined(memo) ? operation(memo)(item, location) : item;
        }).apply({}, arguments);
        return memo;
      };
    };
  }

// Higher collection operations

  function all(operation){
    operation = operation || I;
    return function(){
      var memo = true;
      each(function(item, location){
        memo = memo && operation(item, location);
      }).apply({}, arguments);
      return memo;
    };
    // return location of first fail or length as location??
  }

  function any(operation){
    operation = operation || I;
    return function(){
      var memo = false;
      each(function(item, location){
        memo = memo || operation(item, location);
      }).apply({}, arguments);
      return memo;
    };
    // return location of first success or length as location??
  }

  function min(operation){
    operation = operation || I;
    return function(){
      var memo;
      each(function(item){
        memo = memo && (operation(memo) < operation(item)) ? memo : item;
      }).apply({}, arguments);
      return memo;
    };
  }

  function max(operation){
    operation = operation || I;
    return function(){
      var memo;
      each(function(item){
        memo = memo && (operation(memo) > operation(item)) ? memo : item;
      }).apply({}, arguments);
      return memo;
    };
  }

// Array

  function cleave(n){
    return function(array){
      n = n < 0 ? array.length + n : n ;
      return [array.slice(0, n), array.slice(n)];
    };
  }

  function cyclic(n){
    var results = [];
    times(n)(function(){
      results.push([]);
    });
    return function(collection){
      eachArray(function(element, index){
        results[index % n].push(element);
      })(collection);
      return results;
    };
  }

  function within(array){
    return function(item){
      return array.indexOf(item) != -1;
    };
  }

// Object 

  function extend(extra){
    // adds extra key vales to second passed object
    return function(object){
      eachObject(function(value, key){
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function augment(object){
    return function(extra){
      eachObject(function(value, key){
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function foundation(object){
    // builds a new object from the properties of a foundation object and extention object.
    return function(extra){
      results = {};
      each(eachObject(function(value, key){
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN? Object.freeze(results) : results;
    };
  }

  function overlay(extra){
    // builds a new object from the properties of a foundation object and extention object.
    return function(object){
      results = {};
      each(eachObject(function(value, key){
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN? Object.freeze(results) : results;
    };
  }  

// Function operations

  function compose(){
    var funcs = arguments;
    return function(){
      var args = arguments;
      eachArrayRight(function(func){
        args = [func.apply(this, args)];
      })(funcs);
      return args[0];
    };
  }

  function invoke(){
    var args = arguments;
    return function(func){
      return func.apply({}, args);
    };
  }

  function debounce(wait){
    return function(func){
      var timeout, args;
      return function(){
        args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          func.apply({}, args);
        }, wait);
      };
    };
  }

  function throttle(wait){
    return function(func){
      var timeout, args;
      return function(){
        args = arguments;
        if (timeout) { return; }
        timeout = setTimeout(function(){
          timeout = null;
          func.apply({}, args);
        }, wait);
      };
    };
  }

  function times(n){
    return function(operation){
      for (var i = 0; i < n; i++){
        operation(i);
      }
    };
  }

  function not(func){
    return function(){
      return !func.apply({}, arguments);
    };
  }

// Utilities

  function I(x){
    return x;
  }

  function dot(key){
    return function(obj){
      if (isArray(key) || isObj(key)) {
        return map(invoke(obj))(map(dot)(key));
      }
      return obj[key];
    };
  }

  var now = Date.now || function() { return new Date().getTime(); };

  function random(max){
    return function(){
      return Math.random()*max|0;
    };
  }

  function expose(nameList){
    var fNames = nameList.split(' ');
    eachArray(function(fName){
      window[fName] = _[fName];
    })(fNames);
  }

  function defreeze(){
    FROZEN = false;
  }

  function refreeze(){
    FROZEN = true;
  }

  function size(collection){
    return collection.length || Object.keys(collection).length;
  }

  function log(){
    console.log.apply(console, arguments);
  }

  function equals(a){
    return function(b){
      return a === b;
    };
  }
  var _ =  {
    eachArray: eachArray,
    eachArrayRight: eachArrayRight,
    eachObject: eachObject,
    each: each,

    mapArray: mapArray,
    mapObject: mapObject,
    map: map,

    filterArray: filterArray,
    rejectArray: rejectArray,
    filterObject: filterObject,
    rejectObject: rejectObject,
    filter: filter,
    reject: reject,
    reduce: reduce,

    all: all, //poss every 
    any: any, //poss sum use any as anything eg first from obj or and shift to obj
    min: min, 
    max: max,

    cyclic: cyclic,
    cleave: cleave,
    within: within,

    extend: extend,
    augment: augment,
    foundation: foundation,
    overlay: overlay,

    compose: compose,
    invoke: invoke,
    debounce: debounce,
    throttle: throttle,
    not: not,

    I: I,
    dot: dot,
    now: now,
    times: times,
    random: random,

    expose: expose,
    defreeze: defreeze,
    refreeze: refreeze,
    size: size,
    log: log,
    equals: equals,
  };
  return _;
}());