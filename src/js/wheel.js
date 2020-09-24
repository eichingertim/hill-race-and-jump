import BaseImageElement from "./baseImageElement.js";

class Wheel extends BaseImageElement {
    constructor(x, y, canvas, imgWheel, width, height) {
        super(x, y, canvas, imgWheel, width, height);
    }

    update(x, y) {
        //this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
}

export default Wheel;