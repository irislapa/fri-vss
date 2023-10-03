import { Bezier } from "./Bezier.js";
import { Vector } from "./Vector.js";
import { Bernstein } from "./Bernstein.js";
import { Spline } from "./Spline.js";

let bz0 = new Bezier([new Vector([1, 2]), new Vector([3, 4]), new Vector([5, 6]), new Vector([9, 9])]);
let bz1 = new Bezier([new Vector([7, 8]), new Vector([9, 10]), new Vector([11, 12]), new Vector([15, 15])]);
let bz2 = new Bezier([new Vector([13, 14]), new Vector([15, 16]), new Vector([17, 18]), new Vector([20, 20])]);
let bz3 = new Bezier([new Vector([10, 20]), new Vector([30, 40]), new Vector([50, 60]), new Vector([50, 60])]);

let ar = [bz0, bz1, bz2, bz3]

let sp = new Spline(ar);
let sp2 = new Spline(ar);

console.log("   ");
console.log("   ");
console.log("test Vector:");
const v1 = new Vector ([-9, 5, 7]);
const v2 = new Vector ([12, 8, 3]);
const v3 = new Vector ([10, 7]);
const v4 = new Vector ([8, 63.6]);
const v5 = new Vector ([3, 6, 98]);
const v6 = new Vector ([8, 3.5, 10]);
console.log("   ");
console.log("Vector.mul:");
console.log(v1.mul(v2));
console.log(v2.mul(v1));
console.log(v4.mul(v3));
console.log(v4.mul(v1));
console.log("   ");
console.log("Vector.add:");
console.log(v1.add(v2));
console.log(v2.add(v1));
console.log(v4.add(v3));
console.log(v4.add(v1));
console.log("   ");
console.log("Vector.div:");
console.log(v1.div(v2));
console.log(v2.div(v1));
console.log(v4.div(v3));
console.log(v4.div(v1));
console.log("   ");
console.log("Vector.sub:");
console.log(v4.sub(v1));
console.log(v1.sub(v2));
console.log(v2.sub(v1));
console.log(v4.sub(v3));
console.log("   ");
console.log("Vector.mulScalar:");
console.log(v1.mulScalar(3));
console.log(v2.mulScalar(3));
console.log(v3.mulScalar(3));
console.log(v4.mulScalar(3));
console.log("   ");
console.log("Vector.divScalar:");
console.log(v1.divScalar(3));
console.log(v2.divScalar(3));
console.log(v3.divScalar(3));
console.log(v4.divScalar(3));

console.log("   ");
console.log("   ");
console.log("____________________________________________________________");
console.log("   ");

let bezier1 = new Bezier([new Vector ([-9, 5, 7]), new Vector ([12, 8, 3]), new Vector ([3, 6, 98]), new Vector ([8, 3.5, 10])]);
console.log("test Bezier:");
console.log(bezier1.value(0));
console.log(bezier1.value(1));
console.log(bezier1.value(0.5));
console.log(bezier1.value(0.78));
console.log(bezier1.value(0.1));
console.log(bezier1.value(0.667));
console.log("Derivative:")
console.log(bezier1.derivative(0.5));
console.log(bezier1.derivative(0.78));
console.log(bezier1.derivative(0.1));
console.log(bezier1.derivative(0.667));


//console.log(sp);
console.log("                                                           ");
console.log("                                                           ");
console.log("                                                           ");
console.log("Vrednosti spline:");
console.log("                                                           ");
console.log("                                                           ");

console.log(sp.value(0));
console.log("                                                           ");
console.log(sp.value(0.5));
console.log("                                                           ");
console.log(sp.value(0.7));
console.log("                                                           ");
console.log(sp.value(1.2));
console.log("                                                           ");
console.log(sp.value(1.8));
console.log("                                                           ");
console.log(sp.value(1.9));
console.log("                                                           ");
console.log(sp.value(2));
console.log("                                                           ");
console.log(sp.value(2.3));
console.log("                                                           ");
console.log(sp.value(2.7));
console.log("                                                           ");
console.log(sp.value(3.5));
console.log("                                                           ");
console.log(sp.value(3.7));
console.log("                                                           ");
console.log(sp.value(4));

console.log("                                                           ");
console.log("                                                           ");
console.log("                                                           ");
console.log("----------------------------------------------------------")
console.log("                                                           ");

console.log("Odvodi spline:");
console.log("                                                           ");
console.log("                                                           ");
console.log("                                                           ");
console.log(sp.derivative(0));
console.log("                                                           ");
console.log(sp.derivative(0.5));
console.log("                                                           ");
console.log(sp.derivative(1.7));
console.log("                                                           ");
console.log(sp.derivative(2.3));
console.log("                                                           ");
console.log(sp.derivative(2.8));
console.log("                                                           ");
console.log(sp.derivative(3.4));
console.log("                                                           ");
console.log(sp.derivative(3.7));

console.log("                                                           ");
console.log("                                                           ");
console.log("----------------------------------------------------------")
console.log("                                                           ");

console.log("Make continuous spline");
console.log("                                                           ");
console.log("                                                           ");


sp.makeContinuous();

console.log(sp.curves[0].arrV[0]);
console.log("                                                           ");
console.log(sp.curves[0].arrV[3]);
console.log("                                                           ");
console.log(sp.curves[1].arrV[0]);
console.log("                                                           ");
console.log(sp.curves[1].arrV[3]);
console.log("                                                           ");
console.log(sp.curves[2].arrV[0]);
console.log("                                                           ");
console.log(sp.curves[2].arrV[3]);
console.log("                                                           ");
console.log(sp.curves[3].arrV[0]);
console.log("                                                           ");
console.log(sp.curves[3].arrV[3]);
console.log("                                                           ");
console.log(sp.curves[0].arrV[2]);
console.log("                                                           ");
console.log(sp.curves[1].arrV[2]);
console.log("                                                           ");
console.log(sp.curves[1].arrV[1]);
console.log("                                                           ");
console.log(sp.curves[2].arrV[2]);
console.log("                                                           ");
console.log(sp.curves[2].arrV[1]);
console.log("                                                           ");
console.log(sp.curves[3].arrV[1]);

console.log("                                                           ");
console.log("                                                           ");
console.log("----------------------------------------------------------")
console.log("                                                           ");
console.log("                                                           ");

console.log("Make smooth");
console.log("                                                           ");

sp2.makeSmooth();

console.log(sp2.curves[0].arrV[0]);
console.log("                                                           ");
console.log(sp2.curves[0].arrV[3]);
console.log("                                                           ");
console.log(sp2.curves[1].arrV[0]);
console.log("                                                           ");
console.log(sp2.curves[1].arrV[3]);
console.log("                                                           ");
console.log(sp2.curves[2].arrV[0]);
console.log("                                                           ");
console.log(sp2.curves[2].arrV[3]);
console.log("                                                           ");
console.log(sp2.curves[3].arrV[0]);
console.log("                                                           ");
console.log(sp2.curves[3].arrV[3]);
console.log("                                                           ");
console.log(sp2.curves[0].arrV[2]);
console.log("                                                           ");
console.log(sp2.curves[1].arrV[2]);
console.log("                                                           ");
console.log(sp2.curves[1].arrV[1]);
console.log("                                                           ");
console.log(sp2.curves[2].arrV[2]);
console.log("                                                           ");
console.log(sp2.curves[2].arrV[1]);
console.log("                                                           ");
console.log(sp2.curves[3].arrV[1]);
