
const assert = require('assert');
const regeneratorRuntime = require("regenerator-runtime");

const eq = assert.equal;

console.log('Generators "yield" & "return" demo');
(function() {
    x = 0;
    function* gen1() {
        x = 101;
        yield;
        x=55;
        yield 'xxx';
        x=222;
        yield {a: 1};
        return 111;
    }
    it = gen1();
    assert.deepEqual(it.next(), {value: undefined, done: false});
    eq(x, 101);
    assert.deepEqual(it.next(), {value: 'xxx', done: false});
    eq(x, 55);
    assert.deepEqual(it.next(), {value: {a: 1}, done: false});
    assert.deepEqual(it.next(), {value: 111, done: true});
    console.log('Generator "return" value is accessible when explicitly iterated');
    assert.deepEqual([...gen1()], [undefined, 'xxx', {a: 1}]);
    console.log('Generator "return" value NOT accessible when auto nexting');
})();

console.log('Generators yielding to Promise based async methods');
(function() {
    function getAsyncInc(x){
        return new Promise(res => setTimeout(() => res(x+1), 500));
    }
    function* gen1() {
        yield getAsyncInc(101);
        yield getAsyncInc(202);
        yield getAsyncInc(333);
    }
    it = gen1();
    it.next().value.then(res => eq(res, 102));
    it.next();
    it.next().value.then(res => eq(res, 334));
    console.log('New promise created on each call to iterator next()');
})();

console.log('Generator accepting values passed from iterators');
(function(){
    x = 0;
    y = 1;
    function* gen1() {
        x = yield 111;
        y = yield 222;
    }
    it = gen1();
    eq(it.next(101).value, 111);
    eq(x, 0);
    eq(it.next(202).value, 222);
    eq(x, 101);
    eq(y, 1);
    eq(it.next(303).value, undefined);
    eq(y, 202);
    console.log('Iterator resumes executing generator with completing assignment of previous yield');
});

console.log('Generator can generate infinite values');
(function(){
    x = 0;
    function* gen1() {
        while(true) {
            yield x;
            x = x + 10;
        }
    }
    it = gen1();
    eq(it.next().value, 0);
    eq(it.next().value, 10);
    eq(it.next().value, 20);
    eq(it.next().value, 30);
})();

console.log('Babel transpiled version of generator function');
(function () {
    var _marked = regeneratorRuntime.mark(gen1);

    x = 0;
    function gen1() {
        return regeneratorRuntime.wrap(function gen1$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(true && x < 111)) {
                            _context.next = 6;
                            break;
                        }

                        _context.next = 3;
                        return x;

                    case 3:
                        x = x + 10;
                        _context.next = 0;
                        break;

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _marked, this);
    }
    it = gen1();
    eq(it.next().value, 0);
    eq(it.next().value, 10);
    eq(it.next().value, 20);
    eq(it.next().value, 30);
})();

console.log('yield* delegates to first generator or iterable object');
function* func1() {
    yield 42;
    yield 45;
    return 'return from func1()';
}

function* f0() {
  return 'return from f0()';
}

function* func2() {
    yield* f0();
    yield* [101];
    yield* func1();
    yield 'from func2 yield';
    return 'return from func2()';
}

const iterator = func2();
eq(iterator.next().value, 101);
eq(iterator.next().value, 42);
eq(iterator.next().value, 45);
assert.deepEqual(iterator.next(), {value: 'from func2 yield', done: false});
assert.deepEqual(iterator.next(), {value: 'return from func2()', done: true});

console.log('Generate fibo series using recursion via yield*');
function *fibonacci(n, current = 0, next = 1) {
    if (n === 0) {
      return current;
    }
    yield current;
    yield *fibonacci(n-1, next, current + next);
}

assert.deepEqual([...fibonacci(5)], [0, 1, 1, 2, 3]);
