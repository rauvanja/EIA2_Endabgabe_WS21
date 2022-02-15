
class Meat extends StaticDrawableComponent {

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.startX, this.startY, this.width, this.height);
        let radius = this.height / 4;
        let centerX = this.startX + this.width / 2;
        let centerY = this.startY + this.height / 2;
        ctx.beginPath();
        ctx.fillStyle = 'brown';
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}

class IngredientHolder extends StaticDrawableComponent {
    fillLevel: number;
    ingredient: Ingredient;
    eventTarget = new EventTarget();

    constructor(ingredient: Ingredient, color: string, startX: number, startY: number, width: number, height:number) {
        super(color, startX, startY, width, height);
        this.ingredient = ingredient;
        this.fillLevel = 1;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        let height = this.height * this.fillLevel;
        let startY = this.startY + ((1 - this.fillLevel) * this.height);
        this.ingredient.draw(ctx, this.startX, startY, this.width, height);
    }

    getFillLevel(): number {
        return this.fillLevel;
    }

    setFillLevel(newLevel: number): void {
        this.fillLevel = newLevel;
    }

    fillUp(): void {
        this.fillLevel = 1;
    }

    decreaseFillLevel(): void {
        this.fillLevel = Math.max(this.fillLevel - 0.2, 0);
        if (this.fillLevel <= 0.4){
            this.eventTarget.dispatchEvent(new Event("lowlevel"));
        }
    }

    getText(): string {
        return this.ingredient.getText() + " " + this.asString();
    }

    asString(): string {
        return "" + 100 * this.fillLevel + "%";
    }

    onReachLowLevel(callable: any){
        this.eventTarget.addEventListener("lowlevel", callable);
    }
}

abstract class Ingredient {
    color: string;
    text: string;

    draw(ctx: CanvasRenderingContext2D, startX: number, startY: number, width: number, height: number): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(startX, startY, width, height);
    }

    getText(): string {
        return this.text;
    }
}

class NoIngredient extends Ingredient{}


class Salat extends Ingredient {
    constructor() {
        super();
        this.color = 'green';
        this.text = 'Salad';
    }
}
class Cabbage extends Ingredient {
    constructor() {
        super();
        this.color = 'purple';
        this.text = 'Cabbage';
    }
}
class Sauce extends Ingredient {
    constructor() {
        super();
        this.color = '#FFA500';
        this.text = 'Sauce';
    }
}
class Tomato extends Ingredient {
    constructor() {
        super();
        this.color = 'red';
        this.text = 'Tomato';
    }
}
class Onion extends Ingredient {
    constructor() {
        super();
        this.color = 'yellow';
        this.text = 'Onion';
    }
}