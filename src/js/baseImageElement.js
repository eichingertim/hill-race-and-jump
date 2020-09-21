class BaseImageElement {
    constructor(x, y, canvas, image) {
        this.x = x;
        this.y = y;
        this.ctx = canvas.getContext("2d");
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

}

export default BaseImageElement;