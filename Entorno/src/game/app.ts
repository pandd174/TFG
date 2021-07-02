
import {Lights} from './lights'
import * as pc from 'playcanvas'
import {AssetsLoader} from './assets-loader'

export class App {
    public app:pc.Application
    private canvas:HTMLCanvasElement
	private assets: { font: pc.Asset }


    public get App(): pc.Application {
        return this.app;
    };


    public Awake(): void {
        this.initApp();
        AssetsLoader.loadAssets(this.app,() => this.assetsLoaded())
    }

    
    private initApp(){
        this.canvas = this.createCanvas();

        this.app = new pc.Application(this.canvas, {
            mouse: new pc.Mouse(this.canvas),
            // touch: new pc.TouchDevice(this.canvas),
            keyboard: new pc.Keyboard(window)
		});

		(this.app as any ).addTweenManager()

        this.app.start();
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

        window.addEventListener("resize", () => {
            this.app.resizeCanvas(this.canvas.width, this.canvas.height);
		});		
		console.log("-----> APP INITIALIZED")
    }


    public assetsLoaded():void{
        console.log("ASSETS LOADED");
        //Ligths
        Lights.addAmbientLight(this.app);
        Lights.createSimpleDirectionalShadowLight(this.app, true);
		//BOX
		//this.createBox();
        //Environmet
        Lights.addSkyBox(this.app, 0, 'background');
		//Ground
		// const ground =this.createGround(new pc.Color().fromString('#ffaa00'));
		// this.app.root.addChild(ground);
		//camera
		//this.createOrbitCamera(ground);
		const camera = this.createFlyCamera();
		const text = this.createText();
		// camera.addChild(text);

		//Add entity
		// const cube = this.addPlayCanvasCube();
		// this.app.root.addChild(cube);
		// this.addTweenEntity(cube,"rotate")

		// //Add entity coche
		// const coche = this.addPlayCanvasCoche();
		// this.app.root.addChild(coche);
		// this.addTweenEntity(coche,"rotate")
		// //var entities = coche.find('name', 'Scene');
		// var ruedas = coche.children[0].children[2].find(function (node) {
		// 	// abajo habria que poner el nombre de las partes a manejar
		// 	return node.name.includes("R");
		// });
		// console.log("Coche: " + coche.children[0].children[2].children[0].children.push.name);
		// ruedas.forEach( element => {
		// 	element.setLocalPosition(10,0.5,10);
		// 	var aux = element as any;
		// 	//this.addTweenEntity(aux,"rotate 60")

		// })
		// //coche.children[0].children[2].children[0] es la rueda FL (Frontal Left)

		//Add entity casa
		const casa = this.addPlayCanvasCasa();
		this.app.root.addChild(casa);
    }


	createBox(){
		var box = new pc.Entity();
        box.addComponent("model", {
            type: "box"
        });
		this.app.root.addChild(box);
	}
    

    private createCanvas():HTMLCanvasElement{
        const canvas:HTMLCanvasElement = document.createElement('canvas')
        canvas.setAttribute('width', '500px')
        canvas.setAttribute('height', '500px')
        document.body.appendChild(canvas);
        return canvas;
    }


