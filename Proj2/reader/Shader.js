/**
 * Shader
 * @constructor
 */
function Shader(scene, texture, heightmap) {
 	CGFobject.call(this,scene);

 	this.scene = scene;

	this.appearance = new CGFappearance(this.scene);
	this.appearance.setAmbient(1, 1, 1, 1);
	this.appearance.setDiffuse(1, 1, 1, 1);
	this.appearance.setSpecular(1, 1, 1, 1);	
	this.appearance.setShininess(120);
	this.texture = new CGFtexture(this.scene, texture);
	this.heightmap = new CGFtexture(this.scene, heightmap);
	this.appearance.setTexture(this.texture);
	this.appearance.setTextureWrap ('REPEAT', 'REPEAT');

	this.plane = new Plane(this.scene, 100);

	this.shader = new CGFshader(this.scene.gl, "Shader/texture.vert", "Shader/texture.frag");
	this.shader.setUniformsValues({normScale: 1.0});
	this.shader.setUniformsValues({uSampler2: 1});
};

Shader.prototype = Object.create(CGFobject.prototype);
Shader.prototype.constructor = Shader;

/**
 * Display the shader
 */
Shader.prototype.display = function () {
		
	this.appearance.apply();
	this.scene.setActiveShader(this.shader);
    this.heightmap.bind(1);
	this.plane.display();
	
    this.heightmap.unbind(1);
	this.scene.setActiveShader(this.scene.defaultShader);
};