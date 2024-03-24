import { Vector } from "./Vector.js";
import { Bernstein } from "./Bernstein.js";
import { Bezier } from "./Bezier.js";

export class Spline {
    constructor(curves) {
        this.curves = curves;
    }

    value(t) {
        let numOfCurves = this.curves.length;
        if (t == this.curves.length) {
            return this.curves[numOfCurves-1].arrV[this.curves[numOfCurves-1].arrV.length-1];
        }
        let indexOfcurve = t|0;
        let bezier = this.curves[indexOfcurve];
        return bezier.value(t-indexOfcurve);
    }

    derivative(t) {
        let numOfCurves = this.curves.length;
        if (t == this.curves.length) {
            return this.curves[numOfCurves-1].arrV[this.curves[numOfCurves-1].arrV.length-1];
        }
        let indexOfcurve = t|0;
        let bezier = this.curves[indexOfcurve];
        return bezier.derivative(t-indexOfcurve);
    }

    makeContinuous() {
        for (let i = 0; i < this.curves.length-1; i++) {  //cez seznam krivulj

            let trnBezier = this.curves[i];
            let naslBezier = this.curves[i+1];

            let prva = trnBezier.value(1);                           // zadnja tocka prve krivulje
            let druga = naslBezier.value(0);                        // prva tocka druge krivulje

            trnBezier.arrV[trnBezier.arrV.length -1] = (prva.add(druga)).divScalar(2);
            naslBezier.arrV[0] = (prva.add(druga)).divScalar(2);
        }
    }

    makeSmooth() {

        for (let i = 0; i < this.curves.length-1; i++) {  //cez seznam krivulj

            let trnBezier = this.curves[i];
            let naslBezier = this.curves[i+1];

            let prva = trnBezier.derivative(1);
            let druga = naslBezier.derivative(0);
            let artSrOdv = (prva.add(druga)).divScalar(2);

            let n = trnBezier.arrV.length-1;
            let nasln = naslBezier.arrV.length-1;

            trnBezier.arrV[n-1] = (trnBezier.arrV[n]).sub(artSrOdv.divScalar(n));
            naslBezier.arrV[1] = (artSrOdv.divScalar(nasln)).add(naslBezier.arrV[0]);

        }
    }
}