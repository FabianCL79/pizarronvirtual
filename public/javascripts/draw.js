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

    //Rotation
    /////////////////////////////////////////////////
    function updateCanvasDimensions() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    window.addEventListener('orientationchange', updateCanvasDimensions);
    updateCanvasDimensions();


    //TouchScreen
    ////////////////////////////////////////////////////////////////
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(e) {
        e.preventDefault();
        var touch = e.touches[0];
        x = touch.clientX - touch.target.offsetLeft;
        y = touch.clientY - touch.target.offsetTop;
        isDrawing = true;
    }

    function handleTouchMove(e) {
        if (isDrawing === true) {
            e.preventDefault();
            var touch = e.touches[0];
            drawLine(context, x, y, touch.clientX - touch.target.offsetLeft, touch.clientY - touch.target.offsetTop);
            x = touch.clientX - touch.target.offsetLeft;
            y = touch.clientY - touch.target.offsetTop;
        }
    }

    function handleTouchEnd(e) {
        if (isDrawing === true) {
            e.preventDefault();
            var touch = e.changedTouches[0];
            drawLine(context, x, y, touch.clientX - touch.target.offsetLeft, touch.clientY - touch.target.offsetTop);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    }
    //////////////////////////////////////////////////



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




/*

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
*/

