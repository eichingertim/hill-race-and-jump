import Ground from "./ground.js"
import Car from "./car.js";

let canvas,
    ctx,
    ground,
    car;

let imageFiles = ["body", "wheel"];

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


const images = loadImages(imageFiles, setup);
let panX = 0;
function updateGameArea() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    //panX += 2;
    ground.draw(ctx, panX);
    let pos = car.x - (car.x % 10);
    let next = pos + 1;
    let interpolation = car.x % 10 ? (10/(car.x % 10)) * (ground.vectors[next].y - ground.vectors[pos].y) : 0;
    console.log(pos, ground.vectors[pos].y, interpolation, ground.vectors[next].y);
    car.update(ground.vectors[pos].y + interpolation);
    //console.log(car.x);
    panX = car.draw(ctx);
    requestAnimationFrame(updateGameArea)
}

function setup() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    ground = new Ground(canvas);

    car = new Car(70, 100, canvas, images.body, images.wheel);

    requestAnimationFrame(updateGameArea);
}

