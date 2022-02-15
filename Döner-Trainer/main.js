"use strict";
var Döner;
(function (Döner) {
    let crc2;
    let canvas;
    let kitchen;
    let theke;
    let customers = [];
    let currentServedCustomerTarget = [100, 600];
    let customerDistanceX = 75;
    let customerEntry = [1280, 600];
    let maxLenCustomers = 100;
    let numberOfDöners = 0;
    let numberOfYufkas = 0;
    function setDöners(num) {
        numberOfDöners = num;
        // @ts-ignore
        // @ts-ignore
        $("#döner").html(numberOfDöners);
    }
    function setYufkas(num) {
        numberOfYufkas = num;
        console.log(num);
        // @ts-ignore
        $("#yufka").html(numberOfYufkas);
    }
    // @ts-ignore
    function addCustomers() {
        let ingredients = [];
        if (onionChecked) {
            ingredients.push(new Onion());
        }
        if (tomatoChecked) {
            ingredients.push(new Tomato());
        }
        if (saladChecked) {
            ingredients.push(new Salat());
        }
        if (sauceChecked) {
            ingredients.push(new Sauce());
        }
        if (tomatoChecked) {
            ingredients.push(new Tomato());
        }
        if (cabbageChecked) {
            ingredients.push(new Cabbage());
        }
        customers.push(new Customer(customerEntry[0], customerEntry[1], new Order(orderType, ingredients, 150, 500, 20)));
        setTimeout(() => {
            if (customers.length < maxLenCustomers) {
                addCustomers();
            }
        }, customerTimeout);
    }
    function setCustomerHappyNess(val) {
        val = Math.round(val * 100);
        let asStr = val + "%";
        // @ts-ignore
        $("#customerHappiness").css("width", asStr);
        // @ts-ignore
        $("#customerHappiness").html(asStr);
    }
    function setEmployeeHappiness(val) {
        val = Math.round(val * 100);
        let asStr = val + "%";
        // @ts-ignore
        $("#employeeHappiness").css("width", asStr);
        // @ts-ignore
        $("#employeeHappiness").html(asStr);
    }
    function checkHappyness() {
        if (!theke || !kitchen || !customers) {
            setTimeout(() => {
                checkHappyness();
            }, 500);
            return;
        }
        let employeeCount = theke.employees.length + kitchen.employees.length;
        let customerCount = customers.length;
        let customerHappy = 0;
        let employeeHappy = 0;
        for (let e of theke.employees) {
            if (t) {
                employeeHappy++;
            }
        }
        for (let e of kitchen.employees) {
            if (e.mood == Mood.happy || e.mood == Mood.chilled || e.mood == Mood.satisfied) {
                employeeHappy++;
            }
        }
        for (let e of customers) {
            if (e.mood == Mood.happy || e.mood == Mood.chilled || e.mood == Mood.satisfied) {
                customerHappy++;
            }
        }
        if (customerCount != 0) {
            setCustomerHappyNess(customerHappy / customerCount);
        }
        if (employeeCount != 0) {
            setEmployeeHappiness(employeeHappy / employeeCount);
        }
        setTimeout(() => {
            checkHappyness();
        }, 500);
    }
    checkHappyness();
    async function serveCustomer() {
        if (customers.length != 0) {
            customers[0].setServed();
            await theke.serveCustomer(customers[0]);
            let [cust] = customers.splice(0, 1);
            if (cust) {
                if (cust.order.type == OrderType.döner) {
                    t;
                }
                else {
                    setYufkas(numberOfYufkas + 1);
                }
            }
        }
        setTimeout(serveCustomer, 500);
    }
    // function getVal(key: string){
    //     return document.getElementById(key)?.nodeValue
    // }
    // @ts-ignore
    function setOrderType(e) {
        orderType = e.target.value == "yufka" ? OrderType.yufka : OrderType.döner;
    }
    let tomatoChecked;
    let sauceChecked;
    let cabbageChecked;
    let saladChecked;
    let customerTimeout;
    let onionChecked;
    let orderType;
    //@ts-ignore
    window.handleButtonMyClick = handleButtonMyClick;
    // @ts-ignore
    function handleButtonMyClick() {
        canvas = document.getElementsByTagName("canvas")[0];
        crc2 = canvas.getContext("2d");
        setDöners(0);
        setYufkas(0);
        // @ts-ignore
        onionChecked = document.querySelector("#onion").checked;
        // @ts-ignore
        tomatoChecked = document.querySelector("#tomato").checked;
        // @ts-ignore
        cabbageChecked = document.querySelector("#cabbage").checked;
        // @ts-ignore
        sauceChecked = document.querySelector("#sauce").checked;
        // @ts-ignore
        saladChecked = document.querySelector("#salad").checked;
        // @ts-ignore
        customerTimeout = document.querySelector("#timeout")?.value;
        // @ts-ignore
        orderType = document.querySelector("#order")?.value == "yufka" ? OrderType.yufka : OrderType.döner;
        // @ts-ignore
        let employeesKitchen = Number.parseInt(document.querySelector("#noEmployees")?.value);
        console.log(employeesKitchen);
        // @ts-ignore
        let employeesTheke = Number.parseInt(document.querySelector("#noEmployeesTheke")?.value);
        theke = new Theke("grey", 0, 3 * canvas.height / 5, 8 * canvas.width / 10, canvas.height / 6);
        kitchen = new Kitchen("grey", 0, 0, canvas.width, canvas.height / 5, theke);
        for (let i = 0; i < employeesTheke; i++) {
            theke.addEmployee(new Employee(50, 50));
        }
        for (let i = 0; i < employeesKitchen; i++) {
            kitchen.addEmployee(new Employee(50, 50));
        }
        addCustomers();
        serveCustomer();
        requestAnimationFrame(animate);
    } // close load-function
    // @ts-ignore
    function animate() {
        crc2.clearRect(0, 0, canvas.width, canvas.height);
        kitchen.draw(crc2);
        theke.draw(crc2);
        let i = 0;
        for (let cust of customers) {
            let targetX = currentServedCustomerTarget[0] + customerDistanceX * i;
            cust.setTarget([targetX, currentServedCustomerTarget[1]]);
            cust.draw(crc2);
            if (i == 0) {
                cust.order.draw(crc2);
            }
            i++;
        }
        requestAnimationFrame(animate);
    }
})(Döner || (Döner = {}));
//# sourceMappingURL=main.js.map