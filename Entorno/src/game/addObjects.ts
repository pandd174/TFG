import {Lights} from './lights'
import * as pc from 'playcanvas'
import {AssetsLoader} from './assets-loader'


export class Objects {
    public app:pc.Application
	private assets: { font: pc.Asset }


	createBox(){
		var box = new pc.Entity();
        box.addComponent("model", {
            type: "box"
        });
	}


	createGround(color:pc.Color):pc.Entity{
		var ground = new pc.Entity("ground");
		ground.addComponent("model", {
			type: "box",
			castShadows: false
		});
		ground.setLocalScale(12, 0.22, 8 );
		ground.setLocalPosition(4, -0.11, 2);

		var material:pc.StandardMaterial = Objects.prototype.createMaterial(color,color);
		material
		if(ground.model){
			ground.model.material = material;
		}
		return ground;
	}

	addPlayCanvasCube(appAux:pc.Application){
		var asset:pc.Asset = appAux.assets.find("cube");
		const entity = new pc.Entity("playCanvasCube");
		entity.addComponent("model", {
			type: "asset",
			asset: asset.resource.model,
			castShadows: true
		});
		entity.setLocalPosition(3,0.5,3);
		return entity;
	}


	addPlayCanvasCoche(appAux:pc.Application){
		var asset:pc.Asset = appAux.assets.find("coche");
		const entity = new pc.Entity("playCanvasCube");
		entity.addComponent("model", {
			type: "asset",
			asset: asset.resource.model,
			castShadows: true
		});
		entity.setLocalPosition(10,0.5,10);
		return entity;
	}


	addPlayCanvasCasa(appAux:pc.Application){
		var asset:pc.Asset = appAux.assets.find("casa");
		const entity = new pc.Entity("playCanvasCube");
		entity.addComponent("model", {
			type: "asset",
			asset: asset.resource.model,
			castShadows: true
		});
		entity.setLocalPosition(0,0,0);

		// Tejados
		// entity.model?.meshInstances
		// Bounding box
		// model->meshInstance->AABB
		// intersectsRay(ray, intersection)
        if (entity.model) {
            // Calculate bounding box of a model: 
            //     var meshInstances = entity.model?.meshInstances;
            //     if (meshInstances.length > 0) {
            //         var bbox = new pc.BoundingBox();
            //         bbox.copy(meshInstances[0].aabb);
            //         for (var i = 1; i < meshInstances.length; i++) {
            //             bbox.add(meshInstances[i].aabb);
            //         }
            //     }

            console.log(entity);
            var tejados = new Array<pc.MeshInstance>(), luces = new Array<pc.MeshInstance>(), ventanas = new Array<pc.MeshInstance>();
            entity.model.meshInstances.forEach( element => {
                this.createPhysicalShape("box", element.node.getPosition().x, element.node.getPosition().y, element.node.getPosition().z, appAux, element.node.name);
                if (element.node.name.toLowerCase().includes("roof") || element.node.name.toLowerCase().includes("tejado")){
                    tejados.push(element);
                }
                if (element.node.name.toLowerCase().includes("window") || element.node.name.toLowerCase().includes("ventana")){
                    ventanas.push(element);
                }
                if (element.node.name.toLowerCase().includes("light") || element.node.name.toLowerCase().includes("luz") || element.node.name.toLowerCase().includes("luces")){
                    luces.push(element);
                }
                
            })

            // tejados = entity.model.meshInstances.filter(function (node) {
            //     // abajo habria que poner el nombre de las partes a manejar
            //     return node.node.name.toLowerCase().includes("roof") || node.node.name.toLowerCase().includes("tejado");
            // });
            if (tejados) {
                tejados.forEach( element => {
                    element.node.setLocalPosition(element.node.getLocalPosition().x,element.node.getLocalPosition().y+10,element.node.getLocalPosition().z)
                    console.log("Casa: " + element.node.name + " posicion: " + element.node.getPosition().toString());
                })
            }
            // ventanas = entity.model.meshInstances.filter(function (node) {
            //     return node.node.name.toLowerCase().includes("window") || node.node.name.toLowerCase().includes("ventana");
            // });
            if (ventanas) {
                ventanas.forEach( element => {
                    var materialAux = this.createMaterial(pc.Color.WHITE, pc.Color.CYAN, true, 0);
                    //materialAux.blendType = pc.BLEND_NORMAL;
                    element.material = materialAux;
                })
            }
            // luces = entity.model.meshInstances.filter(function (node) {
            //     return node.node.name.toLowerCase().includes("light") || node.node.name.toLowerCase().includes("luz") || node.node.name.toLowerCase().includes("luces");
            // });
            if (luces) {
                luces.forEach( element => {
                    const light = this.createSpotLight();
                    light.setPosition(element.node.getPosition());
                })
            }
        }
		return entity;
	}
		

	createMaterial (ambient:pc.Color, diffuse:pc.Color, blend?:boolean, opacity?:number) {
		var material:pc.StandardMaterial = new pc.StandardMaterial();
		material.diffuse = diffuse;
		material.ambient = ambient;
		if(opacity)	material.opacity = opacity;
		if(blend) material.blendType = pc.BLEND_ADDITIVE;
		material.update();
		return material;
	}


	createSpotLight (){
		const spotlight = new pc.Entity();
		spotlight.addComponent("light", {
			type: "spot",
			color: pc.Color.WHITE,
			innerConeAngle: 30,
			outerConeAngle: 31,
			range: 100,
			intensity: 0.6,
			castShadows: true,
			shadowBias: 0.05,
			normalOffsetBias: 0.03,
			shadowResolution: 2048,
		});
		const cone = new pc.Entity();
		cone.addComponent("render", {
			type: "cone",
			castShadows: false,
			material: this.createMaterial(pc.Color.RED, pc.Color.RED)
		});
		spotlight.addChild(cone);
		return spotlight;
	}

	
	private createPhysicalShape(type: string, x: number, y: number, z: number, appAux:pc.Application, name?:string, height?: number|1, rigidbodyType?:string|"static", material?: pc.Material) {
		const e = new pc.Entity();

		// Have to set the position of the entity before adding the static rigidbody
		// component because static bodies cannot be moved after creation
		appAux.root.addChild(e);
		e.setPosition(x, y, z);
        if (name)
            e.name = name;

        if (material){
            e.addComponent("model", {
                type: type,
                material: material
            });
        }else{
            e.addComponent("model", {
                type: type
            });
        }
		e.addComponent("rigidbody", {
			type: rigidbodyType
		});
		e.addComponent("collision", {
			type: type,
			height: height
		});

		return e;
	}
}