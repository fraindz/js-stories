const assert = require('assert');

const eq = assert.equal;

function foo() {
    return this.a;
}

a = 2;
console.log('Default binding');
(function() {
    "use strict";
    try {
        console.log(this.a);
    } catch(Error) {
        console.log("Global object default binding disabled in strict mode")
    }
    eq(foo(), 2);
    console.log("Global variables bound to global object in non-strict mode")
})();

console.log('Implicit binding...');
var o2 = {
    a: 42,
    foo: foo
};

var o1 = {
    a: 2,
    o2: o2
};

eq(o1.o2.foo(), 42);

function doFoo(fn) {
    return fn()+1;
}

const implicitObj = {
    a: 200,
    foo: foo
}
a = 100;
eq(doFoo(implicitObj.foo), 101);
console.log('Implicit binding lost...');

const hardBindObj = {
    a: 200
};
a = 100;

bar = function() {
    return foo.call(hardBindObj);
}
eq(bar(), 200);
eq(bar.call(global), 200);
console.log('Hard binding does not lose "this" context');

function completeBindFoo() {
    return this.a + arguments[0];
}

bar = function() {
    return completeBindFoo.apply(hardBindObj, arguments);
}
eq(bar(22), 222);
console.log('Complete hard binding demo - Argument pass through and return value');

function bind(fn, o) {
    return function () {
        return fn.apply(o, arguments);
    }
}
bar = bind(completeBindFoo, hardBindObj);
eq(bar(33), 233);
console.log('Implement custom "Bind" method');

function contextBasedFoo(el) {
    this.a = this.a + el;
}
a=100;
o = {
    a: 1
};

[5].forEach(contextBasedFoo, o);
eq(o.a, 6);

console.log('Constructor with object as return value overwrites the new object');
function constructorFn(arg1){
    this.a = arg1;
    return {a: 555};
}
bar = new constructorFn(333);
assert.deepEqual(bar, {a: 555});

console.log('Precedence in binding methods...');
(function () {
    function foo(arg1) {
        this.a = arg1 || this.a;
        return this.a;
    }
    o1 = {
        a: 111,
        foo: foo
    };
    o2 = {
        a: 222,
        foo: foo
    };
    eq(o1.foo(), 111);
    eq(o2.foo(), 222);
    eq(o1.foo.call(o2), 222);
    eq(o2.foo.call(o1), 111);
    console.log('Explicit binding takes precedence over implicit binding');

    o1.foo(999);
    eq(o1.a, 999);
    bar = new o1.foo(555);
    eq(o1.a, 999);
    eq(bar.a, 555);
    console.log('New binding takes precedence over implicit binding');

    bar = foo.bind(o1);
    bar(202);
    eq(o1.a, 202);
    tin = new bar(303);
    eq(o1.a, 202);
    eq(tin.a, 303);
    console.log('Explicit binding takes precedence over "New" binding');
})();

console.log('Custom "bind" implementation');
(function() {
    function foo(arg1) {
        this.a = arg1;
    }
    Function.prototype.customBind = function (oThis) {
        if(typeof this === "function") {
            args = Array.prototype.slice.call(arguments, 1);
            fProto = function() {};
            fToBind = this;
            fBound = function () {
                return fToBind.apply(
                    this instanceof fProto && oThis ? this : oThis,
                    args.concat(
                        Array.prototype.slice.call(arguments)
                    )
                );
            }
            fProto.prototype = this.prototype;
            fBound.prototype = new fProto();
            return fBound;
        }
    }
    o = {
    };
    bar = foo.customBind(o);
    bar(1);
    eq(o.a, 1);
    baz = new bar(2);
    eq(o.a, 1);
    eq(baz.a, 2);
})();

console.log('Custom bind implementation (hacky one)');
function bind(fn, context) {
    return function(...args) {
        const key = 'some_secret_key';
        Object.defineProperty(context, key, {
        configurable: true,
        enumerable: false,
        value: fn
        });
        const result = context[key](...args);

        delete context[key];

        return result;
    };
}
function multiply(x, y) {
    return x * y;
}

const multiplyBy2 = multiply.bind(null, 2);
const multiplyBy5 = multiply.bind(null, 5);
eq(multiplyBy2(3), 6);
console.log('Custom bind demos partially applied(curried) functions');

console.log('Custom "ES6bind" implementation');
(function() {
    function foo(arg1) {
        this.a = arg1;
    }
    Function.prototype.customES6Bind = function (oThis) {
        fToBind = this;
        args = Array.prototype.slice.call(arguments, 1);
        fBound = function () {
            return fToBind.apply(
                (!this || this === (global)) ? oThis : this,
                args.concat(
                    Array.prototype.slice.call(arguments)
                )
            );
        }
        fBound.prototype = Object.create(fToBind.prototype);
        return fBound;
    }
    o = {
        a:202
    };
    bar = foo.customES6Bind(o);
    bar(1);
    eq(o.a, 1);
    baz = new bar(2);
    eq(o.a, 1);
    eq(baz.a, 2);
})();

(function () {
    a = 404;
    var o2 = {
        a: 200,
        foo: function () {
            this.a = this.a + 1;
            return this.a;
        }
    };
    eq((o2.foo || {})(), 405);
    eq((1, o2.foo)(), 406);

    var fooCall = o2.foo;
    eq(fooCall(), 407);

    new Promise(() => setTimeout(o2.foo, 111))
    .then(() => eq(a, 408));
    console.log('Function reference when evaluated loses the context');
})();

console.log('You cant call an arrow function with new');
{
    let f1 = () => {
    }
    assert.throws(() => new f1(), TypeError);
}
console.log('You cant return primitives from a function when called with new');
{
    function f1() {
        return "x";
    }
    let o = new f1();
    assert.deepEqual( o, {});

    function f2() {
        return { a: 11 }
    }
    o = new f2();
    assert.deepEqual(o, { a: 11 });
}
