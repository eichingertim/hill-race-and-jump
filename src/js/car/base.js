class Base {
    constructor(x, y, image, width, height) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = width || image.width;
        this.height = height || image.width;
    }

}

export default Base;