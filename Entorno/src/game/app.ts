
import {Lights} from './lights'
import * as pc from 'playcanvas'
import {AssetsLoader} from './assets-loader'
import {Objects} from './addObjects'
import {Cameras} from './createsCameras'

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
		//Cameras.prototype.createOrbitCamera(ground);
		const camera = Cameras.prototype.createFlyCamera();
		const text = this.createText();
		// camera.addChild(text);

		//Add entity
		// const cube = Objects.prototype.addPlayCanvasCube();
		// this.app.root.addChild(cube);
		// this.addTweenEntity(cube,"rotate")

		// //Add entity coche
		// const coche = Objects.prototype.addPlayCanvasCoche();
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
		const casa = Objects.prototype.addPlayCanvasCasa();
		this.app.root.addChild(casa);
    }
    

    private createCanvas():HTMLCanvasElement{
        const canvas:HTMLCanvasElement = document.createElement('canvas')
        canvas.setAttribute('width', '500px')
        canvas.setAttribute('height', '500px')
        document.body.appendChild(canvas);
        return canvas;
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