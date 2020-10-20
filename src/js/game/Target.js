import {Observable, Event} from "../utils/Observable.js";
import {Config, LevelAttributes} from "../utils/Config.js";

class FinishEvent extends Event {
    constructor() {
        super(Config.EVENTS.FINSIH, null);
    }
}

class Target extends Observable {

    constructor(imgTarget, currentLevel, ground) {
        super();
        this.imgTarget = imgTarget;
        this.reset(currentLevel, ground);
    }

    reset(currentLevel, ground) {
        this.courseLength = LevelAttributes[currentLevel].COURSE_LENGTH;
        this.xPosCheckerdFlag = LevelAttributes[currentLevel].TARGET_POS;
        this.yPosCheckerdFlag = ground.getY(this.xPosCheckerdFlag);
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