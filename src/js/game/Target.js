import {Observable, Event} from "../utils/Observable.js";

class FinishEvent extends Event {
    constructor() {
        super("Finish", null);
    }
}

class Target extends Observable {

    constructor(imgTarget, courseLength, xPosCheckerdFlag, ground) {
        super();
        this.imgTarget = imgTarget;
        this.courseLength = courseLength;
        this.xPosCheckerdFlag = xPosCheckerdFlag;
        this.yPosCheckerdFlag = ground.getY(xPosCheckerdFlag);
    }

    targetDetection(data) {
        if (data.rightBorder >= this.xPosCheckerdFlag + 200) {
            this.notifyAll(new FinishEvent());
        }
    }

    draw(ctx, panX) {
        let x = this.xPosCheckerdFlag - panX + ctx.canvas.width/2, 
        y =  this.yPosCheckerdFlag - 120;
        ctx.drawImage(this.imgTarget, x, y, 150, 100);
    }

}

export default Target