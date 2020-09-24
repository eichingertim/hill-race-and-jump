import Body from "./body.js";
import Player from "./player.js";
import Wheel from "./wheel.js";

class Car {
    constructor(x, y, canvas, imgBody, imgWheel, imgPlayer) {
        this.canvas = canvas;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.player = new Player(x, y, canvas, imgPlayer);
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
        this.speedX += this.accelerate * Car.ACCELERATION_RATE + this.decelerate * -Car.ACCELERATION_RATE;
        this.speedX = Car.clamp(this.speedX, -Car.MAX_SPEED_X, Car.MAX_SPEED_X);

        this.x += this.speedX;
        this.x = Car.clamp(this.x, 0, 20 * this.canvas.width);

        if (this.y + 10 >= ground.getY(this.x) - 30) this.y = ground.getY(this.x) - 30;
        else {
            this.y += 10
        }
        

        let length = 125;

        let frontWheelY = ground.getY(this.x + 125) - 30;

        this.angle = Math.atan((frontWheelY - this.y) / length);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(ctx.canvas.width/2, this.y);
        ctx.rotate(this.angle);

        this.player.draw(ctx);
        this.wheelFront.draw(ctx, true);
        this.wheelBack.draw(ctx, false);
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