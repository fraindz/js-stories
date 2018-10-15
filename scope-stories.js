const assert = require('assert');

const eq = assert.equal;

console.log('NON-STRICT - If first mention of a variable is an LHS reference, it is added to global scope. For all other kind of first mentions, it has to be a declaration');
function print(o) {
   sss = o;
   sss++;
}
assert.throws(() => { console.log(sss) }, ReferenceError);
assert.doesNotThrow(() => print(10), ReferenceError);
assert.doesNotThrow(() => sss++, ReferenceError);
assert.throws(() => { console.log(xxx) }, ReferenceError);
