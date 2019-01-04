const assert = require('assert');

const eq = assert.equal;

{
    console.log('Create object using es6 classes');
    class Car {
        constructor(model, color) {
            this.model = model;
            this.color = color;
        }
    }
    const objCar = new Car("Hexa", "White");
    objCar.year = 2010;
    eq(objCar.color, "White");
    eq(objCar['year'], 2010);

    console.log('Class constructor cannot be invoked without `new`');
    try {
      const fnCar = Car("Hexa", "White");
    } catch(e) {
        console.log('TypeError');
    }
}

{
    console.log('Create object using Object.create');
    const car = Object.create(Object.prototype,
    {
        model: {
            value: "Hexa",
            enumerable: true,
            writable: true,
            configurable: true
        },
        color: {
            value: "White",
            enumerable: true,
            writable: true,
            configurable: true
        }
    });
    car.year = 2010;
    eq(car.color, "White");
    eq(car['year'], 2010);
}

{
    console.log('writable=false prop value cannot be changed');
    const car = {
        color: 'White',
        year: 2010
    }
    Object.defineProperty(car, 'year', { writable: false });
    car.year=2013; //Gives error in strict mode
    eq(car.year, 2010);

    console.log('Properties of nested object can be modified even if writable is false');
    car.model = { name: 'Hexa', class: 'VX' }
    Object.defineProperty(car, 'model', { writable: false });
    car.model.class = 'ZX';
    eq(car.model.class, 'ZX');

    console.log('enumerable=false will make property not iterable though can read/write directly');
    Object.defineProperty(car.model, 'class', { enumerable: false });
    eq(Object.keys(car.model).indexOf('name'), 0);
    eq(Object.keys(car.model).indexOf('class'), -1);
    car.model.class = 'AX';
    eq(car.model.class, 'AX');

    console.log('configurable=false prop cant be deleted and only writable can be changed enumerable,configurable cant be changed')
    Object.defineProperty(car, 'color', { configurable: false });
    car.color = 'Black'
    Object.defineProperty(car, 'color', { writable: false });
    delete car.color;
    assert.deepEqual(Object.getOwnPropertyDescriptor(car, 'color'), { value: 'Black', configurable: false, enumerable: true, writable: false});
}

{
    console.log('All object props can have getter & setter methods to get and set value');
    const car = { model: {name: 'Hexa', class: 'VX'}, color: 'White' };
    Object.defineProperty(car, 'desc',
        {
            set: function(value) {
                const valueParts = value.split(' ');
                this.model.name = valueParts[0];
                this.model.class = valueParts[1];
                this.color = valueParts[2];
            },
            get: function() {
                return this.model.name + ' ' + this.model.class + ' ' + this.color
            }            
        });
    car.desc = 'Brezza BX Red'
    eq(car.desc, 'Brezza BX Red');
}

