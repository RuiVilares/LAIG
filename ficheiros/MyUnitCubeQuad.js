/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyUnitCubeQuad(scene) {
	CGFobject.call(this,scene);
    this.quad=new MyQuad(this.scene, 0, 1, 0, 1);
    this.quad.initBuffers();
};

MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor=MyUnitCubeQuad;

MyUnitCubeQuad.prototype.display = function () {

	// Front face
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.5);
    this.quad.display();
    this.scene.popMatrix();

    // Right face    
    this.scene.pushMatrix();
    this.scene.translate(0.5, 0, 0);
    this.scene.rotate(Math.PI/2, 0, 1.0, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Left face
    this.scene.pushMatrix();
    this.scene.translate(-0.5, 0, 0);
    this.scene.rotate((3*Math.PI)/2, 0, 1.0, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Back face
    this.scene.pushMatrix();
    this.scene.translate(0, 0, -0.5);
    this.scene.rotate(Math.PI, 0, 1.0, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Top face
    this.scene.pushMatrix();
    this.scene.translate(0, 0.5, 0);
    this.scene.rotate(-Math.PI/2, 1.0, 0, 0);
    this.quad.display();
    this.scene.popMatrix();

    // Down face
    this.scene.pushMatrix();
    this.scene.translate(0, -0.5, 0);
    this.scene.rotate(Math.PI/2, 1.0, 0, 0);
    this.quad.display();
    this.scene.popMatrix();

};


