import Game from "./game/game.js"

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

function setup() {
    new Game(images, "HARD");
}



