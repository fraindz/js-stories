const assert = require('assert');

const eq = assert.equal;

(function() {
    console.log('Default value will be assigned only when argument is not passed or passed as undefined');
    console.log('Argument passed as null is coerced to 0');
    function f1(a = 11, b = 22) {
        return (a+b);
    }
    eq(f1(), 33);
    eq(f1(null), 22);
    eq(f1(undefined,1), 12);
    eq(f1(2), 24);
    eq(f1(2, 2), 4);

    console.log('Functions as default argument is executed lazily. i.e. Not executed if argument is passed')
    function f2(p = f1(1, 1)) {
        return p;
    }
    eq(f2(), 2);
    eq(f2(4), 4);
})();

console.log('... operator can be used to spread array into individual values');
assert.deepEqual([1, ...[2, 3], 4], [1, 2, 3, 4]);

(function(...args) {
console.log('... can be used to gather individual values into an array');
assert.deepEqual(args, [1, 2, 3]);
})(1, 2, 3);

console.log('Array destructuring decomposes array into separate variables');
console.log('Indices that are not captured into variable are just ignored');
console.log('Array destructuring supports default value assignment');
{
    let [a, , c, d = 444] = [101, 2];
    eq(a, 101);
    eq(c, undefined);
    eq(d, 444);
}
{
console.log('Object destructuring decomposes object into separate variables when name matches object property');
console.log('Object destructuring can assign property to a variable of different name');
console.log('Object properties that are not captured during destructuring are just ignored');
console.log('Object destructuring supports default value assignment');
    let {a, b, c, a: AAA, MISSING = 111} = { a: 1, b: 2, x: 3};
    eq(a, 1);
    eq(b, 2);
    eq(c, undefined);
    eq(AAA, 1);
    eq(MISSING, 111);
console.log('Destructuring works with variables that are already declared');
    let o = {};
    ( { b: o.Y} = { a: 1, b: 2, x: 3});
    eq(o.Y, 2);
console.log('Destructuring allows usage of computed property');
    let prop = 'x';
    ( { b: o[prop] } = { a: 1, b: 2, x: 3});
    eq(o.x, 2);
}

console.log('Nested destructuring is supported for both array & object');
{
    let arr = ['a', ['b', 'c'], 'd'];
    let o1 = { o2: { x: 11, y: 22 }}
    let [a, [, c]] = arr;
    let { o2: { x } } = o1;
    eq(a, 'a');
    eq(c, 'c');
    assert.throws(() => { console.log(o2) }, ReferenceError);
    eq(x, 11);
}

console.log('Destructuring with default values in function parameters is supported for array & object');
{
    const f1 = ([a, b] = [5,6], ...d) => {
        return (`[${a}][${b}][${d}]`);
    }
    eq(f1([11], 3, 4),'[11][undefined][3,4]');
    eq(f1(), '[5][6][]');

   const f2 = ({ a = 10} = {}, { b } = { b: 20 }) => {
       return (`[${a}][${b}]`);
   }
   eq(f2({x: 11}, undefined), '[10][20]');
   eq(f2(undefined, {x: 11}), '[10][undefined]');
   eq(f2({a:11, x:12 }, {b:13}), '[11][13]');
}
