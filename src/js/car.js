import Body from "./body.js";
import Wheel from "./wheel.js";

let instance;

const MAX_SPEED_X = 4;

class Car {
    constructor(x, y, canvas, imgBody, imgWheel) {
        this.canvas = canvas;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0.2;
        this.gravitySpeed = 0;
        this.x = x;
        this.y = y;
        this.body = new Body(x, y, canvas, imgBody);
        this.wheelFront = new Wheel(x + 136, y + 85, canvas, imgWheel);
        this.wheelBack = new Wheel( x + 13, y + 85, canvas, imgWheel);
        this.isKeyDown = false;
        instance = this;

        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') {   
                instance.isKeyDown = true;
                if (instance.speedX + 0.5 > MAX_SPEED_X) {
                    instance.speedX = MAX_SPEED_X;
                } else {
                    instance.speedX += 0.5
                }
            } else if (event.key === 'ArrowLeft') {
                instance.isKeyDown = true;
                if (instance.speedX - 0.5 < (-MAX_SPEED_X)) {
                    instance.speedX = -MAX_SPEED_X;
                } else {
                    instance.speedX -= 0.5
                }
            }
        });

        document.addEventListener('keyup', function(event) {
            if (event.key === 'ArrowRight') { 
                instance.isKeyDown = false;
            } else if (event.key === 'ArrowLeft') {
                instance.isKeyDown = false;
            }
        });
    }

    update(groundY) {
        if (!this.isKeyDown) {
            
            console.log(instance.speedX);
            if (instance.speedX < 0) {
                if (instance.speedX + 0.1 > 0) {
                    instance.speedX = 0;
                } else {
                    instance.speedX += 0.1;
                }
            } else {
                if (instance.speedX - 0.1 < 0) {
                    instance.speedX = 0;
                } else {
                    instance.speedX -= 0.1;
                }
            }
        }
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom(groundY);
        this.body.update(this.x, this.y);
        this.wheelFront.update(this.x + 136, this.y + 85);
        this.wheelBack.update(this.x + 13, this.y + 85);
    }

    get height() {
        return (this.wheelBack.y + this.wheelBack.height) - this.body.y - 30;
    }

    hitBottom(groundY) {
        var rockbottom = this.canvas.height - groundY - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
            }
    }

    draw() {
        this.wheelFront.draw();
        this.wheelBack.draw();
        this.body.draw();
    }
}

export default Car;