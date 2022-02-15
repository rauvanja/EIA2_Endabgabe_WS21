"use strict";
class StaticDrawableComponent {
    color;
    startX;
    startY;
    height;
    width;
    constructor(color, startX, startY, width, height) {
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.height = height;
        this.width = width;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.startX, this.startY, this.width, this.height);
    }
}
//# sourceMappingURL=components.js.map