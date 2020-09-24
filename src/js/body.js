import BaseImageElement from "./baseImageElement.js";

class Body extends BaseImageElement{
    constructor(x, y, canvas, imgBody) {
        super(x, y, canvas, imgBody);
        this.angle = 0;
    }

    update(y) {
        this.y = y;
    }

    draw(ctx) {
        ctx.drawImage(this.image, -45, -this.image.height + 10, this.image.width, this.image.height);
    }
}

export default Body;