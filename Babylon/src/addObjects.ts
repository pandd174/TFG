import * as BABYLON from 'babylonjs';
import { Mesh, ShadowGenerator } from 'babylonjs';
import 'babylonjs-loaders'; //Para que funcionen los loaders
import AssetsLoader from './assets-loader';


export class Objects {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _assetsLoader: AssetsLoader;

    private _ground:Mesh;
    private _shadowGenerator:ShadowGenerator;
	public interactiveParts:{name:string[], textInstructions:string, meshInstancesArray:BABYLON.Mesh[]}[];

	initializeInteractiveParts() {
	this.interactiveParts=[
		{name:["window", "ventana"], textInstructions:"Colores: \nAzul, Amarillo, Blanco, Cian, Gris, Magenta, Negro, Rojo, Verde \nTeclas 1, 2, 3, 4, 5, 6, 7, 8, 9", meshInstancesArray:[]}, 
		{name:["light", "luces", "luz"], textInstructions:"Iluminacion: \nOn, Off \nTeclas 1, 2", meshInstancesArray:[]}, 
		{name:["roof", "tejado"], textInstructions:"Movimiento: \nOn, Off \nTeclas 1, 2", meshInstancesArray:[]},
		{name:["door", "puerta"], textInstructions:"Movimiento: \n90º, -90º \nTeclas 1, 2", meshInstancesArray:[]}
	];
	}

