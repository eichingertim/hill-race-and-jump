import Vec2D from "./Vec2D.js";
import Noise from "./Noise.js";
import Map from"./Map.js"

const SCALE = 30;

class Ground {
    constructor(canvas) {
        this.canvas = canvas;
        this.height = canvas.height;

        this.vectors = [];
        this.distance = 20 * canvas.width;
        this.grassThickness = 10;
        this.smoothness = 10;
        this.x = 0
        this.y = 0;

        for (let i = 0; i < this.distance; i+= this.smoothness) {
            this.vectors.push(new Vec2D(i, canvas.height - Map.map(Noise.noise(i / 500), 0, 1, 10, 500)))
        }

        this.vectors.push(new Vec2D(this.distance, canvas.height + this.grassThickness * 2));
        this.vectors.push(new Vec2D(0, canvas.height + this.grassThickness * 2));
        console.log(this.vectors);
        for (let vect of this.vectors) {
            //vect.x /= SCALE;
            //vect.y /= SCALE;
        }
    }
    draw(ctx, panX) {
        ctx.fillStyle = "#521e00";
        let gradient = ctx.createLinearGradient(0, 0, 6, 10);
        gradient.addColorStop(0, "#9acc3d")
        gradient.addColorStop(1, "#86b037");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.grassThickness * 2;
        ctx.beginPath();
        ctx.moveTo(-panX, this.height);
        for (let i = 0; i < this.vectors.length - 2; i++) {
            ctx.lineTo(this.vectors[i].x - panX , this.vectors[i].y );
        }
        ctx.lineTo(this.distance - panX, this.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

}

export default Ground;