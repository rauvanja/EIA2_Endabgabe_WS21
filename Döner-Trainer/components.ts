
class StaticDrawableComponent {
    color: string;
    startX: number;
    startY: number;
    height: number;
    width: number;
    constructor(color: string, startX: number, startY: number, width: number, height: number) {
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.height = height;
        this.width = width;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.startX, this.startY, this.width, this.height);
    }
}