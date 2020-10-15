class Map {

    static map(n, start1, stop1, start2, stop2) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;

        if (start2 < stop2) {
            return this.constrain(newval, start2, stop2);
        } else {
            return this.constrain(newval, stop2, start2);
        }
    }

    static constrain(n, low, high) {
        return Math.max(Math.min(n, high), low);
    }
}

export default Map;