	private createStaticCamera(){
		// Create an Entity with a camera component
		var camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.4, 0.45, 0.5)
		});
		// Add the new Entities to the hierarchy
		this.app.root.addChild(camera);
		// Move the camera 10m along the z-axis
		camera.translate(5, 10, 5);
	}


	private createOrbitCamera(lookatEntity:pc.Entity):pc.Entity{
		// Create a camera with an orbit camera script
		var camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.4, 0.45, 0.5)
		});
		camera.addComponent("script");
		if(camera.script){
			camera.script.create("orbitCamera", {
				attributes: {
					inertiaFactor: 0.2, // Override default of 0 (no inertia)
					focusEntity: lookatEntity,
				}
			});
			camera.script.create("orbitCameraInputMouse");
			camera.script.create("orbitCameraInputTouch");
		}
		console.log("cameraScript",camera.script);
		this.app.root.addChild(camera);
		return camera;
		
	}

	private createFlyCamera(){
		const camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.5, 0.5, 0.8),
			nearClip: 0.3,
			farClip: 30
		});
	
		// add the fly camera script to the camera
		camera.addComponent("script");
		if(camera.script){
			camera.script.create("flyCamera", {
				attributes: {
					mode: 1
				}
			})
		}
		console.log("cameraScript",camera.script);
		this.app.root.addChild(camera);
		camera.translate(5, 10, 5);
		//const text = this.createText();
		//camera.addChild(text);
		return camera;
	}

	private createFirstPersonCamera(){
		// Create a camera that will be driven by the character controller
		const camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.4, 0.45, 0.5),
			farClip: 100,
			fov: 65,
			nearClip: 0.1
		});
		camera.setLocalPosition(0, 1, 0);

		// Create a physical character controller
		const characterController = new pc.Entity();
		characterController.addComponent("collision", {
			axis: 0,
			height: 2,
			radius: 0.5,
			type: "capsule"
		});
		characterController.addComponent("rigidbody", {
			angularDamping: 0,
			angularFactor: pc.Vec3.ZERO,
			friction: 0.3,
			linearDamping: 0,
			linearFactor: pc.Vec3.ONE,
			mass: 80,
			restitution: 0,
			type: "dynamic"
		});
		characterController.addComponent("script");
		if (characterController.script) {
			characterController.script.create("characterController");
			characterController.script.create("firstPersonCamera", {
				attributes: {
					camera: camera
				}
			});
			characterController.script.create("gamePadInput");
			characterController.script.create("keyboardInput");
			characterController.script.create("mouseInput");
			characterController.script.create("touchInput");
		}
		characterController.setLocalPosition(0, 1, 10);

		// Add the character controll and camera to the hierarchy
		this.app.root.addChild(characterController);
		characterController.addChild(camera);
	}

	private createText(){
		// Create a 2D screen
		const screen = new pc.Entity();
		screen.addComponent("screen", {
			referenceResolution: new pc.Vec2(1280, 720),
			scaleBlend: 0.5,
			scaleMode: pc.SCALEMODE_BLEND,
			screenSpace: true
		});
		this.app.root.addChild(screen);
		// Create a basic text element
		const text = new pc.Entity();
		text.addComponent("element", {
			anchor: new pc.Vec4(0.1, 0.1, 0.5, 0.5),
			fontAsset: this.app.assets.find("font"),
			fontSize: 28,
			color: pc.Color.BLACK,
			pivot: new pc.Vec2(0.5, 0.1),
			text: "Aqui iria la seleccion",
			type: pc.ELEMENTTYPE_TEXT,
			alignment: pc.Vec2.ZERO
		});
		screen.addChild(text);
		console.log(text.element?.text);
		return text;
	}


	private createGround(color:pc.Color):pc.Entity{
		var ground = new pc.Entity("ground");
		ground.addComponent("model", {
			type: "box",
			castShadows: false
		});
		ground.setLocalScale(12, 0.22, 8 );
		ground.setLocalPosition(4, -0.11, 2);

		var material:pc.StandardMaterial = this.createMaterial(color,color);
		material
		if(ground.model){
			ground.model.material = material;
		}
		return ground;
	}
		


	private createMaterial (ambient:pc.Color, diffuse:pc.Color, blend?:boolean, opacity?:number) {
		var material:pc.StandardMaterial = new pc.StandardMaterial();
		material.diffuse = diffuse;
		material.ambient = ambient;
		if(opacity)	material.opacity = opacity;
		if(blend) material.blendType = pc.BLEND_ADDITIVE;
		material.update();
		return material;
	}


	addPlayCanvasCube(){
		var asset:pc.Asset = this.app.assets.find("cube");
		const entity = new pc.Entity("playCanvasCube");
		entity.addComponent("model", {
			type: "asset",
			asset: asset.resource.model,
			castShadows: true
		});
		entity.setLocalPosition(3,0.5,3);
		return entity;
	}


	addPlayCanvasCoche(){
		var asset:pc.Asset = this.app.assets.find("coche");
		const entity = new pc.Entity("playCanvasCube");
		entity.addComponent("model", {
			type: "asset",
			asset: asset.resource.model,
			castShadows: true
		});
		entity.setLocalPosition(10,0.5,10);
		return entity;
	}


	addPlayCanvasCasa(){
		var asset:pc.Asset = this.app.assets.find("casa");
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
		var tejados = entity.children[0].find(function (node) {
			// abajo habria que poner el nombre de las partes a manejar
			return node.name.toLowerCase().includes("roof") || node.name.toLowerCase().includes("tejado");
		});
		tejados.forEach( element => {
			element.setLocalPosition(element.getLocalPosition().x,element.getLocalPosition().y+10,element.getLocalPosition().z)
			console.log("Casa: " + element.name);
		})
		return entity;
	}


	addTweenEntity(entity:pc.Entity, animationName:string){
		if(animationName == "rotate"){
			const pca = pc as any;
			const entitya = entity as any;
			entitya
			.tween(entity.getLocalRotation())
			.rotate(new pc.Vec3(180, 0, 180), 5.0, pca.Linear)
			.loop(true)
			.yoyo(true)
			.start();
		}
		if(animationName == "rotate 60"){
			const pca = pc as any;
			const entitya = entity as any;
			entitya
			.tween(entity.getLocalRotation())
			.rotate(new pc.Vec3(30, 0, 0), 5.0, pca.Linear)
			.loop(true)
			.yoyo(true)
			.start();
		}
	}
}