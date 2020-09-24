import Ground from "./ground.js"
import Car from "./car/car.js";

let canvas,
    ctx,
    ground,
    car;

let imageFiles = ["body", "wheel", "grass", "player"];

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
    
    let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0, "#39cce6");
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ground.draw(ctx, panX);
    car.update(ground);
    panX = car.draw(ctx);

    requestAnimationFrame(updateGameArea)
}

function setup() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    ground = new Ground(canvas, images.grass);

    car = new Car(canvas.width/2, 100, canvas, images.body, images.wheel, images.player);

    requestAnimationFrame(updateGameArea);
}

