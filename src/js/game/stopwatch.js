
class StopWatch {

    constructor() {
        this.startTime = new Date();
        this.currentDate = new Date();
        this.duration = new Date(this.currentDate - this.startTime);
        this.stopWatchRunning = false;
    }

    start() {
        let that = this;
        this.startTime = new Date();
        this.stopWatchRunning = true;
        setInterval(function() {
            if (that.stopWatchRunning === false) {
                return;
            }
            that.currentDate = new Date();
            that.duration = new Date(that.currentDate - that.startTime);
        }, 100);
    }

    stop() {
        this.stopWatchRunning = false;
    }

    getTime() {
        return this.duration.getMinutes() + ":" + this.duration.getSeconds() + ":" + this.duration.getMilliseconds();
    }

    reset() {
        this.stopWatchRunning = false;
        this.startTime = new Date();
        this.currentDate = new Date();
        this.duration = new Date(this.currentDate - this.startTime);
    }

    draw(ctx) {
        let timeStr = this.duration.getMinutes() + ":" + this.duration.getSeconds() + ":" + this.duration.getMilliseconds();
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.fillText(timeStr, 50, 50);
    }

}

export default StopWatch;