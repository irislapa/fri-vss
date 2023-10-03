export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 0.2;
        this.direction = (Math.random() * 360);
        this.color = "blue";
    }

    outOf360(){
        if (this.direction >= 360) {
            this.direction += -360
        }
        if (this.direction <= -360) {
            this.direction += 360
        }
    }

    move() {
        let min = 0;
        let max = 700;
        if (this.x >= max) {
            this.direction = 180 - this.direction;
            this.outOf360();
        }
        if (this.y >= max) {
            this.direction = 360 - this.direction;
            this.outOf360();
        }
        if (this.x <= min) {
            this.direction = this.direction - 180;
            this.outOf360();
        }
        if (this.y < min) {
            this.direction = this.direction - 180;
            this.outOf360();
        }
        this.y += this.velocity * Math.sin(this.direction * (Math.PI/180));
        this.x += this.velocity * Math.cos(this.direction * (Math.PI/180));
        this.outOf360();
    }

    collided() {
        this.color = "red";
    }

    healed() {
        this.color = "blue";
    }

}