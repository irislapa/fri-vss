import { Vector } from "./Vector.js"
import { Bezier } from "./Bezier.js"
import { Spline } from "./Spline.js";

// SETTINGS
let accuracy = (1 / window.screen.width);

// canvas
let canvas,
    ctx;

// SPLINE
let splines = [],
    currentSpline;

// START:

initCanvas();

function initCanvas() {  // initialize canvas
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    newSpline();

    canvas.addEventListener("mouseup", function (e) {
        if (!movePoints) {
            setAprox(e);
        }
    });

    canvas.addEventListener("mousedown", function (e) {
        if (!movePoints) {
            setInter(e);
        }
    });
    initButtons();
}

function initButtons() {   //initialize buttons
    let colorChoose = document.getElementById("color");
    let deleteButton = document.getElementById("erase");

    buttonNew.addEventListener("click", function (e) {
        newSpline();
    })

    buttonColor.addEventListener("click", function (e) {
        splines[currentSpline].color = document.getElementById("colorChoose").value;
        redrawSplines();
        drawSpline(currentSpline);
    })

    colorChoose.addEventListener("input", function (e) {
        splines[currentSpline].color = colorChoose.value;
        chanageDrawColor();
    })

    deleteButton.addEventListener("click", function (e) {
        deleteSpline();
    });
}

function toggleMoveSwitch(e) {
    if (e.target.checked) {
        movePoints = true;
    } else {
        movePoints = false;
    }
}



function newSpline() {
    splines.push({
        spl: new Spline([]),
        color: document.getElementById("colorChoose").value,
        init: false,
        x0: null,
        y0: null,
        x1: null,
        y1: null,
        x2: null,
        y2: null,
        x3: null,
        y3: null,
        divList: [],
        divInit: false,
        deleted: false
    });

    let colorPick = document.getElementById("colorChoose");
    currentSpline = splines.length - 1;  // chanage current editing spline to last created
    chanageEditing();

    // add to spline list
    const ul = document.getElementById("list-splines");
    const li = document.createElement("li");

    li.appendChild(document.createTextNode("Spline" + currentSpline));
    li.setAttribute("id", currentSpline);
    li.addEventListener("mousedown", function (e) {
        currentSpline = e.target.id;
        chanageEditing();
        colorPick.value = splines[currentSpline].color;
        ctx.strokeStyle = splines[currentSpline].color;
    
    })
    ul.appendChild(li);
}





function divs() {

    let spline = splines[currentSpline];
    let indexOfBez = spline.spl.toArray().length - 1;
    let points = [spline.x0, spline.x1, spline.x2, spline.x3, spline.y0, spline.y1, spline.y2, spline.y3];
    let canvasOffset, pressed = false, prevCord;
    for (let i = spline.divInit ? 1 : 0; i < 4; i++) {
        spline.divInit = true;
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = points[i] - 10 + "px";
        div.style.top = points[i + 4] - 10 + "px";
        div.style.height = "30px";
        div.style.width = "30px";
        div.style.opacity = "5%"
        div.style.borderRadius = "50%";
        div.style.backgroundColor = "black";
        document.getElementById("canvas").appendChild(div);
        div.addEventListener("mousedown", function (e) {
            if (movePoints) {
                pressed = true
                canvasOffset = [
                    div.offsetLeft - e.clientX,
                    div.offsetTop - e.clientY
                ];
            }
        }, true);

        div.addEventListener("mouseup", function (e) {
            if (movePoints) {
                pressed = false;

                let tempPoints = spline.spl.toArray()[indexOfBez].toArray()[i].toArray();
                let dif = [e.clientX - tempPoints[0] - 10, e.clientY - tempPoints[1] - 10];

                if (i == 0) {
                    // points
                    spline.spl.toArray()[0].toArray()[1].toArray()[0] += dif[0];
                    spline.spl.toArray()[0].toArray()[1].toArray()[1] += dif[1];
                    //divs
                    spline.divList[1].style.left = (spline.spl.toArray()[0].toArray()[1].toArray()[0] - 9) + "px";
                    spline.divList[1].style.top = (spline.spl.toArray()[0].toArray()[1].toArray()[1] - 9) + "px";
                }

                else if (i == 3) {
                    if (spline.spl.toArray()[indexOfBez + 1] == null) {
                        spline.x0 = e.clientX - 10;
                        spline.y0 = e.clientY - 10;
                        spline.x1 += dif[0];
                        spline.y1 += dif[1];
                    } else {
                        // inter points
                        spline.spl.toArray()[indexOfBez + 1].toArray()[0] = new Vector([e.clientX - 10, e.clientY - 10]);
                        // aprox points
                        spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[0] += dif[0];
                        spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[1] += dif[1];

                        // divs
                        spline.divList[(indexOfBez + 1) * 3 + 1].style.left = (spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[0] - 10) + "px";
                        spline.divList[(indexOfBez + 1) * 3 + 1].style.top = (spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[1] - 10) + "px";
                    }
                    // points
                    spline.spl.toArray()[indexOfBez].toArray()[2].toArray()[0] += dif[0];
                    spline.spl.toArray()[indexOfBez].toArray()[2].toArray()[1] += dif[1];
                    // divs
                    spline.divList[indexOfBez * 3 + 2].style.left = (spline.spl.toArray()[indexOfBez].toArray()[2].toArray()[0] - 9) + "px";
                    spline.divList[indexOfBez * 3 + 2].style.top = (spline.spl.toArray()[indexOfBez].toArray()[2].toArray()[1] - 9) + "px";
                }

                else {   // is aprox point
                    if (i == 2) {
                        if (spline.spl.toArray()[indexOfBez + 1] == null) {
                            spline.x1 -= dif[0];
                            spline.y1 -= dif[1];
                        } else {
                            // points
                            spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[0] -= dif[0];
                            spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[1] -= dif[1];
                            // divs
                            spline.divList[(indexOfBez + 1) * 3 + 1].style.left = (spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[0] - 9) + "px";
                            spline.divList[(indexOfBez + 1) * 3 + 1].style.top = (spline.spl.toArray()[indexOfBez + 1].toArray()[1].toArray()[1] - 9) + "px";
                        }

                    } else {
                        if (spline.spl.toArray()[indexOfBez - 1] != null) {
                            // points
                            spline.spl.toArray()[indexOfBez - 1].toArray()[2].toArray()[0] -= dif[0];
                            spline.spl.toArray()[indexOfBez - 1].toArray()[2].toArray()[1] -= dif[1];
                            // divs
                            spline.divList[(indexOfBez - 1) * 3 + 2].style.left = (spline.spl.toArray()[indexOfBez - 1].toArray()[2].toArray()[0] - 9) + "px";
                            spline.divList[(indexOfBez - 1) * 3 + 2].style.top = (spline.spl.toArray()[indexOfBez - 1].toArray()[2].toArray()[1] - 9) + "px";
                        }
                    }
                }


                // positioning of moved point

                let vectors = spline.spl.toArray()[indexOfBez].toArray();
                vectors[i] = new Vector([e.clientX - 10, e.clientY - 10]);



                redrawSplines();
            }

        }, true);

        div.addEventListener("mousemove", function (e) {
            if (movePoints && pressed) {
                div.style.top = (canvasOffset[0] + e.clientY) + "px";
                div.style.left = (canvasOffset[1] + e.clientX) + "px";
            }
        }, true)

        moveSwitch.addEventListener("chanage", function (e) {
            pressed = false;
        });

        spline.divList[spline.divList.length] = div;
    }
}

