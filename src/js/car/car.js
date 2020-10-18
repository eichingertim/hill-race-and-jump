import Body from "./body.js";
import Player from "./player.js";
import Wheel from "./wheel.js";

function updateX(car) {
    let downHillAcceleration = (Car.GRAVITY * Math.sin(car.angle)) / Car.CLEAN_NEWTON,
            acceleration = car.accelerate * Car.ACCELERATION_RATE + car.decelerate * -Car.ACCELERATION_RATE;
        car.speedX += (acceleration + car.firstStart*downHillAcceleration);

        if (acceleration !== 0) car.speedX = Car.clamp(car.speedX, -Car.MAX_SPEED_X, Car.MAX_SPEED_X);
        else car.speedX = Car.clamp(Car.brake(car.speedX, downHillAcceleration), -Car.MAX_SPEED_X, Car.MAX_SPEED_X);

        car.x += car.speedX;
        car.x = Car.clamp(car.x, 0, 20 * car.canvas.width);

        car.rightBorderPos = car.x - 50 + car.body.image.width;
        car.LeftBorderPos = car.x - 50;
}

function updateY(car, ground) {
    let data = {
        right: car.rightBorderPos,
        left: car.LeftBorderPos,
    }
    if (ground.holeDetectionFull(data)) {
        if (car.y + Car.GRAVITY >= car.canvas.height) console.log("Death");
        else car.y += Car.GRAVITY;
            
        if (car.wheelFront.y + Car.GRAVITY >= car.canvas.height){
            console.log("Death");
        } else car.wheelFront.y += Car.GRAVITY;

    } else if (ground.holeDetectionFront(data)) {
        if (car.y + Car.GRAVITY >= ground.getY(car.x) - 30) car.y = ground.getY(car.x) - 30;
        else car.y += Car.GRAVITY;
            
        if (car.wheelFront.y + Car.GRAVITY >= car.canvas.height){
            console.log("Death");
        } else car.wheelFront.y += Car.GRAVITY;

    } else {
        if (car.y + Car.GRAVITY >= ground.getY(car.x) - 30) car.y = ground.getY(car.x) - 30;
        else car.y += Car.GRAVITY;
            
        if (car.wheelFront.y + Car.GRAVITY >= ground.getY(car.x + Car.DISTANCE_BETWEEN_AXES) - 30){
            car.wheelFront.y = ground.getY(car.x + 125) - 30;
        } else car.wheelFront.y += Car.GRAVITY;
    }

    
}

class Car {
    constructor(x, y, canvas, imgBody, imgWheel, imgPlayer) {
        this.canvas = canvas;
        this.speedX = 0;
        this.x = x;
        this.y = y;

        this.rightBorderPos = this.x + imgBody.width;
        this.LeftBorderPos = this.x;

        this.player = new Player(x, y, imgPlayer);
        this.body = new Body(x, y, imgBody);
        this.wheelFront = new Wheel(Car.DISTANCE_BETWEEN_AXES, y - 100, imgWheel, 50, 50);
        this.wheelBack = new Wheel( 0, y - 100, imgWheel, 50, 50);
        this.accelerate = false;
        this.decelerate = false;
        this.angle = 0;
        this.firstStart = false;
        this.setEventListener();
    }

    update(ground) {
        updateX(this);
        updateY(this, ground);

        this.angle = Math.atan((this.wheelFront.y - this.y) / Car.DISTANCE_BETWEEN_AXES);
        return true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(ctx.canvas.width/2, this.y);
        ctx.rotate(this.angle);

        this.player.draw(ctx);
        this.wheelFront.draw(ctx, true, (this.speedX !== 0));
        this.wheelBack.draw(ctx, false, (this.speedX !== 0));
        this.body.draw(ctx);
        ctx.restore();
        return this.x;
    }

    setEventListener() {
        document.addEventListener('keydown', event => {
            if(event.repeat) {
                return;
            }
            switch(event.key) {
                case 'ArrowRight':
                    this.accelerate = true;
                    this.firstStart = true;
                    break;
                case 'ArrowLeft':
                    this.decelerate = true;
                    this.firstStart = true;
                    break;
                case ' ':
                    console.log("Jump");
                    this.jump();
                    break;
            }
        });

        document.addEventListener('keyup', event => {
            if(event.repeat) {
                return;
            }
            switch(event.key) {
                case 'ArrowRight':
                    this.accelerate = false;
                    break;
                case 'ArrowLeft':
                    this.decelerate = false;
                    break;
            }
        });
    }

    jump() {
        this.y -= 300;
        this.wheelFront.y -= 300;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static brake(speed, downHillAcceleration) {
        if (speed - Car.ACCELERATION_RATE + downHillAcceleration > 0) {
            return speed - Car.ACCELERATION_RATE + downHillAcceleration;
        } else if (speed + Car.ACCELERATION_RATE + downHillAcceleration < 0) {
            return speed + Car.ACCELERATION_RATE + downHillAcceleration;
        } else {
            return 0;
        }
    }

    static get CLEAN_NEWTON() {
        return 8;
    }

    static get GRAVITY() {
        return 9.81;
    }

    static get MAX_SPEED_X() {
        return 8;
    }

    static get DISTANCE_BETWEEN_AXES() {
        return 125;
    }

    static get ACCELERATION_RATE() {
        return 0.5;
    }
}

export default Car;