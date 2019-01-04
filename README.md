# js-stories
A collection of various java script stories(practical samples) that explain &amp; demonstrate core java script concepts.

[Object Stories](./object-stories.js)
1. Create object using es6 classes
2. Class constructor cannot be invoked without `new`
3. Create object using Object.create
4. writable=false prop value cannot be changed
5. Properties of nested object can be modified even if writable is false
6. enumerable=false will make property not iterable though can read/write directly
7. configurable=false prop cant be deleted and only writable can be changed enumerable,configurable cant be changed
8. All object props can have getter & setter methods to get and set value
9. Constructor fn prototype is an object that will be _proto_ of all objects instantiated from that function
10. Prototype properties are not copied to instance but are delegated
11. New object assigned to prototype will only be reflected on instances created after that
12. New objects created after changing prototype will have same _proto_ as changed prototype
13. Prototype prop is added to all instances. Instance prop is specific to instance
14. Shadowing1: Data accessor prop found higher on prototype chain with writable:`true` will be added to main object
15. Shadowing2: Data accessor prop found higher on prototype chain with writable:`false` will be ignored(error in strict mode). NO Shadowing
16. Shadowing3: Prop is a setter higher on prototype chain. Always setter will be called. NO Shadowing
17. Shadowing4: Can force shadow property using defineProperty
18. Shadowing5: Implicit shadowing
19. Prototype chain created with functions adds prototype props with enumerable=true
20. Prototype chain created with class adds prototype props with enumerable=false
21. Parent - Child link(via Delegation) is created on prototype object AND NOT on actual object
22. Parent - Child link(via Class) is created on prototype object AND ALSO on actual object
23. super can be used in consice functions of plain objects
24. Prototype chain is more like __proto__.__proto__ than prototype.prototype

[Function Stories](./function-stories.js)