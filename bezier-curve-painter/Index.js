window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    canvas.heigth = window.innerHeight;
    canvas.width = window.innerWidth;



    //vars
    let drawing = false;

    function startPosition() {
        drawing = true;
    }

    function endPosition() {
        drawing = false;
    }

    function draw(e) {
        if (!drawing) return;
        ctx.linewidth = 10;
        ctx.lineCap = "round";
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }
    //EventListeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);
});

