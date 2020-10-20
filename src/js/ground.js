import Vec2D from "./utils/Vec2D.js";
import Noise from "./utils/Noise.js";
import Map from"./utils/Map.js"
import {Config, LevelAttributes} from"./utils/Config.js";

function setupGrass(car, random, searchIndex) {
    car.grassPositions = [];
    random = getRandom(Config.GRASS_SPAWN_FROM, Config.GRASS_SPAWN_UNTIL);
    for (let i = 0; i < car.vectors.length - 2; i++) {
        if (searchIndex === random) {
            let xPos = car.vectors[i].x;
            let yPos = car.vectors[i].y;
            car.grassPositions.push(new Vec2D(xPos, yPos));
            searchIndex = 0;
            random = getRandom(Config.GRASS_SPAWN_FROM, Config.GRASS_SPAWN_UNTIL);
        } else {
            searchIndex++;
        }
    }
}

function setupHoles(car, random, searchIndex) {
    car.holesPositions = [];
    random = getRandom(LevelAttributes[car.currentLevel].RANGE_SPAWN_HOLES_FROM,
        LevelAttributes[car.currentLevel].RANGE_SPAWN_HOLES_UNTIL);
    searchIndex = 0;
    let rndWidth = getRandom(LevelAttributes[car.currentLevel].HOLE_WIDTH_FROM,
        LevelAttributes[car.currentLevel].HOLE_WIDTH_UNTIL);

    for (let i = 0; i < car.vectors.length - 2; i++) {
        if (searchIndex === random) {
            let xPos = car.vectors[i].x;
            car.holesPositions.push(new Vec2D(xPos, rndWidth));
            searchIndex = 0;
            random = getRandom(LevelAttributes[car.currentLevel].RANGE_SPAWN_HOLES_FROM,
                LevelAttributes[car.currentLevel].RANGE_SPAWN_HOLES_UNTIL);
            rndWidth = getRandom(LevelAttributes[car.currentLevel].HOLE_WIDTH_FROM,
                LevelAttributes[car.currentLevel].HOLE_WIDTH_UNTIL);
        } else {
            searchIndex++;
        }
    }
}

function setupFuelTanks(car, random, searchIndex) {
    car.fuelPositions = [];
    random = getRandom(LevelAttributes[car.currentLevel].RANGE_SPAWN_FUEL_FROM,
        LevelAttributes[car.currentLevel].RANGE_SPAWN_FUEL_UNTIL);
    searchIndex = 0;
    for (let i = 0; i < car.vectors.length - 2; i++) {
        if (searchIndex === random) {
            let xPos = car.vectors[i].x;
            let yPos = car.vectors[i].y;
            car.fuelPositions.push(new Vec2D(xPos, yPos));
            searchIndex = 0;
            random = getRandom(LevelAttributes[car.currentLevel].RANGE_SPAWN_FUEL_FROM,
                LevelAttributes[car.currentLevel].RANGE_SPAWN_FUEL_UNTIL);
        } else {
            searchIndex++;
        }
    }
}

function getRandom(from, until) {
    return Math.floor(Math.random() * until + from);
}

class Ground {
    constructor(canvas, imgGrass, imgFuelTank, currentLevel) {
        this.canvas = canvas;
        this.height = canvas.height;
        this.currentLevel = currentLevel;
        this.imgGrass = imgGrass;
        this.imgFuelTank = imgFuelTank;

        this.vectors = [];
        this.grassPositions = [];
        this.holesPositions = [];
        this.fuelPositions = [];

        this.distance = LevelAttributes[currentLevel].COURSE_LENGTH;
        this.x = 0
        this.y = 0;

        for (let i = 0; i < this.distance; i+= Config.EDGES_SMOOTHNESS) {
            this.vectors.push(new Vec2D(i, canvas.height - Map.map(Noise.noise(i / 500), 0, 1, 10, 500)))
        }

        this.vectors.push(new Vec2D(this.distance, canvas.height + Config.GRASS_THICKNESS * 2));
        this.vectors.push(new Vec2D(0, canvas.height + Config.GRASS_THICKNESS * 2));

        this.reset();

    }

    reset() {
        let random, searchIndex = 0;
        setupGrass(this, random, searchIndex);
        setupHoles(this, random, searchIndex);
        setupFuelTanks(this, random, searchIndex);
        console.log(this.fuelPositions);
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

    fuelTankDetection(data) {
        for (let i = 0; i < this.fuelPositions.length; i++) {
            let fuelTank = this.fuelPositions[i];
            if (data.rightBorder >= fuelTank.x && data.rightBorder <= fuelTank.x + this.imgFuelTank.width) {
                this.fuelPositions.splice(i, 1);
                console.log(this.fuelPositions);
                return true;
            }
        }

        return false;
    }

    getY(x) {
        let betweenSteps = x % Config.EDGES_SMOOTHNESS,
            current = (x - betweenSteps) / Config.EDGES_SMOOTHNESS,
            next = current + 1,
            interpolation = 0;

        if(betweenSteps !== 0) {
            interpolation = (betweenSteps / Config.EDGES_SMOOTHNESS) * (this.vectors[next].y - this.vectors[current].y);
        }
        return this.vectors[current].y + interpolation;
    }

    draw(ctx, panX) {
        ctx.fillStyle = "#521e00";
        let gradient = ctx.createLinearGradient(0, 0, 6, 10);
        gradient.addColorStop(0, "#9acc3d")
        gradient.addColorStop(1, "#86b037");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Config.GRASS_THICKNESS * 2;
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
        this.drawFuelTanks(ctx, panX);
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
            let x = this.grassPositions[i].x - panX - Config.GRASS_THICKNESS*3 + ctx.canvas.width/2;
            let y = this.grassPositions[i].y - Config.GRASS_THICKNESS*3;
            ctx.drawImage(this.imgGrass, x, y);
        }
    }

    drawFuelTanks(ctx, panX) {
        for (let i = 0; i < this.fuelPositions.length; i++) {
            let x = this.fuelPositions[i].x - panX + ctx.canvas.width/2;
            let y = this.fuelPositions[i].y - this.imgFuelTank.height - 30;
            ctx.drawImage(this.imgFuelTank, x, y);
        }
    }

}

export default Ground;