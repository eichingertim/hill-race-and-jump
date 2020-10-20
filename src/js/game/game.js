import {Config, LevelAttributes} from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";
import Ground from "./ground.js";
import Car from "../car/car.js";
import Fuel from "./Fuel.js";
import Target from "./Target.js";
import StopWatch from "./stopwatch.js";

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
    game.views.btnReset.addEventListener("click", () => {
        game.views.gameOverScreen.classList.add("hidden");
        game.views.canvas.classList.remove("hidden");
        game.car.reset(game.currentLevel);
        game.ground.reset(game.currentLevel);
        game.fuel.reset();
        game.stopwatch.reset();
        game.stopwatch.start();
        game.panX = 0;
    });

    game.views.btnBackToMenu.addEventListener("click", () => {
        cancelAnimationFrame(game.currentAnimFrameId);
        cancelAnimationFrame(game.currentAnimFrameId);
        game.notifyAll(new BackToMenuEvent());
    });

    
    
    game.car.addEventListener(Config.EVENTS.CAR_DIED, () => {
        game.views.winLooseMsg.innerHTML = Config.MSG_DEAD;
        game.stopwatch.stop();
        game.views.timeMsg.innerHTML = "TIME: " + game.stopwatch.getTime();
        cancelAnimationFrame(game.currentAnimFrameId);
        cancelAnimationFrame(game.currentAnimFrameId);
        game.isDriving = false;
        game.soundDrive.pause();
        game.car.stop();
        game.views.canvas.classList.add("hidden");
        game.views.gameOverScreen.classList.remove("hidden");
    });

    game.car.addEventListener(Config.EVENTS.DRIVE_STATE_CHANGED, (event) => {
        updateSound(game, event.data.isDriving);
        game.fuel.setDriving(event.data.isDriving);
    });

    game.car.addEventListener(Config.EVENTS.CAR_JUMP, () => {
        game.fuel.decreaseForJump();
    });

    game.car.addEventListener(Config.EVENTS.COLLECTED_FUEL, () => {
        game.fuel.collectedFuel();
    });

    game.fuel.addEventListener(Config.EVENTS.EMPTY_FUEL, () => {
        game.car.die();
        game.car.stop();
        game.fuel.draw(game.ctx);
    });

    game.target.addEventListener(Config.EVENTS.FINSIH, () => {
        game.stopwatch.stop();
        game.views.timeMsg.innerHTML = "TIME: " + game.stopwatch.getTime();
        game.views.winLooseMsg.innerHTML = Config.MSG_WON;
        game.car.stop();
        game.views.canvas.classList.add("hidden");
        game.views.gameOverScreen.classList.remove("hidden");
        cancelAnimationFrame(game.currentAnimFrameId);
    });
}

class BackToMenuEvent extends Event {
    constructor() {
        super(Config.EVENTS.BACK_TO_MENU, null);
    }
}

class Game extends Observable{

    constructor(images, currentLevel, views) {
        super();
        currentGame = this;
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        this.views = views;
        this.panX = 0;   
        this.isDriving = false; 
        this.currentLevel = currentLevel || "EASY";
        
        this.ground = new Ground(this.canvas, images.grass, images.fuel_tank, this.currentLevel);
        this.car = new Car(this.canvas.width/2, 100, canvas, images.body, images.wheel, images.player, currentLevel);
        this.fuel = new Fuel();
        this.target = new Target(images.finish_flag, this.currentLevel, this.ground);
        this.stopwatch = new StopWatch();
        this.stopwatch.start();
        
        this.setupSounds();
        addListeners(this);
        this.currentAnimFrameId = requestAnimationFrame(this.updateGameArea);
    }

    setupSounds() {
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
        this.stopwatch.reset();
        this.stopwatch.start();
        this.fuel.reset();
        this.panX = 0;
        this.target.reset(currentLevel, this.ground);
        this.currentAnimFrameId = requestAnimationFrame(this.updateGameArea);
    }

    updateGameArea() {
        currentGame.ctx.clearRect(0,0, currentGame.canvas.width, currentGame.canvas.height);
        
        //Background Sky
        let grd = currentGame.ctx.createLinearGradient(0, 0, 0, currentGame.canvas.height);
        grd.addColorStop(0, Config.SKY_GRAD_START);
        grd.addColorStop(1, Config.SKY_GRAD_END);
        currentGame.ctx.fillStyle = grd;
        currentGame.ctx.fillRect(0,0, currentGame.canvas.width, currentGame.canvas.height);
    
        currentGame.ground.draw(currentGame.ctx, currentGame.panX);
        currentGame.car.update(currentGame.ground, currentGame.target);
        currentGame.panX = currentGame.car.draw(currentGame.ctx);
        currentGame.fuel.update();
        currentGame.fuel.draw(currentGame.ctx);
        currentGame.target.draw(currentGame.ctx, currentGame.panX);
        currentGame.stopwatch.draw(currentGame.ctx);

        //Sound
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
        } else {
            currentGame.soundSpeedUp.pause();
            currentGame.soundDrive.pause();
        }
    
        cancelAnimationFrame(currentGame.currentAnimFrameId)
        currentGame.currentAnimFrameId = requestAnimationFrame(currentGame.updateGameArea);
    }


}

export default Game;