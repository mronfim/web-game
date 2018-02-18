;(function () {
    function main() {
        var socket = io();
        var gl = document.getElementById('canvas');

        // setup event handlers

        var game = Game.create(socket, gl);
        game.init();
        window.requestAnimationFrame(delta => game.render(delta));
    }

    main();
})();
