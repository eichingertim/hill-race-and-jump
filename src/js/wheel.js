import BaseImageElement from "./baseImageElement.js";

class Wheel extends BaseImageElement {
    constructor(x, y, canvas, imgWheel) {
        super(x, y, canvas, imgWheel);
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, this.y, this.image.width - 25, this.image.height - 25);
    }
}

export default Wheel;