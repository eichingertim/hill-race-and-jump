import {Observable, Event} from "../utils/Observable.js";

class EmptyFuelEvent extends Event {
    constructor() {
        super("EmptyFuel", null);
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
        ctx.fillStyle = "#000000";
        ctx.fillRect(50, 50, 300, 50);
        ctx.fillStyle = "#FDFD00";

        let width = (this.fuelStand * Fuel.DEFAULT_FUEL_STAND_WIDTH) / Fuel.DEFAULT_FUEL_STAND;

        ctx.fillRect(55, 55, width, 40);
    }

    setDriving(isDriving) {
        this.isDriving = isDriving;
    }

    decreaseForJump() {
        console.log("SHEEESH");
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

    static get DEFAULT_FUEL_STAND_WIDTH() { return 290}

    static get JUMP_CONSUME() { return 10;}

    static get MEAN_DRIVE_CONSUME() { return 0.05;}

    static get DEFAULT_FUEL_STAND() { return 100;}
}

export default Fuel;