// Definitions
// Arrays have index, element
// Objects have key, value
// Colletions have location, item

// uses underscore namespace,
// provides duplicate functionality for underscore.

// functions return frozen objects

// JavaScript all things? function(executable method invokable), collection, primitive, void(null undef)
var _ = (function () {
  'use strict';

  var FROZEN = true;
  var BREAKER = {};

// basic iterators

  function eachArray(operation) {
  // iterates array left to right
  // assumes array type
    return function (array) {
      for (var i = 0; i < array.length; i++) {
        if (operation.call(this, array[i], i) === BREAKER) { return; }
      }
    };
  }

  function eachArrayRight(operation) {
  // iterates array right to left
  // assumes array type
    return function (array) {
      for (var i = array.length - 1; i > -1; i--) {
        if (operation.call(this, array[i], i) === BREAKER) { return; }
      }
    };
  }

  function eachObject(operation) {
  // iterates through object key/value pairs
  // no order assumed
    return function (object) {
      var context = this;
      eachArray(function (key) {
        return operation.call(context, object[key], key);
      })(Object.keys(object));
    };
  }

  function each(operation) {
  // iterates through object/array/arguments
  // iterates left to right when given array/arguments
    return function (collection) {
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        eachArray(operation).call(this, collection);
      } else {
        eachObject(operation).call(this, collection);
      }
    };
  }

// Basic collection operations

  function mapArray(operation) {
    return function (array) {
      var results = [];
      eachArray(function (element, index) {
        results.push(operation.call(this, element, index));
      }).call(this, array);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function mapObject(operation) {
    return function (object) {
      var results = {};
      eachObject(function (value, key) {
        results[key] = operation.call(this, value, key);
      }).call(this, object);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function map(operation) {
    return function (collection) {
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return mapArray(operation).call(this, collection);
      } else {
        return mapObject(operation).call(this, collection);
      }
    };
  }

  function filterArray(operation) {
    return function (array) {
      var results = [];
      eachArray(function (element, index) {
        if (operation.call(this, element, index)) { results.push(element); }
      }).call(this, array);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function filterObject(operation) {
    return function (object) {
      var results = {};
      eachObject(function (value, key) {
        if (operation.call(this, value, key)) { results[key] = value; }
      }).call(this, object);
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function filter(operation) {
    return function (collection) {
      if (arguments.length > 1) {
        collection = argsToList(arguments);
      }
      if (isArray(collection)) {
        return filterArray(operation).call(this, collection);
      } else {
        return filterObject(operation).call(this, collection);
      }
    };
  }

  function reduce(initial) {
    // The same code works here for arrays and objects so does not have varient.
    return function (operation) {
      return function () {
        var memo = initial;
        each(function (item, location) {
          memo = isDefined(memo) ? operation.call(this, memo).call(this, item, location) : item;
        }).apply(this, arguments);
        return memo;
      };
    };
  }

// Higher collection operations

  function find(predicate) {
    return function() {
      var result;
      each(function (item) {
        if (predicate.call(this, item)) {
          result = item;
          return BREAKER;
        }
      }).apply(this, arguments);
      return result;
    };
  }

  function all(operation) {
    operation = operation || I;
    return function () {
      var memo = true;
      each(function (item, location) {
        memo = operation.call(this, item, location);
        return memo ? undefined : BREAKER;
      }).apply(this, arguments);
      return memo;
    };
    // return location of first fail or length as location??
  }

  function any(operation) {
    operation = operation || I;
    return function () {
      var memo = false;
      each(function (item, location) {
        memo = operation.call(this, item, location);
        return memo ? BREAKER : undefined;
      }).apply(this, arguments);
      return memo;
    };
    // return location of first success or length as location??
  }

  function min(operation) {
    operation = operation || I;
    return function () {
      var memo;
      each(function (item) {
        memo = memo && (operation.call(this, memo) < operation.call(this, item)) ? memo : item;
      }).apply(this, arguments);
      return memo;
    };
  }

  function max(operation) {
    operation = operation || I;
    return function () {
      var memo;
      each(function (item) {
        memo = memo && (operation.call(this, memo) > operation.call(this, item)) ? memo : item;
      }).apply(this, arguments);
      return memo;
    };
  }

// Array

  function cleave(n) {
    return function (array) {
      n = n < 0 ? array.length + n : n;
      return [array.slice(0, n), array.slice(n)];
    };
  }

  function cyclic(n) {
    var results = [];
    times(n)(function () {
      results.push([]);
    });
    return function (collection) {
      eachArray(function (element, index) {
        results[index % n].push(element);
      })(collection);
      return results;
    };
  }

  function within(array) {
    if (arguments.length > 1) {
      array = argsToList(arguments);
    }
    return function (item) {
      return array.indexOf(item) !== -1;
    };
  }

// Object 

  function extend(extra) {
    // adds extra key vales to second passed object
    return function (object) {
      eachObject(function (value, key) {
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function augment(object) {
    return function (extra) {
      eachObject(function (value, key) {
        object[key] = value;
      })(extra);
      return object;
    };
  }

  function foundation(object) {
    // builds a new object from the properties of a foundation object and extention object.
    return function (extra) {
      var results = {};
      each(eachObject(function (value, key) {
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN ? Object.freeze(results) : results;
    };
  }

  function overlay(extra) {
    // builds a new object from the properties of a foundation object and extention object.
    return function (object) {
      var results = {};
      each(eachObject(function (value, key) {
        results[key] = value;
      }))(object || {}, extra || {});
      return FROZEN ? Object.freeze(results) : results;
    };
  }

// Function operations

  function adjoin(f) {
    return function (g) {
      return function () {
        return f.call(this, (g.apply(this, arguments)));
      };
    };
  }

  function invoke() {
    var args = arguments;
    return function (func) {
      return func.apply(this, args);
    };
  }

  function postpone(func) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
      return func.apply(this, args);
    };
  }

  function times(n) {
    return function (operation) {
      for (var i = 0; i < n; i++) {
        operation.call(this, i);
      }
    };
  }

  function debounce(wait) {
    return function (func) {
      var timeout, args;
      return function () {
        var context = this;
        args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      };
    };
  }

  function throttle(wait) {
    return function (func) {
      var timeout, args;
      return function () {
        args = arguments;
        var context = this;
        if (timeout) { return; }
        timeout = setTimeout(function () {
          timeout = null;
          func.apply(context, args);
        }, wait);
      };
    };
  }

  function not(func) {
    return function () {
      return !func.apply(this, arguments);
    };
  }

// Utilities

  function I(x) {
    return x;
  }

  function dot(key) {
    return function (obj) {
      if (isArray(key) || isObj(key)) {
        return map(invoke(obj))(map(dot)(key));
      }
      return obj[key];
    };
  }

  function method(key) {
    return function (obj) {
      return obj && obj[key] && obj[key]();
    };
  }

  var now = Date.now || function () { return new Date().getTime(); };

  function expose(nameList) {
    var fNames = nameList.split(' ');
    eachArray(function (fName) {
      window[fName] = _[fName];
    })(fNames);
  }

  function defreeze() {
    FROZEN = false;
  }

  function refreeze() {
    FROZEN = true;
  }

  function BREAK() {
    return BREAKER;
  }

  function size(collection) {
    return collection.length || Object.keys(collection).length;
  }

  function log() {
    console.log.apply(console, arguments);
  }

  function position(func) {
    return function (item, position) {
      return func(position);
    };
  }

  function equals(a) {
    return function (b) {
      return a === b;
    };
  }

  var compose = reduce()(adjoin);
  var rejectArray = compose(filterArray, not);
  var rejectObject = compose(filterObject, not);
  var reject = compose(filter, not);

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

    find: find,
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

    adjoin: adjoin,
    compose: compose,
    invoke: invoke,
    postpone: postpone,
    debounce: debounce,
    throttle: throttle,
    not: not,

    I: I,
    dot: dot,
    method: method,
    now: now,
    times: times,

    expose: expose,
    defreeze: defreeze,
    refreeze: refreeze,
    size: size,
    log: log,
    position: position,
    equals: equals,
    BREAK: BREAK
  };
  return _;
}());