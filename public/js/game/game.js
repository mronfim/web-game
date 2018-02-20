
function Game(socket, glContext) {
    this.socket = socket;
    this.glContext = glContext;
}

Game.create = function(socket, glCanvas) {
    glCanvas.width = 800;
    glCanvas.height = 600;
    
    var glContext = WebGLDebugUtils.makeDebugContext(glCanvas.getContext('webgl'), (err, funcName, args)=> {
        console.log("Error");
    });
    return new Game(socket, glContext);
}

Game.prototype.init = function() {
    const gl = this.glContext;
    const shaderProgram = initShaderProgram(gl, vs, fs);

    this.programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            uModelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    this.position = positionBuffer;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const FOV = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    this.projectionMatrix = mat4.create();

    mat4.perspective(this.projectionMatrix, FOV, aspect, zNear, zFar);

    this.modelViewMatrix = mat4.create();
    
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -6.0]);
}

/**
 * Draws the current game state
 */
Game.prototype.render = function(delta) {
    this.glContext.clearColor(1.0, 0.0, 0.0, 1.0);
    this.glContext.clearDepth(1.0);

    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition atribute
    const numComponents = 2;
    const type = this.glContext.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.position);
    this.glContext.vertexAttribPointer(
        this.programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );

    this.glContext.enableVertexAttribArray(
        this.programInfo.attribLocations.vertexPosition
    );

    // Tell WebGL to use the program when drawing
    this.glContext.useProgram(this.programInfo.program);

    this.glContext.uniformMatrix4fv(
        this.programInfo.uniformLocations.projectionMatrix,
        false,
        this.projectionMatrix
    );

    this.glContext.uniformMatrix4fv(
        this.programInfo.uniformLocations.modelViewMatrix,
        false,
        this.modelViewMatrix
    )

    this.glContext.drawArrays(this.glContext.TRIANGLE_STRIP, 0, 4);

    // window.requestAnimationFrame(delta => this.render(delta));
}

/**
 * Gets input state and emits it to the server
 */
Game.prototype.update = function() {

}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error ocurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vs = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

const fs = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`