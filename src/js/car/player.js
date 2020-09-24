import Base from "./base.js";

class Player extends Base {
    constructor(x, y, canvas, imgPlayer) {
        super(x, y, canvas, imgPlayer);
    }

    update(y) {
        this.y = y;
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, -142, 140, 108);
    }
}

export default Player;