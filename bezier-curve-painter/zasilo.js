import { Vector } from "./Vector.js"
import { Bezier } from "./Bezier.js"
import { Spline } from "./Spline.js";




window.addEventListener('DOMContentLoaded', (event) => {
    let canvas = document.getElementById("mainCanvas");
    let ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let draggingControlPoint = false;
    let drawingNewCurve = false;    
    let splineArr = [];
    let dragPoint = [];
       

    canvas.addEventListener("mousedown", function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let [i, j] = nearControlPoints(x, y);        
        dragPoint = [i, j];
        switch(i) {
            case -1:
                splineArr.push(new Bezier([new Vector([x, y]), new Vector([x, y]), new Vector([x, y]), new Vector([x, y])]));
                drawingNewCurve = true;
                redraw();
            break;
            default:
                draggingControlPoint = true;
                splineArr[i].setCPoint(j, new Vector([x, y]));
                redraw();
        }
    });
    
    canvas.addEventListener("mousemove", function(e) {
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
       
        if (draggingControlPoint) {
            splineArr[dragPoint[0]].setCPoint(dragPoint[1], new Vector([x, y]));

            redraw();
        }

        if (drawingNewCurve) {
            let lastBezier = splineArr.length-1;
            splineArr[lastBezier].setAPoint(3, new Vector([x, y]));
            redraw();
        } 
    });

    
    canvas.addEventListener("mouseup", function(e) {
        draggingControlPoint = false;
        if (drawingNewCurve) {
            drawingNewCurve = false;
            console.log(splineArr[splineArr.length-1].toArray()[0].toArray()[0]);
            console.log(splineArr[splineArr.length-1].toArray()[3].toArray()[0]);
           if ((splineArr[splineArr.length-1].toArray()[0].toArray()[0] == splineArr[splineArr.length-1].toArray()[3].toArray()[0]) &&
                (splineArr[splineArr.length-1].toArray()[0].toArray()[1] == splineArr[splineArr.length-1].toArray()[3].toArray()[1])) {
                 splineArr.pop();
            }           
            else {
                console.log("where is the last bezier curve");
                straightCurve(splineArr[splineArr.length-1]);
            }
        }
        redraw();
    });



    // when you initially draw a bezier, it sets the control points so the curve is a straight line
    function straightCurve(bezier) {
        if (bezier) {

            const anchorPoint1 = bezier.toArray()[0];
            const anchorPoint2 = bezier.toArray()[3];

            const dx = anchorPoint2.toArray()[0] - anchorPoint1.toArray()[0];
            const dy = anchorPoint2.toArray()[1] - anchorPoint1.toArray()[1];
            const slope = dx !== 0 ? dy / dx : 0; // Handling division by zero for vertical lines

            // Calculate midpoints for control points directly on the line
            const midX = (anchorPoint1.toArray()[0] + anchorPoint2.toArray()[0]) / 2;
            const midY = (anchorPoint1.toArray()[1] + anchorPoint2.toArray()[1]) / 2;

            // Adjust offset based on the slope to ensure visibility and directness
            let offsetX, offsetY;

            // For vertical lines, adjust the Y offset instead of X
            if (-5 > dx > 5) {
                // For non-vertical lines, calculate slope and adjust control points accordingly
                const slope = dy / dx;
                offsetX = 50;
                offsetY = offsetX * slope;

                // Set the control points using the calculated offsets
                bezier.setCPoint(1, new Vector([midX - offsetX, midY - offsetY]));
                bezier.setCPoint(2, new Vector([midX + offsetX, midY + offsetY]));
            } else {
                // For vertical lines, set control points directly above and below the midpoint
                // to avoid multiplying with infinite slope
                offsetX = 0; // No horizontal offset for vertical lines
                offsetY = 50; // Use a fixed vertical offset

                // Adjust control points to be slightly above and below the midpoint
                bezier.setCPoint(1, new Vector([midX, midY - offsetY]));
                bezier.setCPoint(2, new Vector([midX, midY + offsetY]));
            }
        }
    }

    function nearControlPoints(x, y) {
        // Check if clicking near a control point
        for (let i = 0; i < splineArr.length; i++) {
            for (let j = 1; j < splineArr[i].toArray().length-1; j++) {
                if (Math.abs(x - splineArr[i].toArray()[j].toArray()[0]) < 10 && Math.abs(y - splineArr[i].toArray()[j].toArray()[1]) < 10){
                   return [i, j] ; // Return the index of the near control point
                }
            }
        }
        return [-1, -1]; // Return -1 if no control point is near
    }

    function redraw() {
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        console.log(drawingNewCurve);
        
        if (drawingNewCurve) {
            temporaryLine(splineArr[splineArr.length-1].toArray()[0], splineArr[splineArr.length-1].toArray()[3]);
        }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log(splineArr);
            for (let i = 0; i < splineArr.length; i++) {
                console.log(splineArr[i].toArray());
                drawBezier(splineArr[i]);
            }

            console.log("drawing control points");
           
            // hardcoded for 2 anchor and 2 control points per bezier curve
            for (let i = 0; i < splineArr.length; i++) {
                // mark 2 anchor points of the curve
                drawCircle(splineArr[i].toArray()[0].toArray()[0], splineArr[i].toArray()[0].toArray()[1]);
                drawCircle(splineArr[i].toArray()[3].toArray()[0], splineArr[i].toArray()[3].toArray()[1]);

                // mark 2 control points of the curve
                drawRect(splineArr[i].toArray()[1].toArray()[0], splineArr[i].toArray()[1].toArray()[1]); 
                drawRect(splineArr[i].toArray()[2].toArray()[0], splineArr[i].toArray()[2].toArray()[1]);

                // draw control lines between anchor points and control points (2 for each bezier curve)
                drawControlLines(splineArr[i].toArray()[0], splineArr[i].toArray()[1]);
                drawControlLines(splineArr[i].toArray()[3], splineArr[i].toArray()[2]);
                console.log(i);
            }
    }


   function drawBezier(bezierCurve) {
        // Start by moving to the first anchor point
        ctx.beginPath();
        ctx.moveTo(bezierCurve.toArray()[0][0], bezierCurve.toArray()[0][1]);

        // Calculate points along the curve and draw lines between them
        const accuracy = 0.01; // Determines how many points are calculated (lower is more accurate)
        for (let t = 0; t <= 1; t += accuracy) {
            const point = bezierCurve.value(t);
            ctx.lineTo(point.toArray()[0], point.toArray()[1]);
        }
        // Finish drawing the curve
        ctx.strokeStyle = '#000000'; // Color for the Bezier curve
        ctx.stroke();
    }

    function drawCircle(x, y) {
        ctx.fillStyle = "#0000FF"; // Color for control points
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    function drawRect(x, y) {
        ctx.fillStyle = "#FF0000"; // Color for anchor points
        ctx.beginPath();
        ctx.rect(x-5, y-5, 10, 10);
        ctx.fill();
    }

    function drawControlLines(startPoint, endPoint) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]); // Set the dash pattern for dotted lines
        ctx.moveTo(startPoint.toArray()[0], startPoint.toArray()[1]);
        ctx.lineTo(endPoint.toArray()[0], endPoint.toArray()[1]);
        ctx.strokeStyle = '#888'; // Color for dotted lines
        ctx.stroke();
        ctx.setLineDash([]); // Reset the dash pattern to solid
    }
   
    function temporaryLine(startPoint, endPoint) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(startPoint.toArray()[0], startPoint.toArray()[1]);
        ctx.lineTo(endPoint.toArray()[0], endPoint.toArray()[1]);
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }
});
