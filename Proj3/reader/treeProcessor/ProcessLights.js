/**
 * ProcessLights
 * @constructor
 */
 function ProcessLights(scene) {

    this.scene = scene;

 };

/**
 * Convert the data read from lsx into a light
 * @param {Light} lightInfo - The information of the light to be created
 */
 ProcessLights.prototype.transformToLight = function(lightInfo) {
	this.scene.lights[lightInfo.id].setPosition(lightInfo.position.x, lightInfo.position.y, lightInfo.position.z, lightInfo.position.w);
	this.scene.lights[lightInfo.id].setAmbient(lightInfo.ambient.r, lightInfo.ambient.g, lightInfo.ambient.b, lightInfo.ambient.a);
	this.scene.lights[lightInfo.id].setDiffuse(lightInfo.diffuse.r, lightInfo.diffuse.g, lightInfo.diffuse.b, lightInfo.diffuse.a);
	this.scene.lights[lightInfo.id].setSpecular(lightInfo.specular.r, lightInfo.specular.g, lightInfo.specular.b, lightInfo.specular.a);
    this.scene.lights[lightInfo.id].setVisible(true);
    if(lightInfo.enable){
        this.scene.lights[lightInfo.id].enable();
		this.scene.lightsBoolean[lightInfo.id] = true;
	}
    else{
        this.scene.lights[lightInfo.id].disable();
	}
	this.scene.myInterface.addLightController(lightInfo.id, lightInfo.name);
};