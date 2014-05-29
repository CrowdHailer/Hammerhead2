cumin.js
=======
##### A library adding functional programming utilities to Javascript

[ ![Codeship Status for CrowdHailer/cuminjs](https://www.codeship.io/projects/066c6740-c0ac-0131-b9f7-220fd2f34c97/status?branch=master)](https://www.codeship.io/projects/21479)
[![Code Climate](https://codeclimate.com/github/CrowdHailer/cuminjs.png)](https://codeclimate.com/github/CrowdHailer/cuminjs)
[![Code Climate](https://codeclimate.com/github/CrowdHailer/cuminjs/coverage.png)](https://codeclimate.com/github/CrowdHailer/cuminjs)

Cumin.js adds key utilities for functional programming, such as map, reduce and compose. Key points are.

 1. All utilities are added to the `_` object.
 2. Type checkers such as `isDefined` are added to global namespace.
 3. All utilities are curried functions and will only take a single argument at a time.
 4. Data always comes last, to maximise power of partially filled operations.
 5. New Arrays and Objects are returned frozen by default. (this option can be overrun for the entire library with `defreeze()` & `refreeze`)
 6. Does not carry any concept of context

### List of functions
##### Main

- eachArray
- eachArrayRight
- eachObject
- each
- mapArray
- mapObject
- map
- filterArray
- filterObject
- filter
- rejectArray
- rejectObject
- reject
- reduce
- all
- any
- min
- max
- cleave
- cyclic
- foundation
- extend
- compose
- debounce
- throttle
- not
- Identity (I)
- dot
- times
- random

##### Special
- expose
- defreeze
- refreeze

##### Development
- and
- pluck
- weed
- limit

### Collections
**eachArray** `_.eachArray(operation)(array)`

Iterates over an array of elements, with increasing index, from index 0 to length-1. The operation is called for each element with two arguments `(element, index)`

**eachArrayRight** `_.eachArrayRight(operation)(array)`

Iterates over an array of elements, with decreasing index, from index length-1 to 0. The operation is called for each element with two arguments `(element, index)` *This is the reverse operation to eachArray*

**eachObj** `_.eachObject(operation)(object)`

Iterates through all key value pairs on an object. The operation is called for each pair with two arguments `(value, key)`

**each** `_.each(operation)(object)`

Iterates through a collection (array, object, arguments). No order is guarenteed. The operations is called for each item with two arguments `(item, location)`

**mapArray** `_.mapArray(operation)(array)`

Maps each element in an array to an element in new array. New values are the return of operation. Operation is called each time with arguments `(element, index)`. By default the return array is frozen.

**mapObject** `_.mapObject(operation)(object)`

Maps each value in an object to the same key in a new object. New values are the return of operation. Operation is called each time with arguments `(value, key)`. By default the return object is frozen.

**map** `_.map(operation)(collection)`

Maps items in a collection (array, object, arguments) to a new collection. The returned collection is frozen by default. If given an object map will return an object. If given an array or multiple arguments map will return an array.

> **Note on maps**
> 
> Map may not behave as expected if using cumin.js after other libraries, notably underscore.js. See examples.
> 
> ```js
> function plus1 (number) {
  > return number + 1;
> }
> 
> // cumin.js
> var incrementItems = map(plus1)
> 
> incrementItems([1, 2])
> => [2, 3]
> 
> incrementItems({a: 1, b: 2})
> => {a: 2, b: 3}
> 
> incrementItems(1, 2)
> => [2, 3]
> 
> // underscore.js
> _.map([1, 2], plus1)
> => [2, 3]
> 
> _.map({a: 1, b: 2}, plus1)
> => [2, 3]
> ```

**filterArray** `_.filterArray(operation)(array)`

Adds each element to a new array on condition operation returns true. Operation is called each time with arguments `(element, index)`. By default the return array is frozen.

**filterObject** `_.filterObject(operation)(object)`

Adds each value to a new object on condition operation returns true. Operation is called each time with arguments `(value, key)`. By default the return object is frozen.

**filter** `_.filter(operation)(collection)`

Adds each item to a new collection on condition operation returns true. The returned collection is frozen by default. If given an object map will return an object. If given an array or multiple arguments map will return an array.

**rejectArray, rejectObject, reject**

Same behaviour as filter functions except adds items when condition returns false.

**reduce** `_.reduce(initial)(operation)(collection)`

Compacts a collection to a single return value. For each item operation is first called with the current value (initial for first item). It is then called with the item and location and the return value set as the new current value for next iteration. Operation is called each time with arguments `(memo)(item, location)`. Also known as inject and foldl.

> **Note on reduce**

> 1) If no initial is given then the first item from the collection will be used.
> 
> 2) Functions that are passed as the operation are expected to > take arguments singly. e.g.
> 
> ```js
> add(3)(4)  // Vaild
> add(3, 4)  // Invalid
> ```
> 
> functions for multiple arguments can then be constructed from > reduce as the passed collection may be the arguments object.
> 
> ```js
> sum = reduce(0)(add);
> sum(1, 2, 3, 4,)
> => 10
> ```

**all** `_.all(predicate)(collection)`

Returns true if all items in a collection pass the predicate truth test. Predicate is called for each item with arguments `(item, location)`

**any** `_.any(predicate)(collection)`

Returns true if any items in a collection pass the predicate truth test. Predicate is called for each item with arguments `(item, location)`

**min** `_.min(operation)(collection)`

Each item in the collection is valued by its return from operation and the lowest value item is returned. Operation is called for each item with arguments `(item, location)`. If no operation is passed then the values of the collection are used.

**max** `_.max(operation)(collection)`

Each item in the collection is valued by its return from operation and the highest value item is returned. Operation is called for each item with arguments `(item, location)`. If no operation is passed then the values of the collection are used.

### Arrays

**cleave** `_.cleave(division)(array)`

Splits an array to two arrays. It returns and array containing first an array of all elements before the division and second an array containing all elements after the division.

**cyclic** `_.cyclic(rotations)(array)`

Returns an array containing rotation numbers of arrays. elements from the original array are added to each of these arrays in turn.

### Objects

**foundation** `_.foundation(defaults)(extensions)`

Creates a new object with all key value pairs of both defaults and extension object. In case of clash extension keys overwrite default keys. Will treat no arguments passed as empty object passed. 

**extend** `_.foundation(initial)(extensions)`

All key value pairs from extensions object are added to the initial object. NOTE this is not a clone and the initial object is modified. ALSO returned object is not frozen. This is used for creating complex objects in multiple steps to be frozen/passed as necessary. 

### Functions

**compose** `_.compose(funcA, funcB)`

Compose returns the combined function of all passed in functions. The return value of each function is passed to the left function. `compose(f, g)(x) == f(g(x))`

**debounce** `_.debounce(wait)(operation)`

Returns a new function that only calls the passed function *wait* milliseconds after the last call.

**throttle** `_.throttle(wait)(operation)`

Returns a new throttled copy of the passed function. When invoked repeatedly it will only call the original function at most once per every *wait* milliseconds.

**times** `_.times(n)(operations)`

Calls the passed operation *n* times. Operation is called each time with a single argument of the current index `(index)`, running from 0 to n-1,

- not
- Identity (I)
- dot
- random

### Notes
##### Curried function

*Exception* functions such as map, reduce, filter pass index/key as second argument with element/value

##### Typecheck functions
These are added to the top namespace and include the following:-
- argsToList
- isArray
- isObj

##### Expose
All functions are kept on the underscore '_' namespace. The expose function takes a space separated string listing functions to add to top level. e.g.

```js
_.map() // valid
map() // invalid

_.expose('map dot')
map() // valid
dot() // valid
```

### Future possibilities
Needs clarification on context;  
include breaker;  
optional checking of input type to skip null steps in all, min etc.  
delayed return of function. useful in composition eg for nth item.  
min and max return location  
zip  
mixin particularly compositions


### Inspired by
- [underscore.js](http://underscorejs.org/)
- [score under](https://github.com/loop-recur/scoreunder)
- [typclasses](https://github.com/loop-recur/typeclasses)
- [preludejs](https://github.com/loop-recur/PreludeJS)
- [lambdajs](https://github.com/loop-recur/lambdajs)

