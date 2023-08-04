window.onload = function () {

    let isDrawing = false;
    let x = 0;
    let y = 0;
    let width = 5;

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

    function updateCanvasDimensions() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    // Call the function once on window load to set the initial canvas dimensions
    updateCanvasDimensions();

    //TouchScreen
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(e) {
        e.preventDefault();
        var touch = e.touches[0];
        x = touch.clientX - touch.target.offsetLeft + window.scrollX;
        y = touch.clientY - touch.target.offsetTop + window.scrollY;
        isDrawing = true;
    }

    function handleTouchMove(e) {
        if (isDrawing === true) {
            e.preventDefault();
            var touch = e.touches[0];
            drawLine(context, x, y, touch.clientX - touch.target.offsetLeft + window.scrollX, touch.clientY - touch.target.offsetTop + window.scrollY);
            x = touch.clientX - touch.target.offsetLeft + window.scrollX;
            y = touch.clientY - touch.target.offsetTop + window.scrollY;
        }
    }

    function handleTouchEnd(e) {
        if (isDrawing === true) {
            e.preventDefault();
            var touch = e.changedTouches[0];
            drawLine(context, x, y, touch.clientX - touch.target.offsetLeft + window.scrollX, touch.clientY - touch.target.offsetTop + window.scrollY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    }

    var socket = io();

    socket.on('update_canvas', function (data) {
        let { x1, y1, x2, y2, color, width } = JSON.parse(data);
        drawLine(context, x1, y1, x2, y2, color, true, width);
    });

    const lineWidthSlider = document.getElementById('lineWidthSlider');
    lineWidthSlider.addEventListener('input', function () {
        const lineWidth = this.value;
        width = lineWidth;
    });

    function drawLine(context, x1, y1, x2, y2, color = selected_color, from_server = false, lineWidth = 5) {
        if (!from_server) {
            lineWidth = width;
            socket.emit('update_canvas', JSON.stringify({ x1, y1, x2, y2, color, width }));
        }
        //const lineWidth = 5;
        if (color === 'borrar') {
            context.clearRect(x1 - lineWidth, y1 - lineWidth, lineWidth * 3, lineWidth * 3);
        } else {
            if (from_server && color === 'erase') {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            else {
                context.beginPath();
                context.strokeStyle = color;
                context.lineWidth = lineWidth;
                context.lineCap = 'round'
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
                context.closePath();
            }
        }
    }
}

let selected_color = 'black';
let previous_color = 'black';
function selectColor(color) {
    if (color === 'borrar') {
        document.getElementsByClassName('lapiz')[0].classList.remove('selected');
        document.getElementsByClassName('colores')[0].classList.remove('selected');
        document.getElementsByClassName('borrar')[0].classList.add('selected');
    } else {
        //if (color === 'lapiz') {
        document.getElementsByClassName('lapiz')[0].classList.add('selected');
        document.getElementsByClassName('colores')[0].classList.remove('selected');
        document.getElementsByClassName('borrar')[0].classList.remove('selected');
        //}
    }
    if (color === 'borrar' && selected_color === 'borrar') {
        selected_color = color;
    } else {
        if (color === 'borrar') {
            previous_color = selected_color;
            selected_color = color;
        } else {
            if (selected_color === 'borrar' && color === 'lapiz') {
                selected_color = previous_color;
            } else {
                /*if (selected_color === 'borrar') {
                    previous_color = color;
                } else {*/
                selected_color = color;
                //}
            }
        }
    }
    const colorGrid = document.querySelector('.color-grid');
    if (colorGrid) {
        colorGrid.remove();
    }
    const selectColorButton = document.querySelector('.color-square');
    selectColorButton.style.backgroundColor = '';
    if (selected_color !== 'borrar') {
        selectColorButton.style.backgroundColor = selected_color;
    } else {
        selectColorButton.style.backgroundColor = previous_color;
    }
    //}
}

function openColorGrid() {
    // Create a new div element for the color grid
    const colorGrid = document.createElement('div');
    colorGrid.classList.add('color-grid');
    // Define an array of colors you want in the grid
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];
    // Loop through the colors and create buttons for each color
    colors.forEach((color) => {
        const colorButton = document.createElement('button');
        colorButton.classList.add('round-button', color);
        colorButton.onclick = () => selectColor(color);
        colorGrid.appendChild(colorButton);
    });
    // Append the color grid to the parent element (e.g., the body or any specific container)
    document.body.appendChild(colorGrid);
}

function eraseEverything() {
    // Clear the canvas
    const canvas = document.getElementById('sheet');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var socket = io();
    // Send the erase request to the server
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    color = 'erase';
    socket.emit('update_canvas', JSON.stringify({ x1, y1, x2, y2, color }));
}