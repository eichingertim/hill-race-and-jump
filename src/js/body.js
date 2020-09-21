import BaseImageElement from "./baseImageElement.js";

class Body extends BaseImageElement{
    constructor(x, y, canvas, imgBody) {
        super(x, y, canvas, imgBody);
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }
}

export default Body;