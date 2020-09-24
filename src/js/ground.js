import Vec2D from "./Vec2D.js";
import Noise from "./Noise.js";
import Map from"./Map.js"

const SCALE = 30;

class Ground {
    constructor(canvas) {
        this.height = canvas.height;
        this.context = canvas.getContext("2d");

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

        for (let vect of this.vectors) {
            vect.x /= SCALE;
            vect.y /= SCALE;
        }
    }
    draw() {
        this.context.fillStyle = "#521e00";
        this.context.beginPath();
        this.context.moveTo(0, this.height);
        for (let i = 0; i < this.vectors.length - 2; i++) {
            this.context.lineTo(this.vectors[i].x * SCALE, this.vectors[i].y * SCALE);
        }
        this.context.lineTo(this.distance, this.height);
        this.context.closePath();
        this.context.fill();

        let gradient = this.context.createLinearGradient(0, 0, 6, 10);
        gradient.addColorStop(0, "#9acc3d")
        gradient.addColorStop(1, "#86b037");


        this.context.strokeStyle = gradient;
        this.context.lineWidth = this.grassThickness * 2;
        this.context.beginPath();
        this.context.moveTo(0, this.vectors[0].y * SCALE);
        for (let i = 1; i < this.vectors.length - 2; i++) {
            this.context.lineTo(this.vectors[i].x * SCALE, this.vectors[i].y * SCALE);
        }
        this.context.stroke();
    }

}

export default Ground;