const Config = {
    CANVAS_WIDTH: 1080,
    CANVAS_HEIGHT: 720,
    GRASS_SPAWN_FROM: 50,
    GRASS_SPAWN_UNTIL: 90,
    GRASS_THICKNESS: 10,
    EDGES_SMOOTHNESS: 10,
    CAR: {
        
    },
    LEVELS: [
        "EASY",
        "MIDDLE",
        "HARD",
    ],
    
}

const LevelAttributes = {
    EASY: new function() {
        this.COURSE_LENGTH= 16*Config.CANVAS_WIDTH;
        this.TARGET_POS = this.COURSE_LENGTH - 700;
        this.RANGE_SPAWN_FUEL_FROM = 80;
        this.RANGE_SPAWN_FUEL_UNTIL = 200;
        this.RANGE_SPAWN_HOLES_FROM = 200;
        this.RANGE_SPAWN_HOLES_UNTIL = 400;
        this.HOLE_WIDTH_FROM = 250;
        this.HOLE_WIDTH_UNTIL = 330;
    },
    MIDDLE: new function() {
        this.COURSE_LENGTH = 20*Config.CANVAS_WIDTH;
        this.TARGET_POS = this.COURSE_LENGTH - 700;
        this.RANGE_SPAWN_FUEL_FROM = 160;
        this.RANGE_SPAWN_FUEL_UNTIL = 280;
        this.RANGE_SPAWN_HOLES_FROM = 180;
        this.RANGE_SPAWN_HOLES_UNTIL = 300;
        this.HOLE_WIDTH_FROM = 270;
        this.HOLE_WIDTH_UNTIL = 360;
    },
    HARD: new function() {
        this.COURSE_LENGTH = 24*Config.CANVAS_WIDTH;
        this.TARGET_POS = this.COURSE_LENGTH - 700;
        this.RANGE_SPAWN_FUEL_FROM = 300;
        this.RANGE_SPAWN_FUEL_UNTIL = 420;
        this.RANGE_SPAWN_HOLES_FROM = 150;
        this.RANGE_SPAWN_HOLES_UNTIL = 260;
        this.HOLE_WIDTH_FROM = 300;
        this.HOLE_WIDTH_UNTIL = 400;
    },
}

export {Config, LevelAttributes};
export default Config;