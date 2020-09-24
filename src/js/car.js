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
        this.wheelFront = new Wheel(x + 136, y + 85, canvas, imgWheel);
        this.wheelBack = new Wheel( x + 13, y + 85, canvas, imgWheel);
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

    update(groundY) {
        //sconsole.log(groundY);
        this.speedX += this.accelerate * Car.ACCELERATION_RATE + this.decelerate * -Car.ACCELERATION_RATE;
        this.speedX = Car.clamp(this.speedX, -Car.MAX_SPEED_X, Car.MAX_SPEED_X);
       //this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.x = Car.clamp(this.x, 0, 20 * this.canvas.width);
        //this.y += this.speedY + this.gravitySpeed;
        //this.hitBottom(groundY);
        this.y = groundY;
        //this.body.update(this.x, this.y);
        //this.wheelFront.update(this.x + 136, this.y + 85);
        this.wheelBack.update(this.x, this.y);

        if (this.isKeyDown) {
            return true;
        }
    }

    get height() {
        return (this.wheelBack.y + this.wheelBack.height) - this.body.y - 30;
    }

    draw(ctx, panX) {
        //this.wheelFront.draw();
        this.wheelBack.draw(ctx);
        //this.body.draw();
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