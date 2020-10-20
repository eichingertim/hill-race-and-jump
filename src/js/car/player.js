import Base from "./base.js";

class Player extends Base {
    constructor(x, y, imgPlayer) {
        super(x, y, imgPlayer);
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    update(y) {
        this.y = y;
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, -142, 140, 108);
    }
}

export default Player;