const assert = require('assert');

const eq = assert.equal;

console.log('(ns)If first mention of a variable is an LHS reference, it is added to global scope. For all other kind of first mentions, it has to be a declaration');
function print(o) {
    var _FUNC_SCOPE_VAR = 1;
    if(!o) {
        _GLOBAL_SCOPE_1 = o;
    } else {
        _GLOBAL_SCOPE_2 = o;
    }
}
assert.throws(() => { console.log(_FUNC_SCOPE_VAR) }, ReferenceError);
assert.throws(() => { console.log(_GLOBAL_SCOPE_1) }, ReferenceError);
assert.doesNotThrow(() => print(10), ReferenceError);
assert.doesNotThrow(() => console.log(++_GLOBAL_SCOPE_2), ReferenceError);
assert.throws(() => { console.log(_GLOBAL_SCOPE_1) }, ReferenceError);
assert.throws(() => { console.log(_FUNC_SCOPE_VAR) }, ReferenceError);
