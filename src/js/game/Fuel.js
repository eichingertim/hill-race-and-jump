import {Observable, Event} from "../utils/Observable.js";
import Config from "../utils/Config.js";

class EmptyFuelEvent extends Event {
    constructor() {
        super(Config.EVENTS.EMPTY_FUEL, null);
    }
}

class Fuel extends Observable {
    constructor() {
        super();
        this.isDriving = false;
        this.fuelStand = Fuel.DEFAULT_FUEL_STAND;
    }

    reset() {
        this.fuelStand = Fuel.DEFAULT_FUEL_STAND;
    }

    update() {
        if (this.isDriving) {
            if (this.fuelStand - Fuel.MEAN_DRIVE_CONSUME >= 0) {
                this.fuelStand -= Fuel.MEAN_DRIVE_CONSUME;
            } else {
                this.fuelStand = 0;
                this.notifyAll(new EmptyFuelEvent());
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = Fuel.ATTRIBUTES.OUTER_COLOR;
        ctx.fillRect(Fuel.ATTRIBUTES.OUTER_X, Fuel.ATTRIBUTES.OUTER_Y, 
            Fuel.ATTRIBUTES.OUTER_WIDTH, Fuel.ATTRIBUTES.OUTER_HEIGHT);
        ctx.fillStyle = Fuel.ATTRIBUTES.INNER_COLOR;

        let width = (this.fuelStand * Fuel.DEFAULT_FUEL_STAND_WIDTH) / Fuel.DEFAULT_FUEL_STAND;

        ctx.fillRect(Fuel.ATTRIBUTES.INNER_X, Fuel.ATTRIBUTES.INNER_Y, 
            width, Fuel.ATTRIBUTES.INNER_HEIGHT);
    }

    setDriving(isDriving) {
        this.isDriving = isDriving;
    }

    decreaseForJump() {
        if (this.fuelStand - Fuel.JUMP_CONSUME >= 0) {
            this.fuelStand -= Fuel.JUMP_CONSUME;
        } else {
            this.fuelStand = 0;
            this.notifyAll(new EmptyFuelEvent());
        }
    }

    collectedFuel() {
        this.fuelStand = Fuel.DEFAULT_FUEL_STAND;
    }

    static get ATTRIBUTES() { 
        return {
            OUTER_X: 50,
            OUTER_Y: 80,
            OUTER_WIDTH: 300,
            OUTER_HEIGHT: 50,
            OUTER_COLOR: "#000000",
            INNER_X: 55,
            INNER_Y: 85,
            INNER_HEIGHT: 40,
            INNER_COLOR: "#FDFD00",
        }
    }

    static get DEFAULT_FUEL_STAND_WIDTH() { return 290}

    static get JUMP_CONSUME() { return 10;}

    static get MEAN_DRIVE_CONSUME() { return 0.05;}

    static get DEFAULT_FUEL_STAND() { return 100;}
}

export default Fuel;