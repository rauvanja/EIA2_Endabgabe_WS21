"use strict";
class Meat extends StaticDrawableComponent {
    draw(ctx) {
        super.draw(ctx);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.startX, this.startY, this.width, this.height);
        let radius = this.height / 4;
        let centerX = this.startX + this.width / 2;
        let centerY = this.startY + this.height / 2;
        ctx.beginPath();
        ctx.fillStyle = "brown";
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}
class IngredientHolder extends StaticDrawableComponent {
    constructor(ingredient, color, startX, startY, width, height) {
        super(color, startX, startY, width, height);
        this.eventTarget = new EventTarget();
        this.ingredient = ingredient;
        this.fillLevel = 1;
    }
    draw(ctx) {
        super.draw(ctx);
        let height = this.height * this.fillLevel;
        let startY = this.startY + ((1 - this.fillLevel) * this.height);
        this.ingredient.draw(ctx, this.startX, startY, this.width, height);
    }
    getFillLevel() {
        return this.fillLevel;
    }
    setFillLevel(newLevel) {
        this.fillLevel = newLevel;
    }
    fillUp() {
        this.fillLevel = 1;
    }
    decreaseFillLevel() {
        this.fillLevel = Math.max(this.fillLevel - 0.2, 0);
        if (this.fillLevel <= 0.4) {
            this.eventTarget.dispatchEvent(new Event("lowlevel"));
        }
    }
    getText() {
        return this.ingredient.getText() + " " + this.asString();
    }
    asString() {
        return "" + 100 * this.fillLevel + "%";
    }
    onReachLowLevel(callable) {
        this.eventTarget.addEventListener("lowlevel", callable);
    }
}
class Ingredient {
    draw(ctx, startX, startY, width, height) {
        ctx.fillStyle = this.color;
        ctx.fillRect(startX, startY, width, height);
    }
    getText() {
        return this.text;
    }
}
class NoIngredient extends Ingredient {
}
class Salat extends Ingredient {
    constructor() {
        super();
        this.color = "green";
        this.text = "Salad";
    }
}
class Cabbage extends Ingredient {
    constructor() {
        super();
        this.color = "purple";
        this.text = "Cabbage";
    }
}
class Sauce extends Ingredient {
    constructor() {
        super();
        this.color = "#FFA500";
        this.text = "Sauce";
    }
}
class Tomato extends Ingredient {
    constructor() {
        super();
        this.color = "red";
        this.text = "Tomato";
    }
}
class Onion extends Ingredient {
    constructor() {
        super();
        this.color = "yellow";
        this.text = "Onion";
    }
}
//# sourceMappingURL=ingredients.js.map