
function Game(socket, glContext) {
    this.socket = socket;
    this.glContext = glContext;
}

Game.create = function(socket, glCanvas) {
    glCanvas.width = 800;
    glCanvas.height = 600;
    
    var glContext = glCanvas.getContext('webgl');
    return new Game(socket, glContext);
}

Game.prototype.init = function() {

}

/**
 * Draws the current game state
 */
Game.prototype.render = function(delta) {
    this.glContext.clearColor(1.0, 0.0, 0.0, 1.0);
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);

    window.requestAnimationFrame(delta => this.render(delta));
}

/**
 * Gets input state and emits it to the server
 */
Game.prototype.update = function() {

}