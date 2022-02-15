"use strict";
class KitchenComponent extends StaticDrawableComponent {
    constructor() {
        super(...arguments);
        this.eventTarget = new EventTarget();
    }
    setEmployees(employees) {
        this.employees = employees;
    }
    addEmployee(employee) {
        this.employees.push(employee);
        employee.eventTarget.addEventListener("idle", () => this.eventTarget.dispatchEvent(new CustomEvent("idleEmployee", { detail: employee })));
    }
    getIdleEmployees() {
        let idleEmployees = [];
        for (let e of this.employees) {
            if (e.state == "idle") {
                idleEmployees.push(e);
            }
        }
        return idleEmployees;
    }
    getIngredientTarget(ingredient) {
        if (ingredient instanceof Salat) {
            return this.saladTarget;
        }
        if (ingredient instanceof Cabbage) {
            return this.cabbageTarget;
        }
        if (ingredient instanceof Sauce) {
            return this.sauceTarget;
        }
        if (ingredient instanceof Tomato) {
            return this.tomatoTarget;
        }
        if (ingredient instanceof Onion) {
            return this.onionTarget;
        }
        return this.thekeTarget;
    }
    getNewIngredient(ingredient) {
        if (ingredient instanceof Salat) {
            return new Salat();
        }
        if (ingredient instanceof Cabbage) {
            return new Cabbage();
        }
        if (ingredient instanceof Sauce) {
            return new Sauce();
        }
        if (ingredient instanceof Tomato) {
            return new Tomato();
        }
        return new Onion();
    }
    getIngredientHolder(ingredient) {
        if (ingredient instanceof Salat) {
            return this.saladHolder;
        }
        if (ingredient instanceof Cabbage) {
            return this.cabbageHolder;
        }
        if (ingredient instanceof Sauce) {
            return this.sauceHolder;
        }
        if (ingredient instanceof Tomato) {
            return this.tomatoHolder;
        }
        return this.onionHolder;
    }
}
class Theke extends KitchenComponent {
    constructor(color, startX, startY, width, height) {
        super(color, startX, startY - 1, width, height + 1);
        this.placeHolder = new StaticDrawableComponent('grey', startX, startY, 5 * width / 10, height);
        this.saladHolder = new IngredientHolder(new Salat(), color, startX + 5 * width / 10, startY, width / 10, height);
        this.cabbageHolder = new IngredientHolder(new Cabbage(), color, startX + 6 * width / 10, startY, width / 10, height);
        this.sauceHolder = new IngredientHolder(new Sauce(), color, startX + 7 * width / 10, startY, width / 10, height);
        this.tomatoHolder = new IngredientHolder(new Tomato(), color, startX + 8 * width / 10, startY, width / 10, height);
        this.onionHolder = new IngredientHolder(new Onion(), color, startX + 9 * width / 10, startY, width / 10, height);
        this.saladTarget = [this.saladHolder.startX, this.saladHolder.startY - 10];
        this.cabbageTarget = [this.cabbageHolder.startX, this.cabbageHolder.startY - 10];
        this.sauceTarget = [this.sauceHolder.startX, this.sauceHolder.startY - 10];
        this.tomatoTarget = [this.tomatoHolder.startX, this.tomatoHolder.startY - 10];
        this.onionTarget = [this.onionHolder.startX, this.tomatoHolder.startY - 10];
        this.thekeTarget = [150, 400];
        this.employees = [];
    }
    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.rect(this.startX, this.startY, this.width, this.height);
        this.placeHolder.draw(ctx);
        this.saladHolder.draw(ctx);
        this.cabbageHolder.draw(ctx);
        this.tomatoHolder.draw(ctx);
        this.onionHolder.draw(ctx);
        if (this.currentOrder) {
            this.currentOrder.draw(ctx);
        }
        for (let e of this.employees) {
            e.draw(ctx);
        }
    }
    async getIngredient(employee, ingredient) {
        let target = this.getIngredientTarget(ingredient);
        await employee.moveTo(target);
        employee.setIngredient(ingredient);
    }
    async moveBackToTheke(employee) {
        await employee.moveTo(this.thekeTarget);
        employee.removeIngredient();
    }
    async addIngredientToOrder(employee, ingredient) {
        return new Promise(async (resolve) => {
            employee.state = "working";
            await this.getIngredient(employee, ingredient);
            this.getIngredientHolder(ingredient).decreaseFillLevel();
            await this.moveBackToTheke(employee);
            this.currentOrder.addIngredient(ingredient);
            employee.setIdle();
            resolve(true);
        });
    }
    waitForEmployeesToBecomeIdle() {
        return new Promise(resolve => {
            this.eventTarget.addEventListener("idleEmployee", () => {
                if (this.currentOrder.missingIngredients.length == 0) {
                    let allFinished = true;
                    for (let e of this.employees) {
                        if (e.state != "idle") {
                            allFinished = false;
                        }
                    }
                    if (allFinished) {
                        resolve(true);
                    }
                }
            });
        });
    }
    serveCustomer(customer) {
        return new Promise(async (resolve) => {
            this.currentOrder = customer.order;
            this.currentOrder.state = OrderState.inProgress;
            this.eventTarget.addEventListener("orderFinished", () => {
                console.log("orderFinished");
                resolve(true);
            }, { once: true });
            for (let e of this.getIdleEmployees()) {
                let ing = this.currentOrder.missingIngredients.splice(0, 1);
                if (ing.length) {
                    this.addIngredientToOrder(e, ing[0]);
                }
            }
            if (this.currentOrder.missingIngredients.length == 0) {
                await this.waitForEmployeesToBecomeIdle();
                this.eventTarget.dispatchEvent(new Event("orderFinished"));
            }
            else {
                this.eventTarget.addEventListener("idleEmployee", async (evtData) => {
                    let ing = this.currentOrder.missingIngredients.splice(0, 1);
                    if (ing.length) {
                        await this.addIngredientToOrder(evtData.detail, ing[0]);
                    }
                    await this.waitForEmployeesToBecomeIdle();
                    resolve(true);
                });
            }
        });
    }
}
class Kitchen extends KitchenComponent {
    constructor(color, startX, startY, width, height, theke) {
        super(color, startX, startY, width, height);
        this.theke = theke;
        this.meat = new Meat(color, startX, startY, 2 * width / 10, height);
        this.placeHolder = new StaticDrawableComponent('grey', startX + 2 * width / 10, startY, 3 * width / 10, height);
        this.saladHolder = new IngredientHolder(new Salat(), color, startX + 5 * width / 10, startY, width / 10, height);
        this.cabbageHolder = new IngredientHolder(new Cabbage(), color, startX + 6 * width / 10, startY, width / 10, height);
        this.sauceHolder = new IngredientHolder(new Sauce(), color, startX + 7 * width / 10, startY, width / 10, height);
        this.tomatoHolder = new IngredientHolder(new Tomato(), color, startX + 8 * width / 10, startY, width / 10, height);
        this.onionHolder = new IngredientHolder(new Onion(), color, startX + 9 * width / 10, startY, width / 10, height);
        this.saladTarget = [this.saladHolder.startX, this.saladHolder.startY + height + 10];
        this.cabbageTarget = [this.cabbageHolder.startX, this.cabbageHolder.startY + height + 10];
        this.sauceTarget = [this.sauceHolder.startX, this.sauceHolder.startY + height + 10];
        this.tomatoTarget = [this.tomatoHolder.startX, this.tomatoHolder.startY + height + 10];
        this.onionTarget = [this.onionHolder.startX, this.tomatoHolder.startY + height + 10];
        this.thekeTarget = [150, 400];
        this.employees = [];
        for (let holder of [this.theke.saladHolder, this.theke.cabbageHolder, this.theke.sauceHolder, this.theke.tomatoHolder, this.theke.onionHolder]) {
            holder.onReachLowLevel(async () => {
                let employees = this.getIdleEmployees();
                if (employees.length != 0) {
                    let employee = employees[0];
                    let fullTarget = this.getIngredientTarget(holder.ingredient);
                    await employee.moveTo(fullTarget);
                    employee.setIngredient(this.getNewIngredient(holder.ingredient));
                    await employee.moveTo(this.theke.getIngredientTarget(holder.ingredient));
                    this.theke.getIngredientHolder(holder.ingredient).setFillLevel(1);
                    employee.removeIngredient();
                }
            });
        }
    }
    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.rect(this.startX, this.startY, this.width, this.height);
        this.meat.draw(ctx);
        this.placeHolder.draw(ctx);
        this.saladHolder.draw(ctx);
        this.cabbageHolder.draw(ctx);
        this.tomatoHolder.draw(ctx);
        this.onionHolder.draw(ctx);
        for (let e of this.employees) {
            e.draw(ctx);
        }
    }
}
class Vorraum extends StaticDrawableComponent {
    constructor(color, startX, startY, width, height) {
        super(color, startX, startY, height, width);
    }
}
//# sourceMappingURL=kitchen.js.map