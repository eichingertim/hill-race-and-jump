import Base from "./base.js";

class Wheel extends Base {
    constructor(x, y, imgWheel, width, height) {
        super(x, y, imgWheel, width, height);
        this.startY = y;
        this.offsetX = 0;
        this.offsetY = 0;
        this.rotation = 4;
        this.shouldRotate = false;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, isFront, shouldRotate) {
        let x = this.x - this.width/2 + this.offsetX,
            y = this.startY - this.height/2 + this.offsetY;
        this.shouldRotate = shouldRotate || false;
        
        ctx.save();
        if (!isFront) {
            if (this.shouldRotate) ctx.rotate(this.rotation);
            ctx.drawImage(this.image, x, y, this.width, this.height);
        }else {
            ctx.translate(x + this.width / 2, y + this.width / 2)
            if (this.shouldRotate) ctx.rotate(this.rotation);
            ctx.drawImage(this.image, -this.width/2, -this.width/2, this.width, this.height);
        }
        ctx.restore();
        
        this.rotation += 4;
    }
}

export default Wheel;