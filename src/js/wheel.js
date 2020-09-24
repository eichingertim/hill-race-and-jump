import BaseImageElement from "./baseImageElement.js";

class Wheel extends BaseImageElement {
    constructor(x, y, canvas, imgWheel, width, height) {
        super(x, y, canvas, imgWheel, width, height);
        this.offsetX = 0;
        this.offsetY = 0;
    }

    update(x, y, offsetX, offsetY) {
        //this.x = x;
        this.y = y;
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;
    }

    draw(ctx) {
        let x = this.x - this.width/2 + this.offsetX,
            y = this.y - this.height/2 + this.offsetY;
        ctx.drawImage(this.image, x, y, this.width, this.height);
    }
}

export default Wheel;