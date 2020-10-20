import Body from "./body.js";
import Player from "./player.js";
import Wheel from "./wheel.js";
import {Observable, Event} from "../utils/Observable.js";
import {Config, LevelAttributes} from "../utils/Config.js";

function updateX(car, ground) {
    let downHillAcceleration = (Car.GRAVITY * Math.sin(car.angle)) / Car.CLEAN_NEWTON,
            acceleration = car.accelerate * Car.ACCELERATION_RATE + car.decelerate * -Car.ACCELERATION_RATE;
        car.speedX += (acceleration + car.firstStart*downHillAcceleration);

        if (acceleration !== 0) car.speedX = Car.clamp(car.speedX, -Car.MAX_SPEED_X, Car.MAX_SPEED_X);
        else car.speedX = Car.clamp(Car.brake(car.speedX, downHillAcceleration), -Car.MAX_SPEED_X, Car.MAX_SPEED_X);

        if (!car.isInHole(ground)) {
            car.x += car.speedX;
        }
        car.x = Car.clamp(car.x, 0, LevelAttributes[car.currenLevel].COURSE_LENGTH);

        car.rightBorderPos = car.x - 50 + car.body.image.width;
        car.LeftBorderPos = car.x - 50;
}

function updateY(car, ground) {
    let data = {
        right: car.rightBorderPos,
        left: car.LeftBorderPos,
    }
    if (ground.holeDetectionFull(data)) {
        if (car.y + Car.GRAVITY >= car.canvas.height) {
        } else car.y += Car.GRAVITY;
            
        if (car.wheelFront.y + Car.GRAVITY >= car.canvas.height){
        } else car.wheelFront.y += Car.GRAVITY;

    } else if (ground.holeDetectionFront(data)) {
        if (car.y + Car.GRAVITY >= ground.getY(car.x) - 30) car.y = ground.getY(car.x) - 30;
        else car.y += Car.GRAVITY;
            
        if (car.wheelFront.y + Car.GRAVITY >= car.canvas.height){
            //window.location.reload();
        } else car.wheelFront.y += Car.GRAVITY;

    } else {
        if (car.y + Car.GRAVITY >= ground.getY(car.x) - 30) {
            car.y = ground.getY(car.x) - 30;
        }
        else car.y += Car.GRAVITY;
            
        if (car.wheelFront.y + Car.GRAVITY >= ground.getY(car.x + Car.DISTANCE_BETWEEN_AXES) - 30){
            car.wheelFront.y = ground.getY(car.x + 125) - 30;
        } else car.wheelFront.y += Car.GRAVITY;
    }

    
}

class CarDiedEvent extends Event {
    constructor() {
        super("CarDied", null);
    }
}

class DrivingEvent extends Event {
    constructor(isDriving) {
        super("Driving", {isDriving: isDriving});
    }
}

class CarJumpEvent extends Event {
    constructor() {
        super("CarJump", null);
    }
}

class CollectedFuelEvent extends Event {
    constructor() {
        super("CollectedFuel", null);
    }
}

class Car extends Observable {
    constructor(x, y, canvas, imgBody, imgWheel, imgPlayer, currenLevel) {
        super();
        this.canvas = canvas;
        this.speedX = 0;
        this.x = x;
        this.y = y;
        this.currenLevel = currenLevel;
        this.isDead = false;

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

    isInHole(ground) {
        if (this.wheelFront.y > ground.getY(this.x + Car.DISTANCE_BETWEEN_AXES) - 30 
            && this.y > ground.getY(this.x) - 30) {
                return true;
        }
        return false;
    }

    update(ground, target) {
        updateX(this, ground);
        updateY(this, ground);

        if ((this.y + 30) > this.canvas.height) {
            this.die();
        }

        let data = {
            rightBorder: this.x + this.body.image.width - 30,
        }
        if (ground.fuelTankDetection(data)) {
            this.notifyAll(new CollectedFuelEvent());
        }
        target.targetDetection(data);

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
        console.log(this);
        document.addEventListener('keydown', (event) => {
            if(event.repeat) {
                return;
            }
            if (this.isDead) {
                return;
            }
            switch(event.key) {
                case 'ArrowRight':
                    console.log(this);
                    this.accelerate = true;
                    this.firstStart = true;
                    this.notifyAll(new DrivingEvent(true));
                    break;
                case 'ArrowLeft':
                    this.decelerate = true;
                    this.firstStart = true;
                    this.notifyAll(new DrivingEvent(true));
                    break;
                case ' ':
                    console.log("Jump");
                    this.jump();
                    break;
            }
        });
        document.addEventListener('keyup', (event) => {
            if(event.repeat) {
                return;
            }
            if (this.isDead) {
                return;
            }
            switch(event.key) {
                case 'ArrowRight':
                    this.accelerate = false;
                    this.notifyAll(new DrivingEvent(false));
                    break;
                case 'ArrowLeft':
                    this.decelerate = false;
                    this.notifyAll(new DrivingEvent(false));
                    break;
            }
        });
    }

    reset(currenLevel) {
        this.speedX = 0;
        this.x = canvas.width/2;
        this.y = 100;
        this.isDead = false;

        this.currenLevel = currenLevel;

        this.rightBorderPos = this.x + this.body.image.width;
        this.LeftBorderPos = this.x;

        this.player.reset(this.x, this.y);
        this.body.reset(this.x, this.y);
        this.wheelFront.reset(Car.DISTANCE_BETWEEN_AXES, this.y - 100);
        this.wheelBack.reset(0, this.y - 100);
        this.accelerate = false;
        this.decelerate = false;
        this.angle = 0;
        this.firstStart = false;
    }

    die() {
        this.isDead = true;
        this.notifyAll(new CarDiedEvent());
    }

    stop() {
        this.isDriving = true;
        this.speedX = 0;
        this.accelerate = false;
        this.decelerate = false;
    }

    jump() {
        this.notifyAll(new CarJumpEvent());
        this.y -= 400;
        this.wheelFront.y -= 400;
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
        return 0.7;
    }
}

export default Car;