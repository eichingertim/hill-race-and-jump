class Base {
    constructor(x, y, canvas, image, width, height) {
        this.x = x;
        this.y = y;
        this.ctx = canvas.getContext("2d");
        this.image = image;
        this.width = width || image.width;
        this.height = height || image.width;
    }

}

export default Base;