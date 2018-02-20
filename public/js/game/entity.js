
function Player(name, scene) {
    this.scene = scene;
    this.location = {x: 0, y: 0, z: 0};
    this.geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = name;
    scene.add(this.mesh);
}

Player.prototype.setPosition = function(position) {
    this.mesh.position.set(position.x, position.y, position.z);
}

