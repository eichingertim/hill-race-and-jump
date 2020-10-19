import Ground from "./ground.js"
import Car from "./car/car.js";
import Fuel from "./game/Fuel.js"
import Target from "./game/Target.js";

const COURSE_LENGTH = 20*1080,
    POS_CHECKERED_FLAG = COURSE_LENGTH - 700;

let canvas, ctx,
    ground,car,
    fuel,panX, target,
    currentAniimationFrameID;

const imageFiles = ["body", "wheel", "grass", "player", "fuel_tank", "finish_flag"];

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
    car.update(ground, target);
    panX = car.draw(ctx);

    fuel.update();
    fuel.draw(ctx);

    target.draw(ctx, panX);

    cancelAnimationFrame(currentAniimationFrameID)
    currentAniimationFrameID = requestAnimationFrame(updateGameArea);
}

function setup() {
    let resetBtns = document.querySelectorAll(".reset-icon");
    resetBtns.forEach((img) => {
        img.addEventListener("click", () => {
            console.log("Reset");
            document.querySelector(".game-over-screen").classList.add("hidden");
            document.querySelector(".game-won-screen").classList.add("hidden");
            setup();
        });
    })
    panX = 0;
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    ground = new Ground(canvas, images.grass, images.fuel_tank, COURSE_LENGTH);
    car = new Car(canvas.width/2, 100, canvas, images.body, images.wheel, images.player);
    fuel = new Fuel();
    target = new Target(images.finish_flag, COURSE_LENGTH, POS_CHECKERED_FLAG, ground);

    car.addEventListener("CarDied", () => {
        document.querySelector(".game-over-screen").classList.remove("hidden");
        cancelAnimationFrame(currentAniimationFrameID);
    });

    car.addEventListener("Driving", (event) => {
        fuel.setDriving(event.data.isDriving);
    });

    car.addEventListener("CarJump", () => {
        fuel.decreaseForJump();
    });

    car.addEventListener("CollectedFuel", () => {
        fuel.collectedFuel();
    });

    fuel.addEventListener("EmptyFuel", () => {
        car.die();
        fuel.draw(ctx);
    });

    target.addEventListener("Finish", () => {
        car.stop();
        document.querySelector(".game-won-screen").classList.remove("hidden");
        cancelAnimationFrame(currentAniimationFrameID);
    })

    currentAniimationFrameID = requestAnimationFrame(updateGameArea);
}