function drawLastBez() {
    let points = []
    let index = 0;
    let lastBez = splines[currentSpline].spl.toArray()[splines[currentSpline].spl.toArray().length - 1];
    for (let i = 0; i < 1; i += accuracy) {
        points[index++] = lastBez.value(i);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].toArray()[0], points[0].toArray()[1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].toArray()[0], points[i].toArray()[1]);
    }
    ctx.stroke();
}

function drawSpline(num) {
    ctx.strokeStyle = splines[num].color;
    let points = [];
    let index = 0;
    let spline = splines[num].spl;
    for (let i = 0; i < spline.toArray().length; i += accuracy) {
        points[index++] = spline.value(i);
    }

    ctx.beginPath();
    ctx.moveTo(points[0].toArray()[0], points[0].toArray()[1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].toArray()[0], points[i].toArray()[1]);
    }
    ctx.stroke();
}

function drawPoints(num) {
    let spline = splines[num].spl;
    for (let i = 0; i < spline.toArray().length; i++) {
        let points = spline.toArray()[i].toArray();
        drawCircle(points[0].toArray()[0], points[0].toArray()[1]);
        drawSquare(points[1].toArray()[0], points[1].toArray()[1]);
        drawSquare(points[2].toArray()[0], points[2].toArray()[1]);
        drawCircle(points[3].toArray()[0], points[3].toArray()[1]);

        // draw asymptotes
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(points[0].toArray()[0], points[0].toArray()[1]);
        ctx.lineTo(points[1].toArray()[0], points[1].toArray()[1]);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(points[3].toArray()[0], points[3].toArray()[1]);
        ctx.lineTo(points[2].toArray()[0], points[2].toArray()[1]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function redrawSplines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // clear canvas
    for (let i = 0; i < splines.length; i++) {  // redraw all other splines
        if (splines[i] != null) {
            currentSpline = i;
            chanageEditing();
            drawSpline(i);
            drawPoints(i);
        }
    }
}

function deleteSpline() {
    let deleting = currentSpline;
    // delete divs
    for (let i = 0; i < splines[deleting].divList.length; i++) {
        splines[deleting].divList[i].parentNode.removeChild(splines[deleting].divList[i]);
    }
    splines[deleting] = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // clear canvas
    redrawSplines();
    clearList(deleting)




}

function clearList(num) {
    let list = document.getElementById("list-splines");
    let element = document.getElementById(num);
    list.removeChild(element);
}


function chanageDrawColor() {
    ctx.strokeStyle = splines[currentSpline].color;
}

function drawCircle(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    ctx.fill();
}

function drawSquare(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, 5, 5)
    ctx.fill()
}

function chanageEditing() {
    let editing = document.getElementById("currentSpline");
    editing.innerHTML = currentSpline;
}