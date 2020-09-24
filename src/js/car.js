import Body from "./body.js";
import Wheel from "./wheel.js";

class Car {
    constructor(x, y, canvas, imgBody, imgWheel) {
        this.canvas = canvas;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0.2;
        this.gravitySpeed = 0;
        this.startingPosX = x;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.body = new Body(x, y, canvas, imgBody);
        this.wheelFront = new Wheel(125, y - 100, canvas, imgWheel, 50, 50);
        this.wheelBack = new Wheel( 0, y - 100, canvas, imgWheel, 50, 50);
        this.accelerate = false;
        this.decelerate = false;
        this.angle = 0;
        document.addEventListener('keydown', event => {
            if(event.repeat) {
                return;
            }
            switch(event.key) {
                case 'ArrowRight':
                    this.accelerate = true;
                    break;
                case 'ArrowLeft':
                    this.decelerate = true;
                    break;
                case ' ':
                    this.speedX = 0;
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

    update(ground) {
        //console.log(groundY);
        this.speedX += this.accelerate * Car.ACCELERATION_RATE + this.decelerate * -Car.ACCELERATION_RATE;
        this.speedX = Car.clamp(this.speedX, -Car.MAX_SPEED_X, Car.MAX_SPEED_X);

        this.x += this.speedX;
        this.x = Car.clamp(this.x, 0, 20 * this.canvas.width);

        this.y = ground.getY(this.x) - 20;

        let length = 125;

        let frontWheelY = ground.getY(this.x + 125) - 20;

        this.angle = Math.atan((frontWheelY - this.y) / length);
    }

    get height() {
        return (this.wheelBack.y + this.wheelBack.height) - this.body.y - 30;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(ctx.canvas.width/2, this.y);
        ctx.rotate(this.angle);
        this.wheelFront.draw(ctx);
        this.wheelBack.draw(ctx);
        this.body.draw(ctx);
        ctx.restore();
        return this.x;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static get MAX_SPEED_X() {
        return 4;
    }

    static get ACCELERATION_RATE() {
        return 0.2;
    }
}

export default Car;