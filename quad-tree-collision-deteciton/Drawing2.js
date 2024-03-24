import { QuadTree } from "./QuadTree.js";
import { Quad } from "./Quad.js";
import { Point } from "./Point.js";

//let addingPoints = false;

function addPoints(ctx, allPoints, qt, n) {
    //if (maxPoints <= pointCount) {
    //    return;
    //}
    if (allPoints.length < n) {
        let nn = n - allPoints.length;
        for (let i = 0; i < nn ; i++) {
            let p = new Point (Math.random() * 700, Math.random() * 700);
            qt.insertPoint(p);
            drawPoint(ctx, p);
            allPoints.push(p);
        }
    }
    else {
        allPoints = [];
        for (let i = 0; i < n ; i++) {
            let p = new Point (Math.random() * 700, Math.random() * 700);
            qt.insertPoint(p);
            drawPoint(ctx, p);
            allPoints.push(p);
        }
    }
    return allPoints;
}

function drawPoint(ctx, point) {
    ctx.strokeStyle = point.color;
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawQuads(ctx, qt) {
    for (let i = 0; i < qt.quads.length; i++) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.rect(qt.quads[i].quad.x, qt.quads[i].quad.y, qt.quads[i].quad.w, qt.quads[i].quad.h);
        ctx.stroke();
    }
}

function drawTree(ctx, qt) {
    if (!qt.subdivided) {
        return;
    }
    drawQuads(ctx, qt);
    drawTree(ctx, qt.quad1);
    drawTree(ctx, qt.quad2);
    drawTree(ctx, qt.quad3);
    drawTree(ctx, qt.quad4);
}

function premakniTocke(ctx, qt, allPoints) {
    const qt2 = new QuadTree(qt.quad, qt.n);
    for (let i = 0; i < allPoints.length; i++) {
        allPoints[i].move();
        qt2.insertPoint(allPoints[i]);

        drawPoint(ctx, allPoints[i]);
    }

    return qt2;
}

function narisiFrame(ctx, qt, allPoints, drawGrid) {
    ctx.clearRect(0, 0, 700, 700);
    let qt2 = premakniTocke(ctx, qt, allPoints);
    if (drawGrid) {
        drawTree(ctx, qt2);
    }


}

function loop(ctx, canvas, qt, allPoints, drawGrid, n) {
    //drawTree(ctx, qt);
    let initialN = n;
    n = parseInt(document.getElementById("points").value);
    if (initialN != n) {
        allPoints = addPoints(ctx, allPoints, qt, n);
    }
    drawGrid = document.getElementById("grid").checked;

    narisiFrame(ctx, qt, allPoints, drawGrid);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(0, 0, 700, 700);
    ctx.stroke();
    window.requestAnimationFrame(function(){loop(ctx, canvas, qt, allPoints, drawGrid, n)});
}

window.addEventListener("load", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.heigth = 700;
    canvas.width = 700;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
    let rect = new Quad(0, 0, 700, 700);
    const qt = new QuadTree(rect, 4);
    //let addingPoints = false;
    /* canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", addPoints); */
    //document.querySelector('.messageCheckbox').checked;
    //let drawGrid = document.querySelector('.grid:checked').value;

    let drawGrid = document.getElementById("grid").checked;
    let allPoints = [];
    let n = parseInt(document.getElementById("points").value);
    allPoints = addPoints(ctx, allPoints, qt, n);
    loop(ctx, canvas, qt, allPoints, n);
    window.requestAnimationFrame(function(){loop(ctx, canvas, qt, allPoints, drawGrid, n)});
});