const assert = require('assert');

const eq = assert.equal;

eq(typeof 42, "number");
console.log('typeof 42 is "number" and typeof "number" is string');
eq(typeof typeof 42, "string");
console.log('typeof null is object because of bug');
eq(typeof null, "object");
var a;
eq(typeof a, "undefined");
console.log('typeof undeclared variable is also undefined');
eq(typeof undeclared_var, "undefined");

(function() {
        if (false) {
            var undeclared_var = 1;
        }
    console.log('variable declared with var in a block that is never executed is hoisted and considered as declared')
    eq(undeclared_var, undefined);
})();

console.log('Can use typeof to define polyfills for feature that may or may not exist');
if (typeof polyfill === "undefined") {
    polyfill = function() {};
}
eq(typeof polyfill, "function");

a = [];
a[0] = 111;
a['foo'] = 222;
console.log('Array elements with string index do not affect length');
eq(a.length, 1);
a[2] = 222;
a[5] = 555;
console.log('Array can have empty-slots');
eq(a[1], undefined);
eq(a.length, 6);

console.log('Object wrappers used as constructor wrap object over primitive');
a = new Boolean(false);
eq(typeof a, 'object');
eq(a instanceof Boolean, true);
console.log('Boolean object wrapper even when initialized with false, does not return a false when accessed directly');
eq(a.toString(), "false");
eq(!a, false);
eq(a == false, true);
eq(a === false, false);
eq(a === Boolean(false), false);
eq(a.valueOf(), false);

console.log('Object wrappers used as function behave like normal primitive');
a = Boolean(false);
eq(typeof a, 'boolean');
eq(a instanceof Boolean, false);
console.log('Boolean object wrapper even when initialized with false, does not return a false when accessed directly');
eq(a.toString(), "false");
eq(!a, true);
eq(a == false, true);
eq(a === false, true);
eq(a === Boolean(false), true);
eq(a.valueOf(), false);

console.log('Array constructor function behaves differently based on number of arguments');
a = Array(3);
eq(a.length, 3);
eq(a[0], undefined);
a = Array(11,22);
eq(a.length, 2);
eq(a[0], 11);

console.log('Demonstrate primitive type - Symbols');
sym = Symbol("My Sym");
eq(sym.toString(), "Symbol(My Sym)");
eq(typeof sym, "symbol");
a = {};
a[sym] = 111;
eq(Object.getOwnPropertySymbols(a)[0].toString(), "Symbol(My Sym)");

console.log('Object subtypes prototype is the subtype itself');
eq(typeof Function.prototype, 'function');
eq(Array.isArray(Array.prototype), true);
