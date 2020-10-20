import {Config, LevelAttributes} from "../utils/Config.js";
import Ground from "./ground.js";
import Car from "../car/car.js";
import Fuel from "./Fuel.js";
import Target from "./Target.js";

let currentGame;

function addListeners(game) {
    let resetBtns = document.querySelectorAll(".reset-icon");
    resetBtns.forEach((img) => {
        img.addEventListener("click", () => {
            console.log("Reset");
            document.querySelector(".game-over-screen").classList.add("hidden");
            document.querySelector(".game-won-screen").classList.add("hidden");
            game.car.reset();
            game.ground.reset();
            game.fuel.reset();
            game.panX = 0;
        });
    })
    
    game.car.addEventListener("CarDied", () => {
        document.querySelector(".game-over-screen").classList.remove("hidden");
        cancelAnimationFrame(game.currentAniimationFrameID);
    });

    game.car.addEventListener("Driving", (event) => {
        game.fuel.setDriving(event.data.isDriving);
    });

    game.car.addEventListener("CarJump", () => {
        game.fuel.decreaseForJump();
    });

    game.car.addEventListener("CollectedFuel", () => {
        game.fuel.collectedFuel();
    });

    game.fuel.addEventListener("EmptyFuel", () => {
        game.car.die();
        game.car.stop();
        game.fuel.draw(game.ctx);
    });

    game.target.addEventListener("Finish", () => {
        game.car.stop();
        game.document.querySelector(".game-won-screen").classList.remove("hidden");
        cancelAnimationFrame(game.currentAniimationFrameID);
    });
}


class Game {

    constructor(images, currentLevel) {
        currentGame = this;
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        this.panX = 0;    
        this.currentLevel = currentLevel || "EASY";
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ground = new Ground(this.canvas, images.grass, images.fuel_tank, this.currentLevel);
        this.car = new Car(this.canvas.width/2, 100, canvas, images.body, images.wheel, images.player);
        this.fuel = new Fuel();
        this.target = new Target(images.finish_flag,LevelAttributes[this.currentLevel].COURSE_LENGTH, LevelAttributes[this.currentLevel].TARGET_POS, this.ground);
        addListeners(this);
        this.currentAniimationFrameID = requestAnimationFrame(this.updateGameArea);
    }

    updateGameArea() {
        currentGame.ctx.clearRect(0,0, currentGame.canvas.width, currentGame.canvas.height);
        
        //Background Sky
        let grd = currentGame.ctx.createLinearGradient(0, 0, 0, currentGame.canvas.height);
        grd.addColorStop(0, "#39cce6");
        grd.addColorStop(1, "white");
        currentGame.ctx.fillStyle = grd;
        currentGame.ctx.fillRect(0,0, currentGame.canvas.width, currentGame.canvas.height);
    
        //Ground
        currentGame.ground.draw(currentGame.ctx, currentGame.panX);
    
        //Car
        currentGame.car.update(currentGame.ground, currentGame.target);
        currentGame.panX = currentGame.car.draw(currentGame.ctx);
    
        currentGame.fuel.update();
        currentGame.fuel.draw(currentGame.ctx);
    
        currentGame.target.draw(currentGame.ctx, currentGame.panX);
    
        cancelAnimationFrame(currentGame.currentAniimationFrameID)
        currentGame.currentAniimationFrameID = requestAnimationFrame(currentGame.updateGameArea);
    }


}

export default Game;