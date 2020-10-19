import Ground from "./ground.js"
import Car from "./car/car.js";
import Fuel from "./game/Fuel.js"

let canvas,
    ctx,
    ground,
    car,
    fuel,
    panX,
    currentAniimationFrameID;

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
    car.update(ground)
    panX = car.draw(ctx);

    fuel.update();
    fuel.draw(ctx);

    cancelAnimationFrame(currentAniimationFrameID)
    currentAniimationFrameID = requestAnimationFrame(updateGameArea);
}

document.querySelector(".reset-icon").addEventListener("click", () => {
    document.querySelector(".game-over-screen").classList.add("hidden");
    setup();
})

function setup() {
    panX = 0;
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    ground = new Ground(canvas, images.grass);
    car = new Car(canvas.width/2, 100, canvas, images.body, images.wheel, images.player);
    fuel = new Fuel();

    car.addEventListener("CarDied", () => {
        document.querySelector(".game-over-screen").classList.remove("hidden");
        cancelAnimationFrame(currentAniimationFrameID);
    });

    car.addEventListener("Driving", (event) => {
        fuel.setDriving(event.data.isDriving);
    });

    car.addEventListener("CarJump", () => {
        fuel.decreaseForJump();
    })

    fuel.addEventListener("EmptyFuel", () => {
        document.querySelector(".game-over-screen").classList.remove("hidden");
        fuel.draw(ctx);
        cancelAnimationFrame(currentAniimationFrameID);
    })

    currentAniimationFrameID = requestAnimationFrame(updateGameArea);
}

