const assert = require('assert');

const eq = assert.equal;

(function playConstructorFns() {
    //Constructor function v/s Normal function
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
    console.log('Create object using constructor fn:', objCar);
})();

(function playClass() {
    //Create objects using es6 class
    class Car {
        constructor(model, color) {
            this.model = model;
            this.color = color;
        }
    }
//    Below line throws TypeError: Class constructor Car cannot be invoked without 'new'
    try {
      const fnCar = Car("Hexa", "White");
    } catch(e) {
        console.log('TypeError : Class constructor cannot be invoked without `new`');
    }

    const objCar = new Car("Hexa", "White");
    objCar.year = 2010;
    eq(objCar.color, "White");
    eq(objCar['year'], 2010);
    console.log('Create object using es6 classes:', objCar);
})();

(function playObjectCreate() {
    //Create objects using Object.create
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
    console.log('Create object using Object.create:', car);
})();

(function playObjectProperties() {
    //Object properties
    const car = {
        color: 'White',
        year: 2010
    }
    //writable
    Object.defineProperty(car, 'year', { writable: false });
    car.year=2013; //Gives error in strict mode
    eq(car.year, 2010);
    console.log('writable=false prop value cannot be changed');

    car.model = { name: 'Hexa', class: 'VX' }
    Object.defineProperty(car, 'model', { writable: false });
    car.model.class = 'ZX';
    eq(car.model.class, 'ZX');
    console.log('Properties of nested object can be modified even if writable is false');

    //enumerable
    Object.defineProperty(car.model, 'class', { enumerable: false });
    eq(Object.keys(car.model).indexOf('name'), 0);
    eq(Object.keys(car.model).indexOf('class'), -1);
    car.model.class = 'AX';
    eq(car.model.class, 'AX');
    console.log('enumerable=false will make property not iterable though can read/write directly');

    //configurable
    Object.defineProperty(car, 'color', { configurable: false });
    car.color = 'Black'
    Object.defineProperty(car, 'color', { writable: false });
    delete car.color;
    assert.deepEqual(Object.getOwnPropertyDescriptor(car, 'color'), { value: 'Black', configurable: false, enumerable: true, writable: false});
    console.log('configurable=false prop cant be deleted and only writable can be changed enumerable,configurable cant be changed')
})();

(function playGetSet() {
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
    console.log('Can get & set value of multiple properties using getter & setter methods');
})();

(function playPrototypes() {
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
    console.log('Constructor fn prototype is an object that will be _proto_ of all objects instantiated from that function');

    Car.prototype.seatCapacity = 4;
    eq(Car.prototype.seatCapacity, 4);
    eq(car1.__proto__.seatCapacity, 4);
    eq(car1.seatCapacity, 4);
    eq(car1.hasOwnProperty('seatCapacity'), false);
    console.log('Adding new Prototype prop is not reflected in existing instances');

    Car.prototype = { seatCapacity: 2 };
    car4 = new Car('Camry', 'Blue');
    eq(Car.prototype === car1.__proto__, false);
    eq(car1.seatCapacity, 4);
    eq(Car.prototype === car4.__proto__, true);
    eq(car4.seatCapacity, 2);
    console.log('Updating prototype prop is not reflected in existing instances');
    console.log('New objects created after changing prototype will have same _proto_ as changed prototype');

    const car2 = new Car('Innova', 'Red');
    eq(car2.hasOwnProperty('seatCapacity'), false);
    car2.seatCapacity = 6
    eq(car1.seatCapacity, 4);
    eq(car2.seatCapacity, 6);
    eq(car1.hasOwnProperty('seatCapacity'), false);
    eq(car2.hasOwnProperty('seatCapacity'), true);
    console.log('Prototype prop is added to all instances. Instance prop is specific to instance');
    console.log('Shadowing1: Data accessor prop found higher on prototype chain with writable:`true` will be added to main object');

    Object.defineProperty(Car.prototype, 'seatCapacity', { writable: false });
    c = new Car('Nano', 'Black');
    eq(c.hasOwnProperty('seatCapacity'), false);
    c.seatCapacity = 8;
    eq(c.seatCapacity, 2);
    eq(c.hasOwnProperty('seatCapacity'), false);
    console.log('Shadowing2: Data accessor prop found higher on prototype chain with writable:`false` will be ignored(error in strict mode). NO Shadowing');

    eq(car1.hasOwnProperty('type'), false);
    eq('type' in car1, true);
    car1.type = 'sedan';
    eq(car1.hasOwnProperty('type'), false);
    eq(car1.type, 'sedan');
    console.log('Shadowing3: Prop is a setter higher on prototype chain. Always setter will be called. NO Shadowing');

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
    console.log('Shadowing4: Can force shadow property using defineProperty');

    Car.prototype.tyre = 4;
    c = new Car('Nano', 'Red');
    eq(c.hasOwnProperty('tyre'), false);
    eq(c.tyre, 4);
    c.tyre++;
    eq(c.hasOwnProperty('tyre'), true);
    eq(c.tyre, 5);
    console.log('Shadowing5: Implicit shadowing')
})();

(function playPrototypeChainUsingFn() {
    console.log('Prototype chain created with functions adds prototype props with enumerable=true');
    function Vehicle(speed) {
        this.speed = speed || 0;
    }
    Vehicle.prototype.start = function() {
        console.log(this.speed);
    }
    function Car(model, speed) {
        Vehicle.call(this, speed);
        this.model = model;
    }
    Car.prototype = Object.create(Vehicle.prototype);
    Car.prototype.constructor = Car;
    const car1 = new Car('Hexa', 40);
    eq(car1.__proto__ === Car.prototype, true);
    eq(car1.__proto__.__proto__ === Vehicle.prototype, true);
    eq(Object.getOwnPropertyDescriptor(Vehicle.prototype,'start').enumerable, true);
})();

(function playPrototypeChainUsingClass() {
    console.log('Prototype chain created with class adds prototype props with enumerable=false');
    class Vehicle {
        constructor(speed) {
            this.speed = speed || 0;
        }
        start () {
            console.log(this.speed);
        }
    }
    class Car extends Vehicle {
        constructor(model, speed) {
            super(speed)
            this.model = model;
        }
    }

    const car1 = new Car('Hexa', 40);
    eq(car1.__proto__ === Car.prototype, true);
    eq(car1.__proto__.__proto__ === Vehicle.prototype, true);
    eq(Object.getOwnPropertyDescriptor(Vehicle.prototype,'start').enumerable, false);
})();

