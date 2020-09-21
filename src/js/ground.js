class Ground {
    constructor(canvas) {
        this.context = canvas.getContext("2d");

        let { width, height } = canvas.getBoundingClientRect();
        
        this.width = width;
        this.height = 50;
        this.x = 0
        this.y = height - this.height;
    }

    draw() {
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

}

export default Ground;