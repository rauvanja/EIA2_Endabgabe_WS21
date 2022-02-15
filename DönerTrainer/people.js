"use strict";
var Mood;
(function (Mood) {
    Mood[Mood["happy"] = 0] = "happy";
    Mood[Mood["satisfied"] = 1] = "satisfied";
    Mood[Mood["angry"] = 2] = "angry";
    Mood[Mood["chilled"] = 3] = "chilled";
    Mood[Mood["stressed"] = 4] = "stressed";
    Mood[Mood["sleepy"] = 5] = "sleepy";
})(Mood || (Mood = {}));
function getEmoji(mood) {
    switch (mood) {
        case (Mood.happy):
            return "😍";
        case (Mood.satisfied):
            return "😌";
        case (Mood.angry):
            return "😖";
        case (Mood.chilled):
            return "😊";
        case (Mood.stressed):
            return "😵";
        case (Mood.sleepy):
            return "😴";
    }
}
class Person {
    mood;
    x;
    y;
    target;
    eventTarget;
    reachedTargetListener;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.eventTarget = new EventTarget();
    }
    getMovementSpeed() {
        if (this.mood == Mood.happy || this.mood == Mood.satisfied) {
            return .1;
        }
        else {
            return .1;
        }
    }
    getMood() {
        return this.mood;
    }
    setMood() {
        return this.mood;
    }
    setTarget(target) {
        this.target = target;
    }
    moveTo(target) {
        return new Promise((resolve) => {
            this.onReachedTarget(() => {
                resolve(true);
            });
            this.setTarget(target);
        });
    }
    onReachedTarget(callable) {
        this.eventTarget.addEventListener("reachedTarget", callable, { once: true });
    }
    isNearTarget() {
        return (Math.abs(this.x - this.target[0]) < 5 && (Math.abs(this.y - this.target[1])) < 5);
    }
    setXY(x, y) {
        this.x = x;
        this.y = y;
        if (this.target && this.isNearTarget()) {
            this.eventTarget.dispatchEvent(new Event("reachedTarget"));
        }
    }
    draw(ctx) {
        ctx.font = '20px serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (this.target) {
            let x = this.x + (this.target[0] - this.x) * this.getMovementSpeed();
            let y = this.y + (this.target[1] - this.y) * this.getMovementSpeed();
            this.setXY(x, y);
        }
        ctx.fillText(getEmoji(this.mood), this.x, this.y);
    }
}
class Customer extends Person {
    mood = Mood.happy;
    mode;
    order;
    constructor(x, y, order) {
        super(x, y);
        this.order = order;
        this.setWaiting();
    }
    setWaiting() {
        this.mode == "waiting";
        setTimeout(() => {
            if (Math.random() < 0.7) {
                this.mood = Mood.angry;
            }
        }, 1000);
    }
    setServed() {
        this.mode = "served";
        this.mood = Mood.satisfied;
    }
    setFinished() {
        this.mode = "finished";
    }
    draw(ctx) {
        super.draw(ctx);
    }
}
class Employee extends Person {
    mood = Mood.chilled;
    state = "idle";
    eventTarget = new EventTarget();
    ingredient;
    constructor(x, y) {
        super(x, y);
        this.ingredient = new NoIngredient();
        setTimeout(() => {
            if (Math.random() < 0.7) {
                this.mood = Mood.stressed;
            }
        }, 10000);
    }
    setIngredient(ingredient) {
        this.ingredient = ingredient;
    }
    removeIngredient() {
        this.ingredient = new NoIngredient();
    }
    draw(ctx) {
        if (!(this.ingredient instanceof NoIngredient) && this.ingredient) {
            this.ingredient.draw(ctx, this.x + 20, this.y + 20, 20, 20);
        }
        super.draw(ctx);
    }
    setIdle() {
        this.state = "idle";
        this.eventTarget.dispatchEvent(new Event("idle"));
        if (Math.random() < 0.7) {
            this.mood = Mood.chilled;
        }
        setTimeout(() => {
            if (Math.random() < 0.6) {
                this.mood = Mood.stressed;
            }
        }, 2000);
    }
    getWhenIdle() {
        return new Promise(resolve => {
            if (this.state == "idle") {
                this.state = "working";
                resolve(this);
            }
            else {
                this.eventTarget.addEventListener("idle", () => {
                    this.state = "working";
                    resolve(this);
                }, { once: true });
            }
        });
    }
}
//# sourceMappingURL=people.js.map