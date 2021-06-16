
import {Lights} from './lights'
import * as pc from 'playcanvas'
import {AssetsLoader} from './assets-loader'

export class App {
    public app:pc.Application
    private canvas:HTMLCanvasElement


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
            touch: new pc.TouchDevice(this.canvas),
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
		this.createBox();
        //Environmet
        Lights.addSkyBox(this.app, 0, 'background');
		//Ground
		const ground =this.createGround(new pc.Color().fromString('#ffaa00'));
		this.app.root.addChild(ground);
		//camera
		this.createOrbitCamera(ground);

		//Add entity
		const cube = this.addPlayCanvasCube();
		this.app.root.addChild(cube);
		this.addTweenEntity(cube,"rotate")

		//Add entity coche
		const coche = this.addPlayCanvasCoche();
		this.app.root.addChild(coche);
		this.addTweenEntity(coche,"rotate")
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
		camera.translate(0, 0, 10);
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
	}
}