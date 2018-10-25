const assert = require('assert');

const eq = assert.equal;

const iife = (function playIIFE(param1, param2, param3) {
    const iifeLocalParam = param1 + ' ' + param2 + ' ' + param3;
    console.log('DEMO IIFE - Immediately Invoked Function Expression. Function executed on declaration with params :', [param1, param2, param3]);
    function getIIFELocal() {
        return iifeLocalParam;
    }
    return { getIIFELocal };
})('Param1', 2, true);

console.log('DEMO Closure - Local function value accessible outside the function');
assert.deepEqual(iife.getIIFELocal(), 'Param1 2 true');

(function playFunctionMethods() {
    //Apply
    console.log('Call array methods on objects using "apply"');
    const o = {0:'Zero', 1:'One', length:2};
    Array.prototype.push.call(o, 'Two');
    assert.deepEqual(o, {0:'Zero', 1:'One', 2:'Two', length:3});

    console.log('Call built-in methods with variable args using "apply"');
    const arr = [12, 2, 55, 89, 33];
    eq(Math.max.apply(null, arr), 89);

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
    console.log('Prototype chain created using "apply"');
    eq(Math.trunc(toy1.priceWithTax()),120);
    console.log('Call parent method by passing context of child using function method "call"');
    eq(Math.trunc(Product.prototype.priceWithTax.call(toy1)),110);
})();