{
    console.log('Constructor fn prototype is an object that will be _proto_ of all objects instantiated from that function');
    function Car(model, color) {
        this.model = model;
        this.color = color;
    }
    Object.defineProperty(Car.prototype, 'type', {
        set: function(v) {
            this.carType = v;
        },
        get: function() {
            return this.carType
        }
    });
    const car1 = new Car('Hexa', 'White');
    eq(Car.prototype === car1.__proto__, true);

    console.log('Prototype properties are not copied to instance but are delegated');
    Car.prototype.seatCapacity = 4;
    eq(Car.prototype.seatCapacity, 4);
    eq(car1.__proto__.seatCapacity, 4);
    eq(car1.seatCapacity, 4);
    eq(car1.hasOwnProperty('seatCapacity'), false);

    console.log('New object assigned to prototype will only be reflected on instances created after that');
    console.log('New objects created after changing prototype will have same _proto_ as changed prototype');
    Car.prototype = { seatCapacity: 2 };
    car4 = new Car('Camry', 'Blue');
    eq(Car.prototype === car1.__proto__, false);
    eq(car1.seatCapacity, 4);
    eq(Car.prototype === car4.__proto__, true);
    eq(car4.seatCapacity, 2);

    console.log('Prototype prop is added to all instances. Instance prop is specific to instance');
    console.log('Shadowing1: Data accessor prop found higher on prototype chain with writable:`true` will be added to main object');
    const car2 = new Car('Innova', 'Red');
    eq(car2.hasOwnProperty('seatCapacity'), false);
    car2.seatCapacity = 6
    eq(car1.seatCapacity, 4);
    eq(car2.seatCapacity, 6);
    eq(car1.hasOwnProperty('seatCapacity'), false);
    eq(car2.hasOwnProperty('seatCapacity'), true);

    console.log('Shadowing2: Data accessor prop found higher on prototype chain with writable:`false` will be ignored(error in strict mode). NO Shadowing');
    Object.defineProperty(Car.prototype, 'seatCapacity', { writable: false });
    c = new Car('Nano', 'Black');
    eq(c.hasOwnProperty('seatCapacity'), false);
    c.seatCapacity = 8;
    eq(c.seatCapacity, 2);
    eq(c.hasOwnProperty('seatCapacity'), false);

    console.log('Shadowing3: Prop is a setter higher on prototype chain. Always setter will be called. NO Shadowing');
    eq(car1.hasOwnProperty('type'), false);
    eq('type' in car1, true);
    car1.type = 'sedan';
    eq(car1.hasOwnProperty('type'), false);
    eq(car1.type, 'sedan');

    console.log('Shadowing4: Can force shadow property using defineProperty');
    const car3 = new Car('Brezza', 'Blue');
    eq(car3.hasOwnProperty('seatCapacity'), false);
    eq(car3.hasOwnProperty('type'), false);
    Object.defineProperty(car3, 'seatCapacity', {
        value: 8
    });
    Object.defineProperty(car3, 'type', {
        value: 'Sedan'
    });
    eq(car3.seatCapacity, 8);
    eq(car3.type, 'Sedan');
    eq(car3.hasOwnProperty('seatCapacity'), true);
    eq(car3.hasOwnProperty('type'), true);

    console.log('Shadowing5: Implicit shadowing')
    Car.prototype.tyre = 4;
    c = new Car('Nano', 'Red');
    eq(c.hasOwnProperty('tyre'), false);
    eq(c.tyre, 4);
    c.tyre++;
    eq(c.hasOwnProperty('tyre'), true);
    eq(c.tyre, 5);
}

{
    console.log('Prototype chain created with functions adds prototype props with enumerable=true');
    function Vehicle(speed) {
        this.speed = speed || 0;
    }
    Vehicle.prototype.start = function() {
        console.log(this.speed);
    }
    eq(Object.getOwnPropertyDescriptor(Vehicle.prototype,'start').enumerable, true);
}

{
    console.log('Prototype chain created with class adds prototype props with enumerable=false');
    class Vehicle {
        constructor(speed) {
            this.speed = speed || 0;
        }
        start () {
            console.log(this.speed);
        }
    }
    eq(Object.getOwnPropertyDescriptor(Vehicle.prototype,'start').enumerable, false);
}

{
    console.log('Parent - Child link(via Delegation) is created on prototype object AND NOT on actual object');
    function Parent() {}
    function Child() {}
    Child.prototype = Object.create(Parent.prototype);

    eq(Parent.isPrototypeOf(Child), false);

    eq(Parent.prototype.isPrototypeOf(Child.prototype), true);
    eq(Child instanceof Parent, false);
    eq(Child.prototype instanceof Parent, true);

    a = new Child();
    eq(a instanceof Child, true);
    eq(a instanceof Parent, true);
}

{
    console.log('Parent - Child link(via Class) is created on prototype object AND ALSO on actual object');
    class Parent {}
    class Child extends Parent { }

    eq(Parent.isPrototypeOf(Child), true);

    eq(Parent.prototype.isPrototypeOf(Child.prototype), true);
    eq(Child instanceof Parent, false);
    eq(Child.prototype instanceof Parent, true);

    a = new Child();
    eq(a instanceof Child, true);
    eq(a instanceof Parent, true);
}

console.log('super can be used in consice functions of plain objects');
{
    const o1 = {
        f1() {
            return ('o1:f1');
        }
    }
    const o2 = {
        f1() {
            return super.f1();
        }
    }
    Object.setPrototypeOf(o2, o1);
    eq(o2.f1(), 'o1:f1');
}

console.log('Prototype chain is more like __proto__.__proto__ than prototype.prototype');
{
    function Car() {}
    eq(Car.__proto__.hasOwnProperty('toString'), true);
    eq(Object.getPrototypeOf(Car).hasOwnProperty('toString'), true);
    eq(Car.prototype.hasOwnProperty('toString'), false);
}