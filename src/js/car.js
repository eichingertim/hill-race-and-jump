import Body from "./body.js";
import Wheel from "./wheel.js";

class Car {
    constructor(x, y, canvas, imgBody, imgWheel) {
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0.05;
        this.gravitySpeed = 0;
        this.x = x;
        this.y = y;
        this.body = new Body(x, y, canvas, imgBody);
        this.wheelFront = new Wheel(x + 136, y + 85, canvas, imgWheel);
        this.wheelBack = new Wheel( x + 13, y + 85, canvas, imgWheel);
    }

    update() {
        this.x += 1;
        this.y += 0;
        this.body.update(this.x, this.y);
        this.wheelFront.update(this.x + 136, this.y + 85);
        this.wheelBack.update(this.x + 13, this.y + 85);
    }

    draw() {
        this.wheelFront.draw();
        this.wheelBack.draw();
        this.body.draw();
    }
}

export default Car;