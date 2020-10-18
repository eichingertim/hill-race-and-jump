import Ground from "./ground.js"
import Car from "./car/car.js";

let canvas,
    ctx,
    ground,
    car,
    panX = 0;

const imageFiles = ["body", "wheel", "grass", "player"];

const images = loadImages(imageFiles, setup);

function loadImages(files, onAllLoaded) {
    let i, numLoading = files.length;
    const onload = () => --numLoading === 0 && onAllLoaded();
    const images = {};
    for (i = 0; i < files.length; i++) {
        const img = images[files[i]] = new Image;
        img.src = "images/" + files[i] + ".png";
        img.onload = onload;
    }
    return images;
}

function updateGameArea() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    //Background Sky
    let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grd.addColorStop(0, "#39cce6");
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    //Ground
    ground.draw(ctx, panX);

    //Car
    if (!car.update(ground)) {
        window.location.reload();
    }
    panX = car.draw(ctx);

    requestAnimationFrame(updateGameArea)
}

function setup() {
    console.log("Hello");
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    
    ground = new Ground(canvas, images.grass);
    car = new Car(canvas.width/2, 100, canvas, images.body, images.wheel, images.player);

    requestAnimationFrame(updateGameArea);
}

