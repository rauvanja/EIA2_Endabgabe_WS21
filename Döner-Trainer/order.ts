
enum OrderType {
    yufka,
    döner
}

enum OrderState {
    fulfilled,
    open, 
    inProgress
}


function getRandomInt(min: number, max: number) : number{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Order {
    state : OrderState;
    type: OrderType;
    missingIngredients: Ingredient[];
    addedIngredients: Ingredient[];
    centerX: number;
    centerY: number;
    radius: number;
    lengthIngredients: number;
    eventTarget : EventTarget;

    constructor(type: OrderType, ingredients: Ingredient[], centerX: number, centerY: number, radius: number){
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

    addIngredient(ingredient: Ingredient){
        this.addedIngredients.push(ingredient);
        if (this.addedIngredients.length == this.lengthIngredients){
            this.eventTarget.dispatchEvent(new Event("orderFinished"));
        }
    }

    onFinished(callback: any) {
        this.eventTarget.addEventListener("onFinished", callback, {once: true});
    }

    
    draw(ctx: CanvasRenderingContext2D){
        if (this.state == OrderState.inProgress){
            let endAngle = this.type == OrderType.yufka ? Math.PI: Math.PI * 2;
            ctx.fillStyle = "#FFA500";
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.radius, 0, endAngle, false);
            ctx.fill();
            for (let ingredient of this.addedIngredients){
                let rand = getRandomInt(-this.radius, this.radius);
                let x = this.centerX + rand;
                let y = this.centerY + rand;
                ingredient.draw(ctx, x, y, this.radius / 2, this.radius / 2);
            }
        }
    }
}