    createGround(scene:BABYLON.Scene, shadow:ShadowGenerator){
        // Create a built-in "ground" shape.
        this._ground = BABYLON.MeshBuilder.CreateGround('ground',
                                {width: 12, height: 8, subdivisions: 2}, scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial",  scene);
        groundMaterial.diffuseColor = BABYLON.Color3.FromHexString('#454649');
        //groundMaterial.specularColor = BABYLON.Color3.FromHexString('#101010');
        this._ground.receiveShadows = true;
        this._ground.material = groundMaterial;
		return groundMaterial;
    }

	addPlayCanvasCube(scene:BABYLON.Scene, shadow:ShadowGenerator){
        const entity = <BABYLON.Mesh> scene.getMeshByName("cube");
		shadow.addShadowCaster(entity);
		entity.position = new BABYLON.Vector3(3,0.5,3);
		return entity;
	}


	// createCoche(appAux:bbl.Application){
	// 	var asset:bbl.Asset = appAux.assets.find("coche");
	// 	const entity = new bbl.Entity("playCanvasCube");
	// 	entity.addComponent("model", {
	// 		type: "asset",
	// 		asset: asset.resource.model,
	// 		castShadows: true
	// 	});
	// 	entity.setLocalPosition(10,0.5,10);
	// 	return entity;
	// }


	createCoche(scene:BABYLON.Scene, shadow:ShadowGenerator){
        const entity = <BABYLON.Mesh> scene.getMeshByName("coche");
		shadow.addShadowCaster(entity);
		entity.position = new BABYLON.Vector3(10,0.5,10);
		return entity;
	}

    createAndPositionWTurbines(scene:BABYLON.Scene, shadow:ShadowGenerator){
        let posZ = -2.5;
        let posX = -4.5;
        const wturbine = <BABYLON.Mesh> scene.getMeshByName("windTurbine");
        shadow.addShadowCaster(wturbine);
        wturbine.position.z = posZ;
        wturbine.position.x = posX;

        [1,2,3,4,5].forEach((p)=>{
            let clonedWTurbine = wturbine.clone("wturbine" +p);  
            BABYLON.Tags.AddTagsTo(clonedWTurbine, "wturbine animable " + "wturbine" +p);
            if(p%2){
                BABYLON.Tags.AddTagsTo(clonedWTurbine, "animar");
                //clonedWTurbine.material.wireframe = true;
            }
            clonedWTurbine.position.x = posX + p -1;
            shadow.addShadowCaster(clonedWTurbine);
        })
        wturbine.setEnabled(false); //El objecto origen lo ocultamos
		return wturbine;
    }


	addPlayCanvasCasa(scene:BABYLON.Scene, shadow:ShadowGenerator):void{
		console.log(scene.meshes)
        //const entity = <BABYLON.Mesh> scene.getMeshByName("casa");
        //shadow.addShadowCaster(entity);
		//entity.position = new BABYLON.Vector3(0,0,0);

		// Tejados
		// entity.model?.meshInstances
		// Bounding box
		// model->meshInstance->AABB
		// intersectsRay(ray, intersection)
        //if (entity.subMeshes) {
            // Calculate bounding box of a model: 
            //     var meshInstances = entity.model?.meshInstances;
            //     if (meshInstances.length > 0) {
            //         var bbox = new bbl.BoundingBox();
            //         bbox.copy(meshInstances[0].aabb);
            //         for (var i = 1; i < meshInstances.length; i++) {
            //             bbox.add(meshInstances[i].aabb);
            //         }
            //     }

            console.log("Entidad casa: " + scene.getMeshesByTags('casa'));
            //var tejados = new Array<bbl.MeshInstance>(), luces = new Array<bbl.MeshInstance>(), ventanas = new Array<bbl.MeshInstance>();
            scene.meshes.forEach( element => {
				shadow.addShadowCaster(element);
                //this.createPhysicalShape("box", element.getRenderingMesh().position.x, element.getRenderingMesh().position.y, element.getRenderingMesh().position.z, scene, element.getRenderingMesh().name);
				this.interactiveParts.forEach(elementInteractive => {
					elementInteractive.name.forEach(name => {
						if (element.name.toLowerCase().includes(name)) {
							elementInteractive.meshInstancesArray.push(<BABYLON.Mesh>element);
							BABYLON.Tags.AddTagsTo(element, "name")
						}
					});
				})
				if (element.name.toLowerCase().includes("superficie")) {
					BABYLON.Tags.AddTagsTo(element, "superficie")
				}
                
            })
			//this.interactiveParts[0].meshInstancesArray.forEach((e) => {console.log(e.name)});
            if (this.interactiveParts) {
                this.interactiveParts[2].meshInstancesArray.forEach( element => {
                    element.position = new BABYLON.Vector3(element.position.x,element.position.y+10,element.position.z);
                    //console.log("Casa: " + element.node.name + " posicion: " + element.node.getPosition().toString());
                })
            }
            if (this.interactiveParts) {
                this.interactiveParts[0].meshInstancesArray.forEach( element => {
					try {
						let materialAux = this.createMaterial(BABYLON.Color3.White(), BABYLON.Color3.Blue(), "Blue", scene /*,  Textura*/);
						//materialAux.blendType = bbl.BLEND_NORMAL;
						(<BABYLON.AbstractMesh>scene.getMeshByName(element.name)).material = materialAux;
					} catch (error) {
						console.error(element.name + ": " + error)
					}
					console.log(BABYLON.Tags.GetTags(element));
                })
            }
            if (this.interactiveParts) {
                this.interactiveParts[1].meshInstancesArray.forEach( element => {
                    const light = this.createSpotLight(scene, shadow);

                    //light.setPosition(element.node.getPosition());

					// entity.addComponent("light", light);
					// element.node.insertChild(light, 0);
					// console.log(element.node.children)
                })
            }
        //}
		//return entity;
	}
		

	createMaterial (ambient:BABYLON.Color3, color:BABYLON.Color3, nombre:string="", scene:BABYLON.Scene, opacity?:BABYLON.BaseTexture) {
        var material = new BABYLON.PBRMaterial(nombre, scene);
		material.albedoColor = color;
		material.ambientColor = ambient;
		material.name = nombre;
		material.metallic = 0;
		material.roughness = 0;
		
		material.subSurface.isRefractionEnabled = true;
		material.subSurface.refractionIntensity = 0.8;
		if(opacity)	material.opacityTexture = opacity;
		return material.clone(nombre);
	}


	createSpotLight (scene:BABYLON.Scene, shadow:ShadowGenerator){
		const spotlight = BABYLON.Light.Construct('spot', 'light', scene, BABYLON.Light.LIGHTTYPEID_SPOTLIGHT);
		//spotlight.
		// spotlight.apply
		// spotlight.addComponent("light", {
		// 	type: "spot",
		// 	color: bbl.Color.WHITE,
		// 	innerConeAngle: 30,
		// 	outerConeAngle: 31,
		// 	range: 100,
		// 	intensity: 0.6,
		// 	castShadows: true,
		// 	shadowBias: 0.05,
		// 	normalOffsetBias: 0.03,
		// 	shadowResolution: 2048,
		// });
		// const cone = new bbl.Entity();
		// cone.addComponent("render", {
		// 	type: "cone",
		// 	castShadows: false,
		// 	material: this.createMaterial(bbl.Color.RED, bbl.Color.RED)
		// });
		// spotlight.addChild(cone);
		return spotlight;
	}

	
	private createPhysicalShape(type: string, x: number, y: number, z: number, appAux:BABYLON.Scene, name?:string, height?: number|1, rigidbodyType?:string|"static", material?: BABYLON.PBRMaterial) {
		const e = null;

		// Have to set the position of the entity before adding the static rigidbody
		// component because static bodies cannot be moved after creation
		// appAux.root.addChild(e);
		// e.setPosition(x, y, z);
        // if (name)
        //     e.name = name;

        // if (material){
        //     e.addComponent("model", {
        //         type: type,
        //         material: material
        //     });
        // }else{
        //     e.addComponent("model", {
        //         type: type
        //     });
        // }
		// e.addComponent("rigidbody", {
		// 	type: rigidbodyType
		// });
		// e.addComponent("collision", {
		// 	type: type,
		// 	height: height
		// });

		return e;
	}
}