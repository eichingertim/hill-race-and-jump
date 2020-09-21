import Ground from "./ground.js"
import Car from "./car.js";

let canvas,
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

function updateGameArea() {
    canvas.getContext("2d").clearRect(0,0, 1080, 720);
    car.update();
    car.draw();
    ground.draw();
}

function setup() {
    canvas = document.querySelector("#canvas");

    ground = new Ground(canvas);
    ground.draw();

    car = new Car(70, 100, canvas, images.body, images.wheel);

    setInterval(updateGameArea, 20);
}

