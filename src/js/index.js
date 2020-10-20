import Game from "./game/game.js"
import Config from "./utils/Config.js"

let game,
    audioContext;
    

const imageFiles = ["body", "wheel", "grass", "player", "fuel_tank", "finish_flag"],
    images = loadImages(imageFiles, setup),
    views = {
        btnReset: document.querySelector(".reset-icon"),
        btnBackToMenu: document.querySelector(".back-icon"),
        gameOverScreen: document.querySelector(".game-over-screen"),
        gameMenuScreen: document.querySelector(".game-menu-screen"),
        canvas: document.querySelector("canvas"),
        winLooseMsg: document.querySelector("#win-loose-message"),
        timeMsg: document.querySelector("#time-message"),
    };

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

function setupListeners(menuTheme) {
    const soundOnOff = document.querySelector(".audio-icon");
    soundOnOff.addEventListener("click", (event) => {
        console.log(event);
        if (event.target.id === "off") {
            if (!audioContext) {
                audioContext = new AudioContext();
                const track = audioContext.createMediaElementSource(menuTheme);
                track.connect(audioContext.destination);
                menuTheme.loop = true;
            }  
            event.target.id = "on"
            soundOnOff.src = Config.PATH_IMG_SOUND_ON
            menuTheme.play();  
        } else {
            event.target.id = "off"
            soundOnOff.src = Config.PATH_IMG_SOUND_OFF
            menuTheme.pause();
        }
    });

    const difficultyBtns = document.querySelectorAll(".btn-difficulty");
    difficultyBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            views.canvas.classList.remove("hidden");
            views.gameMenuScreen.classList.add("hidden");
            if (game) {
                menuTheme.volume = 0.2;
                game.reset(event.target.value);
            } else {
                menuTheme.volume = 0.2;
                game = new Game(images, event.target.value, views);
                game.addEventListener(Config.EVENTS.BACK_TO_MENU, () => {
                    menuTheme.volume = 1;
                    views.canvas.classList.add("hidden");
                    views.gameOverScreen.classList.add("hidden");
                    views.gameMenuScreen.classList.remove("hidden");
                });
            }
            
        });
    });
}

function setup() {
    const menuTheme = document.querySelector("#menu-theme");
    setupListeners(menuTheme);    
}



