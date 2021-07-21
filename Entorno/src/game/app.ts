
import {Lights} from './lights'
import * as pc from 'playcanvas'
import {AssetsLoader} from './assets-loader'
import {Objects} from './addObjects'
import {Cameras} from './createsCameras'

export class App {
    public app:pc.Application
    private canvas:HTMLCanvasElement
	private assets: { font: pc.Asset }
	private especial:Boolean


    public get App(): pc.Application {
        return this.app;
    };


    public Awake(): void {
        this.initApp();
        AssetsLoader.loadAssets(this.app,() => this.assetsLoaded())
    }

    
    private initApp(){
		this.especial=false;
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
		Objects.prototype.initializeInteractiveParts();
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
		const allCameras = new Cameras();
		const camera = allCameras.createFlyCamera();
		this.app.root.addChild(camera);
		var text = this.createText((allCameras.scripts[0].__attributes.text as any));
		// console.log('En app.ts ', camera.script?.get('flyCamera'))
		// console.log('En createsCameras.ts ', allCameras.scripts[0].__attributes.text);
		// console.log('texto de pantalla ', (text.findComponent("element") as any));
		// console.log('texto de pantalla TEXTO ', (text.findComponent("element") as any)._text);
		var thisAux = this;
		camera.script?.get('flyCamera')?.on("attr:text", function (dt) {
			text.destroy();
			let textoAux = allCameras.scripts[0].__attributes.text;
			text = thisAux.createText(textoAux);
			thisAux.especial = false;
			Objects.prototype.interactiveParts.forEach(part => {
				part.name.forEach(name => {
					if (textoAux.toLowerCase().includes(name)) {
						text.destroy();
						text = thisAux.createText(textoAux + " \n" + part.textInstructions);
						thisAux.especial = true;
					}
				});
			})
			//text.findComponent("element");
		})
		// listen for the player:move event
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
		const casa = Objects.prototype.addPlayCanvasCasa(this.app);
		this.app.root.addChild(casa);

		var thisAux = this;
		var entidad = casa;
		this.app.keyboard.on("keydown", function (e) {
			switch (e.key) {
				case pc.KEY_X:
					let indl = entidad.model?.meshInstances.findIndex((value: pc.MeshInstance) => {
						return allCameras.scripts[0].__attributes.text.toLowerCase().includes(value.node.name.toLowerCase())
					});
					console.log("pulso izq " + indl);
					if (indl!=-1 && indl && indl>0) {
						let aux = entidad.model?.meshInstances[(indl-1)];
						allCameras.scripts[0].__attributes.text=aux?.node.name;
						text.destroy();
						text = thisAux.createText(aux?.node.name);
						thisAux.especial = false;
						Objects.prototype.interactiveParts.forEach(part => {
							part.name.forEach(name => {
								if (aux?.node.name.toLowerCase().includes(name)) {
									text.destroy();
									text = thisAux.createText(aux?.node.name + " \n" + part.textInstructions);
									thisAux.especial = true;
								}
							});
						})
					}
					break;
				case pc.KEY_C:
					let indr = entidad.model?.meshInstances.findIndex((value: pc.MeshInstance) => {
						return allCameras.scripts[0].__attributes.text.toLowerCase().includes(value.node.name.toLowerCase())
					});
					console.log("pulso der " + indr);
					if (indr!=-1 && indr && entidad.model && entidad.model.meshInstances[(indr+1)]) {
						let aux = entidad.model?.meshInstances[(indr+1)];
						allCameras.scripts[0].__attributes.text=aux?.node.name;
						text.destroy();
						text = thisAux.createText(aux?.node.name);
						thisAux.especial = false;
						Objects.prototype.interactiveParts.forEach(part => {
							part.name.forEach(name => {
								if (aux?.node.name.toLowerCase().includes(name)) {
									text.destroy();
									text = thisAux.createText(aux?.node.name + " \n" + part.textInstructions);
									thisAux.especial = true;
								}
							});
						})
					}
					break;
				case pc.KEY_1:
					if (thisAux.especial) { thisAux.cambiar(1, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_2:
					if (thisAux.especial) { thisAux.cambiar(2, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_3:
					if (thisAux.especial) { thisAux.cambiar(3, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_4:
					if (thisAux.especial) { thisAux.cambiar(4, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_5:
					if (thisAux.especial) { thisAux.cambiar(5, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_6:
					if (thisAux.especial) { thisAux.cambiar(6, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_7:
					if (thisAux.especial) { thisAux.cambiar(7, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_8:
					if (thisAux.especial) { thisAux.cambiar(8, entidad, allCameras.scripts[0].__attributes.text); }
					break;
				case pc.KEY_9:
					if (thisAux.especial) { thisAux.cambiar(9, entidad, allCameras.scripts[0].__attributes.text); }
					break;
			}
		}, this);
    }
    

    private createCanvas():HTMLCanvasElement{
        const canvas:HTMLCanvasElement = document.createElement('canvas')
        canvas.setAttribute('width', '500px')
        canvas.setAttribute('height', '500px')
        document.body.appendChild(canvas);
        return canvas;
    }

	private createText(textoReferencia:any){
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
			text: textoReferencia,
			type: pc.ELEMENTTYPE_TEXT,
			alignment: pc.Vec2.ZERO
		});
		screen.addChild(text);
		console.log(text.element?.text);
		return text;
	}


	cambiar(tecla:number, entity:pc.Entity, textoAux:string){
		let meshInstance = entity.model?.meshInstances.find((value: pc.MeshInstance) => {return textoAux.toLowerCase().includes(value.node.name.toLowerCase())});
		let tipo:number=-1;
		tipo = Objects.prototype.interactiveParts.findIndex( (value) => {
			let boolAux=false;	value.name.forEach((text) => {
				if (!boolAux && meshInstance) boolAux = meshInstance?.node.name.toLowerCase().includes(text);
			}) 
			return boolAux;
		})
		if (meshInstance) { 
			//Azul, Amarillo, Blanco, Cian, Gris, Magenta, Negro, Rojo, Verde
			switch (tecla) {
				case 1:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.BLUE, 'BLUE', true, 0);
							console.log("Entro")
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
						case 1:
							let light = entity.findComponent((meshInstance.node.children[0] as pc.Entity).name);
							if (light==undefined) {
								entity.addComponent('light', (meshInstance.node.children[0] as pc.Entity))
							}
							break;
						case 2:
							
							break;
						case 3:
							this.addTweenEntity((meshInstance.node as pc.Entity),"rotate door");
							console.log("Puerta debe de hacer algo")
							break;
						default:
							console.log("Tipo: " + tipo + " no existe")
					}
					break;
					
				case 2:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.YELLOW, 'YELLOW', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
						case 1:
							let light = entity.findComponent((meshInstance.node.children[0] as pc.Entity).name);
							if (light) {
								entity.removeComponent('light')
							}
							break;
						case 2:
							
							break;
					}
					break;
					
				case 3:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.WHITE, 'WHITE', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
					}
					break;
					
				case 4:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.CYAN, 'CYAN', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
					}
					break;
					
				case 5:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.GRAY, 'GRAY', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
					}
					break;
					
				case 6:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.MAGENTA, 'MAGENTA', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
					}
					break;
					
				case 7:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.BLACK, 'BLACK', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
					}
					break;

				case 8:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.RED, 'RED', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
					}
					break;
					
				case 9:
					switch (tipo) {
						case 0:
							var materialAux = Objects.prototype.createMaterial(pc.Color.WHITE, pc.Color.GREEN, 'GREEN', true, 0);
							//materialAux.blendType = pc.BLEND_NORMAL;
							meshInstance.material.destroy();
							meshInstance.material = materialAux;
							meshInstance.material.update();
							break;
					}
					break;
				default:
					console.log("Tecla " + tecla + " no establecida");
			}
			console.log(meshInstance.node.name + " color: " +  meshInstance.material.name);
		}
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
		if(animationName == "rotate door"){
			const pca = pc as any;
			const entitya = entity as any;
			entitya
			.rotate(new pc.Vec3(0, 90, 0))
		}
	}
}