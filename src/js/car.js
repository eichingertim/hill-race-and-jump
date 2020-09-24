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
        this.wheelFront = new Wheel(x + 125, y, canvas, imgWheel, 50, 50);
        this.wheelBack = new Wheel( x, y, canvas, imgWheel, 50, 50);
        this.accelerate = false;
        this.decelerate = false;
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

        

        let frontWheelY = ground.getY(this.x + 125) - 20;

        let angle = Math.tan((frontWheelY - this.y) / 125);
        
        this.body.update(this.y, angle);
        this.wheelFront.update(this.x, frontWheelY);
        this.wheelBack.update(this.x, this.y);

    }

    get height() {
        return (this.wheelBack.y + this.wheelBack.height) - this.body.y - 30;
    }

    draw(ctx) {
        this.wheelFront.draw(ctx);
        this.wheelBack.draw(ctx);
        this.body.draw(ctx);
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