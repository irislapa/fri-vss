import { Quad } from "./Quad.js";
import { Point } from "./Point.js";


export class QuadTree {

    constructor(quad, n) {
        this.n = n;         //number of points in square (how far the reccursion will go)
        this.quad = quad;   // parrent rectangle
        this.points = [];   // list of points in the current rectangle
        this.quads = [];    // list of child rectangles
    }
    getQuad() {
        return this.quad;
    }

    getQuads() {
        return this.quads;
    }

    // Divides a rectangle into 4 (children) quad trees
    subdivide() {
        let kv1 = new Quad(this.quad.x + this.quad.w/2, this.quad.y, this.quad.w/2, this.quad.h/2);
        this.quad1 = new QuadTree(kv1, this.n);
        this.quads.push(this.quad1);

        let kv2 = new Quad(this.quad.x, this.quad.y, this.quad.w/2, this.quad.h/2);
        this.quad2 = new QuadTree(kv2, this.n);
        this.quads.push(this.quad2);

        let kv3 = new Quad(this.quad.x, this.quad.y + this.quad.h/2, this.quad.w/2, this.quad.h/2);
        this.quad3 = new QuadTree(kv3, this.n);
        this.quads.push(this.quad3);

        let kv4 = new Quad(this.quad.x + this.quad.w/2, this.quad.y + this.quad.h/2, this.quad.w/2, this.quad.h/2);
        this.quad4 = new QuadTree(kv4, this.n);
        this.quads.push(this.quad4);

        this.subdivided = true;
    }

    didCollide(point1, point2) {
        return (((point1.x + 2 >= point2.x) && (point1.x - 2 <= point2.x)) &&
        ((point1.y + 2 >= point2.y) && (point1.y - 2 <= point2.y)));
    }

    //Recursively calls subdivide(), untill there is not more than n points left in 1 quad tree
    //If there is less points than n in 1 rectangle, then check for collisions
    insertPoint(point) {
        if (!this.quad.containsPoint(point)){
            return;
        }
        if (this.points.length < this.n) {
            this.points.push(point);
            point.healed();
            if (!this.subdivided) {
                for (let i = 0; i < this.points.length; i++) {
                    for (let j = 0; j < this.points.length; j++) {
                        if (this.didCollide(this.points[i], this.points[j]) && i != j) {
                            this.points[i].collided();
                            this.points[j].collided();
                        }
                    }
                }


            }
        }
        else {
            if (!this.subdivided) {
                this.subdivide();
                this.subdivided = true;
            }

            this.quad1.insertPoint(point);
            this.quad2.insertPoint(point);
            this.quad3.insertPoint(point);
            this.quad4.insertPoint(point);
        }
    }
}

