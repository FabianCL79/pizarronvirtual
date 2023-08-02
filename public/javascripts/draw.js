window.onload = function () {

    let isDrawing = false;
    let x = 0;
    let y = 0;

    const canvas = document.getElementById('sheet');
    var context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    canvas.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });






    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    window.addEventListener('touchend', e => {
        e.preventDefault();
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (isDrawing === true) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });






    var socket = io();

    socket.on('update_canvas', function (data) {
        let { x1, y1, x2, y2, color } = JSON.parse(data);
        drawLine(context, x1, y1, x2, y2, color, true);
    });

    function drawLine(context, x1, y1, x2, y2, color = selected_color, from_server = false) {

        if (!from_server)
            socket.emit('update_canvas', JSON.stringify({ x1, y1, x2, y2, color }));

        if (color === 'white') {
            context.clearRect(x1 - 5, y1 - 5, 15, 15);
        } else {
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 5;
            context.lineCap = 'round'
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
        }
    }
}

let selected_color = 'black';
function selectColor(color) {
    document.getElementsByClassName(selected_color)[0].classList.remove('selected');
    document.getElementsByClassName(color)[0].classList.add('selected');
    selected_color = color;
}










document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);





