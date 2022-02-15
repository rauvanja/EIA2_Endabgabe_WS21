"use strict";
var OrderType;
(function (OrderType) {
    OrderType[OrderType["yufka"] = 0] = "yufka";
    OrderType[OrderType["d\u00F6ner"] = 1] = "d\u00F6ner";
})(OrderType || (OrderType = {}));
var OrderState;
(function (OrderState) {
    OrderState[OrderState["fulfilled"] = 0] = "fulfilled";
    OrderState[OrderState["open"] = 1] = "open";
    OrderState[OrderState["inProgress"] = 2] = "inProgress";
})(OrderState || (OrderState = {}));
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Order {
    constructor(type, ingredients, centerX, centerY, radius) {
        this.state = OrderState.open;
        this.type = type;
        this.lengthIngredients = ingredients.length;
        this.missingIngredients = ingredients;
        this.addedIngredients = [];
        this.radius = radius;
        this.centerX = centerX;
        this.centerY = centerY;
        this.eventTarget = new EventTarget();
    }
    addIngredient(ingredient) {
        this.addedIngredients.push(ingredient);
        if (this.addedIngredients.length == this.lengthIngredients) {
            this.eventTarget.dispatchEvent(new Event("orderFinished"));
        }
    }
    onFinished(callback) {
        this.eventTarget.addEventListener("onFinished", callback, { once: true });
    }
    draw(ctx) {
        if (this.state == OrderState.inProgress) {
            let endAngle = this.type == OrderType.yufka ? Math.PI : Math.PI * 2;
            ctx.fillStyle = "#FFA500";
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.radius, 0, endAngle, false);
            ctx.fill();
            for (let ingredient of this.addedIngredients) {
                let rand = getRandomInt(-this.radius, this.radius);
                let x = this.centerX + rand;
                let y = this.centerY + rand;
                ingredient.draw(ctx, x, y, this.radius / 2, this.radius / 2);
            }
        }
    }
}
//# sourceMappingURL=order.js.map