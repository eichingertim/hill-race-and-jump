import {Config, LevelAttributes} from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";
import Ground from "./ground.js";
import Car from "../car/car.js";
import Fuel from "./Fuel.js";
import Target from "./Target.js";

let audioContext, currentGame;

function updateSound(game, isDriving) {
    game.isDriving = isDriving;
    if (!isDriving) {
        game.shouldPlaySpeedUp = false;
        game.shouldPlayDrive = false;
        game.soundSpeedUp.pause();
        game.soundDrive.pause();
        game.soundSpeedDown.play();
    } else {
        game.shouldPlaySpeedUp = true;
        game.shouldPlayDrive = true;
    }
}

function addListeners(game) {
    let resetBtn = document.querySelector(".reset-icon"),
        backToMenu = document.querySelector(".back-icon");
    resetBtn.addEventListener("click", () => {
        document.querySelector(".game-over-screen").classList.add("hidden");
        document.querySelector("canvas").classList.remove("hidden");
        game.car.reset(game.currentLevel);
        game.ground.reset(game.currentLevel);
        game.fuel.reset();
        game.panX = 0;
    });
    backToMenu.addEventListener("click", () => {
        cancelAnimationFrame(game.currentAniimationFrameID);
        cancelAnimationFrame(game.currentAniimationFrameID);
        game.notifyAll(new BackToMenuEvent());
    });

    
    
    game.car.addEventListener("CarDied", () => {
        cancelAnimationFrame(game.currentAniimationFrameID);
        cancelAnimationFrame(game.currentAniimationFrameID);
        game.isDriving = false;
        game.soundDrive.pause();
        game.car,stop();
        document.querySelector("canvas").classList.add("hidden");
        document.querySelector(".game-over-screen").classList.remove("hidden");
    });

    game.car.addEventListener("Driving", (event) => {
        updateSound(game, event.data.isDriving);
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
        document.querySelector("canvas").classList.add("hidden");
        document.querySelector(".game-over-screen").classList.remove("hidden");
        cancelAnimationFrame(game.currentAniimationFrameID);
    });
}

class BackToMenuEvent extends Event {
    constructor() {
        super("BackToMenu", null);
    }
}

class Game extends Observable{

    constructor(images, currentLevel) {
        super();
        currentGame = this;
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        this.panX = 0;   
        this.isDriving = false; 
        this.currentLevel = currentLevel || "EASY";
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ground = new Ground(this.canvas, images.grass, images.fuel_tank, this.currentLevel);
        this.car = new Car(this.canvas.width/2, 100, canvas, images.body, images.wheel, images.player, currentLevel);
        this.fuel = new Fuel();
        this.target = new Target(images.finish_flag, this.currentLevel, this.ground);

        this.shouldPlaySpeedUp = true;
        this.shouldPlayDrive = true;
        this.soundSpeedUp = document.querySelector("#car-speed-up");
        this.soundDrive = document.querySelector("#car-driving");
        this.soundSpeedDown = document.querySelector("#car-speed-down");

        audioContext = new AudioContext();
        const track = audioContext.createMediaElementSource(this.soundDrive);
        track.connect(audioContext.destination);
        const track1 = audioContext.createMediaElementSource(this.soundSpeedDown);
        track1.connect(audioContext.destination);
        const track2 = audioContext.createMediaElementSource(this.soundSpeedUp);
        track2.connect(audioContext.destination);

        addListeners(this);
        this.currentAniimationFrameID = requestAnimationFrame(this.updateGameArea);
    }

    reset(currentLevel) {
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        this.panX = 0;   
        this.isDriving = false; 
        this.currentLevel = currentLevel || "EASY";
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.car.reset(currentLevel);
        this.ground.reset(currentLevel);
        this.fuel.reset();
        this.panX = 0;
        this.target.reset(currentLevel, this.ground);
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

        if(currentGame.isDriving) {
            if (currentGame.shouldPlaySpeedUp) {
                currentGame.soundSpeedUp.play();
                currentGame.shouldPlaySpeedUp = false;
            }

            if (currentGame.soundSpeedUp.ended && currentGame.shouldPlayDrive) {
                currentGame.soundDrive.loop = true;
                currentGame.soundDrive.play();
                currentGame.shouldPlaySpeedUp = false;
            }
        }
    
        cancelAnimationFrame(currentGame.currentAniimationFrameID)
        currentGame.currentAniimationFrameID = requestAnimationFrame(currentGame.updateGameArea);
    }


}

export default Game;