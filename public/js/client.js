var socket = io();
var players = {};

var scene = new THREE.Scene();

var inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
};

;(function () {
    function main() {

        // setup key listener
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        var camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        camera.position.z = 5;

        // players[socket.id] = new Player(socket.id, scene);
        // players[socket.id].setPosition({x: -1, y: 1, z: 1});

        socket.emit('new player');

        animate(null, {renderer, scene, camera});
    }

    main();
})();

function animate(timestamp, context) {
    window.requestAnimationFrame(timestamp => animate(timestamp, context));

    context.renderer.render(context.scene, context.camera);
}

socket.on('state', data => {
    for (var p in data) {
        if (players[p] == null)
            players[p] = new Player(p, scene);
        players[p].setPosition(data[p]);
    }
});

socket.on('disconnect', (socketId) => {
    var selectedObject = scene.getObjectByName(socketId);
    scene.remove( selectedObject );
    delete players[socketId];
});

function keyDownHandler(event) {
    switch (event.keyCode) {
        case 65: // A
            inputs.left = true;
            break;
        case 87: // W
            inputs.up = true;
            break;
        case 68: // D
            inputs.right = true;
            break;
        case 83: // S
            inputs.down = true;
            break;
    }
    socket.emit('movement', inputs);
}

function keyUpHandler(event) {
    switch (event.keyCode) {
        case 65: // A
            inputs.left = false;
            break;
        case 87: // W
            inputs.up = false;
            break;
        case 68: // D
            inputs.right = false;
            break;
        case 83: // S
            inputs.down = false;
            break;
    }
    socket.emit('movement', inputs);
}