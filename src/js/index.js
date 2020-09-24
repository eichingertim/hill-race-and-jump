import Ground from "./ground.js"
import Car from "./car.js";

let canvas,
    ctx,
    ground,
    car;

let imageFiles = ["body", "wheel"];
const images = loadImages(imageFiles, setup);
let panX = 0;

function loadImages(files, onAllLoaded) {
    let i, numLoading = files.length;
    const onload = () => --numLoading === 0 && onAllLoaded();
    const images = {};
    for (i = 0; i < files.length; i++) {
        const img = images[files[i]] = new Image;
        img.src = "/src/images/" + files[i] + ".png";
        img.onload = onload;
    }
    return images;
}

function updateGameArea() {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    ground.draw(ctx, panX);
    car.update(ground);
    panX = car.draw(ctx);
    requestAnimationFrame(updateGameArea)
}

function setup() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    ground = new Ground(canvas);

    car = new Car(canvas.width/2, 100, canvas, images.body, images.wheel);

    requestAnimationFrame(updateGameArea);
}

