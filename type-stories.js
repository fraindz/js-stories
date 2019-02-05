const assert = require('assert');

const eq = assert.equal;

console.log('typeof 42 is "number" and typeof "number" is string');
eq(typeof 42, "number");
eq(typeof typeof 42, "string");

console.log('typeof null is "object" because of bug');
eq(typeof null, "object");

console.log('typeof undeclared or unassigned variable is also undefined');
var a;
eq(typeof a, "undefined");
eq(typeof undeclared_var, "undefined");

console.log('variable declared using var in unreachable block is hoisted and considered as declared but unassigned')
{
    if (false) {
        var undeclared_var = 1;
    }
    eq(undeclared_var, undefined);
}

console.log('Can use typeof to define polyfills for feature that may or may not exist');
if (typeof polyfill === "undefined") {
    polyfill = function() {};
}
eq(typeof polyfill, "function");

console.log('Array elements with string index do not affect length');
a = [];
a[0] = 111;
a['foo'] = 222;
eq(a.length, 1);

console.log('Array unused slots are considered as empty-slots');
a[2] = 222;
a[5] = 555;
eq(a[1], undefined);
eq(a.length, 6);

console.log('Object wrappers used as constructor wrap object over primitive');
a = new Boolean(false);
eq(typeof a, 'object');
eq(a instanceof Boolean, true);
eq(a.toString(), "false");
eq(a.valueOf(), false);

console.log('Boolean object wrapper initialized as false, does not return a false when accessed directly');
eq(!a, false); //Because a is an object that holds value "false"
eq(a === false, false);
eq(a == false, true);
eq(a === Boolean(false), false);

console.log('Object wrappers used without `new` behave as normal primitive');
a = Boolean(false);
eq(typeof a, 'boolean');
eq(a instanceof Boolean, false);

console.log('Array constructor function behaves differently based on number of arguments');
a = Array(3);
eq(a.length, 3);
eq(a[0], undefined);
a = Array(11,22);
eq(a.length, 2);
eq(a[0], 11);

console.log('Symbols - Demo');
sym = Symbol("My Sym");
eq(sym.toString(), "Symbol(My Sym)");
eq(typeof sym, "symbol");
a = {};
a[sym] = 111;
eq(Object.getOwnPropertySymbols(a)[0].toString(), "Symbol(My Sym)");

console.log('Prototype of object subtypes(Array and Function) is the subtype itself');
eq(typeof Function.prototype, 'function');
eq(Array.isArray(Array.prototype), true);

console.log('JSON stringify converts undefined, function, recursive prop access to null');
eq(JSON.stringify(42), "42");
eq(JSON.stringify("42"), "\"42\"");
eq(JSON.stringify([111, undefined, function() {}, 444]), "[111,null,null,444]");
eq(JSON.stringify({a: 101, b: function() {}}), "{\"a\":101}");

console.log('JSON stringify implicit coercion using toJSON');
o={};
o1={ a:11, b:22, c: o};
o.e=o1;
o1.toJSON = function() { return { newProp:111, b: this.b }; };
eq(JSON.stringify(o1), "{\"newProp\":111,\"b\":22}");

console.log('JSON stringify explicit coercion using replacer array');
eq(JSON.stringify(o1, ['b', 'newProp1']), "{\"b\":22}");

console.log('JSON stringify explicit coercion using toJSON gets precedence over replacer function');
eq(JSON.stringify(o1, function(k, v) { return k!=='b'? v:undefined }), '{"newProp":111}');

console.log('parseInt is tolerant while coercion is intolerant');
a = '131';
b = '131aa';
eq(Number(a), 131);
eq(parseInt(a), 131);
eq(Number.isNaN(Number(b)), true);
eq(parseInt(b), 131);

console.log('Implicit coercion examples of + operator');
eq("13"+"0", "130");
eq(13+0, 13);
eq(13+"13","1313");
eq([1,2]+[3,4],"1,23,4");
eq(2+true, 3);

console.log('string coercion using + depends on valueOf and using String() depends on toString');
a = {
    valueOf: () => 13,
    toString: () => 22
};
eq(a+"", 13);
eq(String(a), 22);

console.log('operators -,*,/ always coerce the operands to number');
eq(3-"1", 2);
eq("3"*1, 3);
eq("3"/"1",3);
eq([3]-[2],1);

console.log('Usage of !! - Implement onlyOneTrue function');
function onlyOneTrue() {
    var sum = 0;
    for(var i=0; i<arguments.length; i++) {
        sum += Number(!!arguments[i]);
    }
    return sum === 1;
}
eq(onlyOneTrue(33, 0, "", null, undefined), true);
eq(onlyOneTrue(33, "0"), false);
eq(onlyOneTrue({}, false), true);
eq(onlyOneTrue([], false), true);
eq(onlyOneTrue(0, false), false);

console.log('Operators || and && always return value of one of the two operands');
eq(11 || "abc", 11);
eq(11 && "abc", "abc");
eq(null || 11, 11);
eq(null && 11, null);

console.log('JS coercion gotchas');
eq("0"==false, true);
eq(0==false, true);
eq(""==false, true);
eq([]==false, true);
eq("0"!="", true);
eq("0"!=[], true);
eq(""==0, true);
eq(""==[], true);
eq(0==[], true);

o1 = { a:11 };
o2 = { a:22 };

eq(o1<o2, false);
eq(o1==o2, false);
eq(o1>o2, false);
eq(o1<=o2, true);
eq(o1>=o2, true);

console.log('Javascript ,(comma) operator executes all expressions and returns the last one');
eq((q=1, console.log(q), ++q), 2);

{
    console.log('Array created via constructor only sets length property, indices are not initialized');
    const cntr = 0;
    const arr = Array(100).map((_, i) => (cntr++, i));
    eq(arr[0], undefined);
    console.log('Array higher order functions(map, filter, forEach) only iterate through indices that are initialized');
    eq(cntr, 0);
}