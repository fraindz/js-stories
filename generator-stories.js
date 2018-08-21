
const assert = require('assert');

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
    console.log('Generator "return" accessible when explicitly iterated');
    assert.deepEqual([...gen1()], [undefined, 'xxx', {a: 1}]);
    console.log('Generator "return" NOT accessible when auto nexting');
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
