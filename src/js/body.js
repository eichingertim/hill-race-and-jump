import BaseImageElement from "./baseImageElement.js";

class Body extends BaseImageElement{
    constructor(x, y, canvas, imgBody) {
        super(x, y, canvas, imgBody);
        this.angle = 0;
    }

    update(y, angle) {
        this.y = y;
        this.angle = angle;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -45, -this.image.height + 10, this.image.width, this.image.height);
        ctx.restore();
    }
}

export default Body;