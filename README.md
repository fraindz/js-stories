# js-stories
A collection of various java script stories(practical samples) that explain &amp; demonstrate core java script concepts.

[Type Stories](./type-stories.js)
1. typeof 42 is `number` and typeof `number` is string
2. typeof null is `object` because of bug
3. typeof undeclared or unassigned variable is also `undefined`
4. variable declared using var in unreachable block is hoisted and considered as declared but unassigned
5. Can use typeof to define polyfills for feature that may or may not exist
6. Array elements with string index do not affect length
7. Array unused slots are considered as empty-slots
8. Object wrappers used as constructor wrap object over primitive
9. Boolean object wrapper initialized as false, does not return a false when accessed directly
10. Object wrappers used without `new` behave as normal primitive
11. Array constructor function behaves differently based on number of arguments
12. Symbols - Demo
13. Prototype of object subtypes(Array and Function) is the subtype itself
14. JSON stringify converts undefined, function, recursive prop access to null
15. JSON stringify implicit coercion using toJSON
16. JSON stringify explicit coercion using replacer array
17. JSON stringify explicit coercion using toJSON gets precedence over replacer function
18. parseInt is tolerant while coercion is intolerant
19. Implicit coercion examples of + operator
20. string coercion using + depends on valueOf and using String() depends on toString
21. operators -,*,/ always coerce the operands to number
22. Usage of !! - Implement onlyOneTrue function
23. Operators || and && always return value of one of the two operands
24. JS coercion gotchas
25. Javascript ,(comma) operator executes all expressions and returns the last one

[Function Stories](./function-stories.js)
1. Constructor function v/s Normal function
2. IIFE - Immediately Invoked Function Expression. Function with params executed on declaration
3. Closure - Local function value accessible outside the function
4. Call array methods on objects using `apply`
5. Call built-in methods with variable args using `apply`
6. Create prototype chain using `apply`
7. Method overriding using `call`. Call parent method by passing context of child
8. Tagged template literals are special function calls invoked without parenthesis "("
9. Arrow fns assume this to be same as the value of this at original invocation place
10. Arrow fns lexically inherit this from surrounding scope
11. Demo - Difference in behaviour of arrow fn & regular fn
12. Syntactic alternative of arrow fns using self
13. Use static variables in javascript function to implement singleton pattern(without `static` or `class` keyword)

[Object Stories](./object-stories.js)
1. Create object using es6 classes
2. Class constructor cannot be invoked without `new`
3. Create object using Object.create
4. writable=false prop value cannot be changed
5. Properties of nested object can be modified even if writable is false
6. enumerable=false will make property not iterable though can read/write directly
7. configurable=false prop cant be deleted and only writable can be changed enumerable,configurable cant be changed
8. All object props can have getter & setter methods to get and set value
9. Constructor fn prototype is an object that will be _proto_ of all objects instantiated from that function
10. Prototype properties are not copied to instance but are delegated
11. New object assigned to prototype will only be reflected on instances created after that
12. New objects created after changing prototype will have same _proto_ as changed prototype
13. Prototype prop is added to all instances. Instance prop is specific to instance
14. Shadowing1: Data accessor prop found higher on prototype chain with writable:`true` will be added to main object
15. Shadowing2: Data accessor prop found higher on prototype chain with writable:`false` will be ignored(error in strict mode). NO Shadowing
16. Shadowing3: Prop is a setter higher on prototype chain. Always setter will be called. NO Shadowing
17. Shadowing4: Can force shadow property using defineProperty
18. Shadowing5: Implicit shadowing
19. Prototype chain created with functions adds prototype props with enumerable=true
20. Prototype chain created with class adds prototype props with enumerable=false
21. Parent - Child link(via Delegation) is created on prototype object AND NOT on actual object
22. Parent - Child link(via Class) is created on prototype object AND ALSO on actual object
23. super can be used in consice functions of plain objects
24. Prototype chain is more like __proto__.__proto__ than prototype.prototype

[this Stories](./this-stories.js)
1. Global object default binding is disabled in strict mode
2. Global variables bound to global object in non-strict mode
3. Implicit binding example
4. Implicit binding is lost when function is passed as parameter
5. Hard binding does not lose `this` context
6. Complete hard binding demo - Argument pass through and return value
7. Implement custom `bind` method using `apply`
8. Constructor with object as return value overwrites the new object
9. Explicit binding takes precedence over implicit binding
10. `new` binding takes precedence over implicit binding
11. Explicit binding takes precedence over `new` binding
12. Proper custom `bind` implementation
13. Custom bind implementation (hacky one)
14. Implement partially applied(curried) functions using custom bind
15. Custom "ES6bind" implementation
16. Function reference when evaluated loses the context
17. Cannot call an arrow function with `new`
18. Cannot return primitives from a function when called with `new`

[generator Stories](./generator-stories.js)
1. Iterate through array values manually using Symbol.iterator
2. Iterating through last value still returns done:false
3. next() returns done:true when trying to fetch again after last value is fetched
4. Symbol.iterator returns new instance of iterator each time
5. Calling next on exhausted iterator returns {value: undefined, done: true}
6. Custom iterator to infinitely loop through even numbers
7. Use `return` to notify producer that consumption is over
8. Demo - `yield` & `return`
9. `return` value is accessible when explicitly iterated
10. `return` value NOT accessible when auto nexting
11. Consumer can free generator midway if consumption is over
12. Demo - Generators yielding to Promise based async methods
13. Generator can accept values passed from iterators
14. Iterator resumes executing generator after completing assignment of previous yield
15. Generator can generate infinite values
16. Babel transpiled version of generator function
17. yield* delegates to first generator or iterable object
18. Generate fibo series using recursion via yield*