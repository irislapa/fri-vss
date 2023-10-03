import { Vector } from "./Vector.js";
import { Bernstein } from "./Bernstein.js";

export class Bezier {

    constructor(points) {                // points = <Vector> Array
        this.arrV = points;
    }

    value(t) {
        let n = this.arrV.length-1;
        let result = this.arrV[0].mulScalar(new Bernstein(n, 0).value(t));
        for (let i = 1; i <= n; i++) {
            result = result.add(this.arrV[i].mulScalar(new Bernstein(n, i).value(t)));
        }
        return result;
    }

    derivative(t) {
        let n = this.arrV.length-1;
        let result = ((this.arrV[1].sub(this.arrV[0])).mulScalar(n)).mulScalar(new Bernstein(n-1, 0).value(t));
        for (let i = 1; i < n; i++) {
            result = result.add(((this.arrV[i+1].sub(this.arrV[i])).mulScalar(n)).mulScalar(new Bernstein(n-1, i).value(t)));
        }
        return result;
    }
}