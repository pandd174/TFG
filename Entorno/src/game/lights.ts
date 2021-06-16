import * as pc from 'playcanvas';

export class Lights{

    public static addAmbientLight(app:pc.Application):void{
        app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);
    }
    
    public static createSimpleDirectionalShadowLight(app:pc.Application, castShadow:boolean):void{
 	// Create an entity with a directional light component
     const light:pc.Entity = new pc.Entity();
     light.addComponent("light", {
         type: "directional",
         castShadows: castShadow,
         range: 16,
         shadowBias: 0.2,
         normalOffsetBias: 0.05,
         shadowResolution: 4096,
         //shadowUpdateMode:pc.SHADOWUPDATE_THISFRAME,
         shadowType: pc.SHADOW_PCF5
     });
     light.lookAt(new pc.Vec3(-5,6,-5));
     //light.setLocalPosition(5, 6, 5);
     app.root.addChild(light);
    }

    public static addSkyBox (app:pc.Application, mip:number, assetName:string){
        app.scene.skyboxMip = mip;
        app.scene.skyboxIntensity = 1.0

        app.scene.toneMapping = pc.TONEMAP_FILMIC;
        app.scene.exposure = 11;
        app.scene.gammaCorrection = 2.2
		app.scene.setSkybox(app.assets.find(assetName).resources);
		var r = new pc.Quat();
		r.setFromEulerAngles(0, 206, 0); //Para alinearlo con la shadowLight
		app.scene.skyboxRotation = r;
	}
}