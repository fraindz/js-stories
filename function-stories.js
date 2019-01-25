const assert = require('assert');

const eq = assert.equal;

{
    console.log('Constructor function v/s Normal function');
    function Car(model, color)
    {
        this.model = model;
        this.color = color;
    }

    const fnCar = Car("Hexa", "White");
    eq(fnCar, undefined);
    eq(global.color, "White");

    const objCar = new Car("Hexa", "White");
    objCar.year = 2010;
    eq(objCar.color, "White");
    eq(objCar['year'], 2010);
}

console.log('IIFE - Immediately Invoked Function Expression. Function with params executed on declaration');
const iife = (function playIIFE(param1, param2, param3) {
    const iifeLocalParam = param1 + ' ' + param2 + ' ' + param3;
    function getIIFELocal() {
        return iifeLocalParam;
    }
    return { getIIFELocal };
})('Param1', 2, true);

console.log('Closure - Local function value(i.e. iifeLocalParam) accessible outside the function');
assert.deepEqual(iife.getIIFELocal(), 'Param1 2 true');

{
    console.log('Call array methods on objects using `apply`');
    const o = {0:'Zero', 1:'One', length:2};
    Array.prototype.push.call(o, 'Two');
    assert.deepEqual(o, {0:'Zero', 1:'One', 2:'Two', length:3});

    console.log('Call built-in methods with variable args using `apply`');
    const arr = [12, 2, 55, 89, 33];
    eq(Math.max.apply(null, arr), 89);

    console.log('Create prototype chain using `apply`');
    function Product(name, price) {
        this.name = name;
        this.price = price;
        return this;
    }
    Product.prototype.priceWithTax = function () {
        return (this.price * 1.1);
    }

    function Toy(name, getPrice) {
        Product.apply(this, arguments);
        this.category = 'toy';
    }
    Toy.prototype = Object.create(Product.prototype);
    Toy.prototype.constructor = Toy;
    Toy.prototype.priceWithTax = function () {
        return (this.price * 1.2);
    }
    const toy1 = new Toy('robot', 100);
    eq(toy1.name, 'robot');
    eq(toy1.price, 100);
    eq(Math.trunc(toy1.priceWithTax()),120);

    console.log('Method overriding using `call`. Call parent method by passing context of child');
    eq(Math.trunc(Product.prototype.priceWithTax.call(toy1)),110);
};

console.log('Tagged template literals are special function calls invoked without parenthesis "("');
{
    const i = 12;
    function tagFn(strings, ...values) {
        return `[${strings}][${values}]`;
    }
    eq(tagFn `value is ${i} ...`, '[value is , ...][12]');
}

console.log('Arrow fns assume this to be same as the value of this at original invocation place');
console.log('Arrow fns lexically inherit this from surrounding scope');
(function (){
    this.a = 11;
    const o = {
        a: 22,
        f1() {
            return this.a;
        },
        f2: () => this.a,
        f3() {
            const innerFn = () => this.a;
            return innerFn();
        }
    }
    function testArrowThis() {
        this.a = 999;
        eq(o.f1(), 22);
        eq(o.f2(), 999);
        eq(o.f3(), 22);    
    }
    testArrowThis();
})();

{
    console.log('Demo - Difference in behaviour of arrow fn & regular fn');
        function foo1() {
            return () => this.a
        }
        function foo2() {
            function innerFn() {
                return this.a
            }
            return innerFn;
        }
        o1 = { a: 101 };
        o2 = { a: 202 };
        bar = foo1.call(o1);
        eq(bar.call(o2), 101);

        bar = foo2.call(o1);
        eq(bar.call(o2), 202);
}

{
console.log('Syntactic alternative of arrow fns using self');
    function foo() {
        self = this;
        boundFn = function () {
            return self.a;
        }
        return boundFn;
    }
    o1 = { a: 77 };
    o2 = { a: 88 };
    bar = foo.call(o1);
    eq(bar.call(o2), 77);
}
{
    console.log('Use static variables in javascript function to implement singleton pattern(without `static` or `class` keyword)');
    function getLogger() {
        if(!getLogger.logger) {
            getLogger.logger = {
                type: "console",
                log: console.log
            }
        }
        return getLogger.logger
    }
    eq(getLogger().type, "console");
}