import Body from "./body.js";
import Player from "./player.js";
import Wheel from "./wheel.js";

class Car {
    constructor(x, y, canvas, imgBody, imgWheel, imgPlayer) {
        this.canvas = canvas;
        this.speedX = 0;
        this.x = x;
        this.y = y;
        this.player = new Player(x, y, imgPlayer);
        this.body = new Body(x, y, imgBody);
        this.wheelFront = new Wheel(125, y - 100, imgWheel, 50, 50);
        this.wheelBack = new Wheel( 0, y - 100, imgWheel, 50, 50);
        this.accelerate = false;
        this.decelerate = false;
        this.angle = 0;
        this.firstStart = false;
        this.setEventListener();
    }

    update(ground) {
        let downHillAcceleration = (Car.GRAVITY * Math.sin(this.angle)) / Car.CLEAN_NEWTON,
            acceleration = this.accelerate * Car.ACCELERATION_RATE + this.decelerate * -Car.ACCELERATION_RATE;
        this.speedX += (acceleration + this.firstStart*downHillAcceleration);

        if (acceleration !== 0) this.speedX = Car.clamp(this.speedX, -Car.MAX_SPEED_X, Car.MAX_SPEED_X);
        else this.speedX = Car.clamp(Car.brake(this.speedX, downHillAcceleration), -Car.MAX_SPEED_X, Car.MAX_SPEED_X);

        this.x += this.speedX;
        this.x = Car.clamp(this.x, 0, 20 * this.canvas.width);

        if (this.y + Car.GRAVITY >= ground.getY(this.x) - 30) this.y = ground.getY(this.x) - 30;
        else this.y += Car.GRAVITY;
        

        let length = 125;

        let frontWheelY = ground.getY(this.x + 125) - 30;

        this.angle = Math.atan((frontWheelY - this.y) / length);
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

    static get ACCELERATION_RATE() {
        return 0.5;
    }
}

export default Car;