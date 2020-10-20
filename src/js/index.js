import Game from "./game/game.js"

let game,
    audioContext;
    

const imageFiles = ["body", "wheel", "grass", "player", "fuel_tank", "finish_flag"],
    images = loadImages(imageFiles, setup);

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
            soundOnOff.src = "images/volume-on.svg"
            menuTheme.play();  
        } else {
            event.target.id = "off"
            soundOnOff.src = "images/volume-off.svg"
            menuTheme.pause();
        }
    });

    const difficultyBtns = document.querySelectorAll(".btn-difficulty");
    difficultyBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            document.querySelector("canvas").classList.remove("hidden");
            document.querySelector(".game-menu-screen").classList.add("hidden");
            if (game) {
                menuTheme.volume = 0.2;
                game.reset(event.target.value);
            } else {
                menuTheme.volume = 0.2;
                game = new Game(images, event.target.value);
                game.addEventListener("BackToMenu", () => {
                    menuTheme.volume = 1;
                    document.querySelector("canvas").classList.add("hidden");
                    document.querySelector(".game-over-screen").classList.add("hidden");
                    document.querySelector(".game-menu-screen").classList.remove("hidden");
                });
            }
            
        });
    });
}

function setup() {
    const menuTheme = document.querySelector("#menu-theme");
    setupListeners(menuTheme);
    
    
}



