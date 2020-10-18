import Vec2D from "./utils/Vec2D.js";
import Noise from "./utils/Noise.js";
import Map from"./utils/Map.js"

class Ground {
    constructor(canvas, imgGrass) {
        this.canvas = canvas;
        this.height = canvas.height;

        this.imgGrass = imgGrass;

        this.vectors = [];
        this.grassPositions = [];
        this.holesPositions = [];
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

        let randomPos = Math.floor(Math.random() * 60 + 20);
        let grassIndex = 0;
        for (let i = 0; i < this.vectors.length - 2; i++) {
            if (grassIndex === randomPos) {
                let xPos = this.vectors[i].x;
                let yPos = this.vectors[i].y;
                this.grassPositions.push(new Vec2D(xPos, yPos));
                grassIndex = 0;
                randomPos = Math.floor(Math.random() * 90 + 50);
            } else {
                grassIndex++;
            }
        }

        let rnd = Math.floor(Math.random() * 200 + 30);
        let rndWidth = Math.floor(Math.random() * 350 + 150);
        let holeIndex = 0;
        for (let i = 0; i < this.vectors.length - 2; i++) {
            if (holeIndex === rnd) {
                let xPos = this.vectors[i].x;
                this.holesPositions.push(new Vec2D(xPos, rndWidth));
                holeIndex = 0;
                rnd = Math.floor(Math.random() * 200 + 30);
                rndWidth = Math.floor(Math.random() * 350 + 150);
            } else {
                holeIndex++;
            }
        }

    }

    holeDetectionFull(data) {
        for (let i = 0; i < this.holesPositions.length; i++) {
            let holeLeft = this.holesPositions[i].x, 
                holeRight = this.holesPositions[i].x + this.holesPositions[i].y;
            if (holeLeft < data.right && holeRight > data.right && 
                holeLeft < data.left && holeRight > data.left) return true;
        }
        return false;
    }

    holeDetectionFront(data) {
        for (let i = 0; i < this.holesPositions.length; i++) {
            let holeLeft = this.holesPositions[i].x, 
                holeRight = this.holesPositions[i].x + this.holesPositions[i].y;
            if (holeLeft < data.right && holeRight > data.right ) return true;
        }
        return false;
    }

    getY(x) {
        let betweenSteps = x % this.smoothness,
            current = (x - betweenSteps) / this.smoothness,
            next = current + 1,
            interpolation = 0;

        if(betweenSteps !== 0) {
            interpolation = (betweenSteps / this.smoothness) * (this.vectors[next].y - this.vectors[current].y);
        }
        return this.vectors[current].y + interpolation;
    }

    draw(ctx, panX) {
        ctx.fillStyle = "#521e00";
        let gradient = ctx.createLinearGradient(0, 0, 6, 10);
        gradient.addColorStop(0, "#9acc3d")
        gradient.addColorStop(1, "#86b037");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.grassThickness * 2;
        ctx.beginPath();
        ctx.moveTo(-panX + ctx.canvas.width/2, this.height);
        for (let i = 0; i < this.vectors.length - 2; i++) {
            ctx.lineTo(this.vectors[i].x - panX + ctx.canvas.width/2, this.vectors[i].y );
        }
        ctx.lineTo(this.distance - panX + ctx.canvas.width/2, this.height);
        ctx.fill();
        ctx.stroke();

        this.drawGrass(ctx, panX);
        this.drawHoles(ctx, panX);
    }

    drawHoles(ctx, panX) {
        let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(0, "#39cce6");
        grd.addColorStop(1, "white");
        ctx.fillStyle = grd;

        for (let i = 0; i < this.holesPositions.length; i++) {
            let x = this.holesPositions[i].x - panX + ctx.canvas.width/2;
            ctx.fillRect(x, 0, this.holesPositions[i].y, ctx.canvas.height, grd);
        }
    }

    drawGrass(ctx, panX) {
        for (let i = 0; i < this.grassPositions.length; i++) {
            let x = this.grassPositions[i].x - panX - this.grassThickness*3 + ctx.canvas.width/2;
            let y = this.grassPositions[i].y - this.grassThickness*3;
            ctx.drawImage(this.imgGrass, x, y);
        }
    }

}

export default Ground;