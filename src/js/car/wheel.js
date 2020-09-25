import Base from "./base.js";

class Wheel extends Base {
    constructor(x, y, canvas, imgWheel, width, height) {
        super(x, y, canvas, imgWheel, width, height);
        this.offsetX = 0;
        this.offsetY = 0;
        this.rotation = 4;
    }

    update(x, y, offsetX, offsetY) {
        this.y = y;
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;
    }

    draw(ctx, isFront) {
        let x = this.x - this.width/2 + this.offsetX,
            y = this.y - this.height/2 + this.offsetY;
        ctx.save();
        if (!isFront) {
            ctx.rotate(this.rotation);
            ctx.drawImage(this.image, x, y, this.width, this.height);
        }else {
            ctx.translate(x + this.width / 2, y + this.width / 2)
            ctx.rotate(this.rotation)
            ctx.drawImage(this.image, -this.width/2, -this.width/2, this.width, this.height);
        }
        ctx.restore();
        
        this.rotation += 4;
    }
}

export default Wheel;