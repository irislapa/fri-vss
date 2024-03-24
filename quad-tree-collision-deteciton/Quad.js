export class Quad {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;     // left upper vertice of rectangle T(x, y)
        this.w = w;     // width
        this.h = h;     // height
    }

    containsPoint(point){
        return (point.x > this.x &&
            point.x < this.x + this.w &&
            point.y > this.y &&
            point.y < this.y + this.h);
    }
}