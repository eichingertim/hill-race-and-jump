import Base from "./base.js";

class Body extends Base {
    constructor(x, y, imgBody) {
        super(x, y, imgBody);
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