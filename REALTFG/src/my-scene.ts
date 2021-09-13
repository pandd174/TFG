import * as BABYLON from 'babylonjs';
import { BabylonFileLoaderConfiguration, WebXRExperienceHelper, Mesh, ShadowGenerator } from 'babylonjs';
import 'babylonjs-loaders'; //Para que funcionen los loaders
import * as Objects from './addObjects'
import * as BABYLONGUI from 'babylonjs-gui';


import AssetsLoader from './assets-loader';

export default class MyScene {
    //private _xrHelper: BABYLON.WebXRExperienceHelper;
    private _xrHelper: BABYLON.WebXRDefaultExperience;
    //private _xrHelper: BABYLON.VRExperienceHelper;
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    //private _camera: BABYLON.ArcRotateCamera;
    private _camera: BABYLON.Camera;
    private _light: BABYLON.IShadowLight;
    private _assetsLoader: AssetsLoader;
    private _sessionManager:BABYLON.WebXRSessionManager;
    private _environment:BABYLON.EnvironmentHelper;

    private _ground:Mesh;
    private _shadowGenerator:ShadowGenerator;
    private _vrEnable:Boolean = true;

    get scene(): BABYLON.Scene {
        return this._scene;
    }

    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() {
        this._scene = new BABYLON.Scene(this._engine);
        this._sessionManager = new BABYLON.WebXRSessionManager(this._scene);
        // if (this._sessionManager.isSessionSupportedAsync('immersive-vr') && this._vrEnable)
            //this.createCameraXR();
        // else
            this.createCamera();
            //this.createCamera3();
        this.createBasicLight();
        
        this._assetsLoader = new AssetsLoader(this._scene);
        this._assetsLoader.loadAssets(()=>this.createElements());
        //console.log("Has pasao")

        if (this._vrEnable) {
            //this.addXRSupport();
            //this._xrHelper =  this._scene.createDefaultVRExperience({});
            //this._xrHelper.enableTeleportation({floorMeshes: [this._ground]});
            // var leftHand = BABYLON.Mesh.CreateBox("",0.1, this._scene)
            // leftHand.scaling.z = 2;
            // var rightHand = leftHand.clone()
            // var head = BABYLON.Mesh.CreateBox("",0.2, this._scene) 
            // this._scene.onBeforeRenderObservable.add(()=>{
            //     // Left and right hand position/rotation
            //     if(this._xrHelper.input){
            //         leftHand.position = this._xrHelper.webVRCamera.leftController.devicePosition.clone()
            //         leftHand.rotationQuaternion = this._xrHelper.webVRCamera.leftController.deviceRotationQuaternion.clone()
            //     }
            //     if(this._xrHelper.input){
            //         rightHand.position = this._xrHelper.webVRCamera.rightController.devicePosition.clone()
            //         rightHand.rotationQuaternion = this._xrHelper.webVRCamera.rightController.deviceRotationQuaternion.clone()
            //     }
                // if(this._scene.activeCamera === vrHelper.vrDeviceOrientationCamera){
                //     BABYLON.FreeCameraDeviceOrientationInput.WaitForOrientationChangeAsync(1000).then(()=>{
                //         // Successfully received sensor input
                //     }).catch(()=>{
                //         alert("Device orientation camera is being used but no sensor is found, prompt user to enable in safari settings");
                //     })
                // }
        
                // // Head position/rotation
                // head.position = vrHelper.webVRCamera.devicePosition.clone()
                // head.rotationQuaternion = vrHelper.webVRCamera.deviceRotationQuaternion.clone()
                // head.position.z = 2;
            //})
        }
    }

    async addXRSupport(): Promise<BABYLON.WebXRDefaultExperience> {
        try {
            console.log("Environment: " + this._environment.ground)
            console.log("Suelo: " + this._ground)
            this._xrHelper =  await this._scene.createDefaultXRExperienceAsync({
                floorMeshes: [this._ground]
            });
            console.log("Ready XR")
            //this.controlPointer();
            this._xrHelper.input.onControllerAddedObservable.add((controller) => {
                // future safe
                if (controller.onMeshLoadedObservable) {
                    controller.onMeshLoadedObservable.addOnce((rootMesh) => {
                        this._shadowGenerator.addShadowCaster(rootMesh, true);
                    });
                } else {
                    controller.onMotionControllerInitObservable.addOnce((motionController) => {
                        motionController.onModelLoadedObservable.addOnce(() => {
                            this._shadowGenerator.addShadowCaster((<BABYLON.AbstractMesh>motionController.rootMesh), true);
                        });
                    });
                }
            });
        } catch (e) {
            // no XR support
            console.error("No XR: " + e)
            this._vrEnable = false;
        }
        return this._xrHelper;
    }

    createElements():void{
        console.log("createElements");
        this.createGround();

        // this.createAndPositionWTurbines();
        // this.animateWTurbines();

        // this.createAndPositionBombas();
        // this.animateBombas();

        // this.createAndPositionTurbinas();
        // this.animateTurbinas();

        this.createEnvironment();
		// Objects.Objects.prototype.initializeInteractiveParts();
		const coche = Objects.Objects.prototype.addCocheDaVinci(this._scene, this._shadowGenerator);
        const hangar = Objects.Objects.prototype.addHangar(this._scene, this._shadowGenerator);
        // Objects.Objects.prototype.animateDoor(this._scene)
        
        //this.createGUI();
        console.log("ASSETS LOADED");
        console.log(this._scene.animationGroups);
        this.animations(1, this._scene, false);

        
        //this.createCamera2();
        //this.createBasicLight();
        if (this._vrEnable) 
            this.addXRSupport();
    }

    createCamera():void{
        //this._camera  = new BABYLON.ArcRotateCamera("Camera", 0.7, 0.7, 12, new BABYLON.Vector3(0, 0, 0), this._scene);
        // this._camera.wheelPrecision = 20; 
        // this._camera.attachControl(this._canvas, false);
        // this._camera = new BABYLON.FreeCamera('Camera', new BABYLON.Vector3(0,0,10), this._scene);
        // var inputManager = this._camera.inputs;
        // inputManager.add(new BABYLON.FreeCameraMouseInput())
        // inputManager.add(new BABYLON.FreeCameraMouseWheelInput())
        // inputManager.add(new BABYLON.FreeCameraKeyboardMoveInput())
        // this._camera.attachControl(this._canvas, false);
        this._camera = new BABYLON.FreeCamera('Camera', new BABYLON.Vector3(0,2,0), this._scene);
        var inputManager = this._camera.inputs;
        inputManager.add(new BABYLON.FreeCameraMouseInput())
        //inputManager.add(new BABYLON.FreeCameraMouseWheelInput())
        var walkableCamera = new BABYLON.FreeCameraKeyboardMoveInput();
        walkableCamera.keysDownward = [];
        walkableCamera.keysUpward = [];
        inputManager.add(walkableCamera)
        this._camera.attachControl();
        (<BABYLON.FreeCamera>this._camera).speed = 0.1;
        (<BABYLON.FreeCamera>this._camera).checkCollisions = true;
    }

    createCamera3():void{
        const box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, this._scene); 
        // Parameters : name, position, scene
        this._camera = new BABYLON.FollowCamera("FollowCamera", new BABYLON.Vector3(0, 1, 2), this._scene);
        var inputManager = this._camera.inputs;
        inputManager.add(new BABYLON.FollowCameraPointersInput());

        (<BABYLON.FollowCamera>this._camera).target = box.position;
        (<BABYLON.FollowCamera>this._camera).radius = 10;
        (<BABYLON.FollowCamera>this._camera).heightOffset = 0;
        this._camera.attachControl(this._canvas, true);
    }

    createCameraXR():void{
        this._sessionManager.initializeSessionAsync('immersive-vr');
        const referenceSpace = this._sessionManager.setReferenceSpaceTypeAsync();
        const renderTarget = this._sessionManager.getWebXRRenderTarget();
        const xrWebGLLayer = renderTarget.initializeXRLayerAsync(this._sessionManager.session);
        this._sessionManager.runXRRenderLoop();
        this._camera = new BABYLON.WebXRCamera('Camera', this._scene, this._sessionManager);
        this._camera.attachControl();
    }

    createBasicLight():void{
        this._light = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(1,-1,-1), this._scene);
        this._light.position = new BABYLON.Vector3(0,10,10);
        var aux = this;
        this._scene.registerBeforeRender(function () {
            aux._light.position = aux._camera.position;
        });
        this._shadowGenerator = new BABYLON.ShadowGenerator(1024, this._light);
        this._shadowGenerator.usePercentageCloserFiltering = true;
        this._shadowGenerator.bias = 0.00001;
    }

    createEnvironment():void{
        this._environment = (<BABYLON.EnvironmentHelper>this._scene.createDefaultEnvironment());
    }

    createEnvironment2():void{
        //this._scene.createDefaultEnvironment();
        /*
        console.log("creating skydoom");
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./assets/objects/environmentSpecular.env", this._scene);
        console.log("hdrTexture",hdrTexture);
        this._scene.environmentTexture = hdrTexture;
        */
        // Environment Texture
        var hdrTexture = new BABYLON.HDRCubeTexture("./assets/objects/country.hdr", this._scene, 512);
        
        // Skybox
        var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, this._scene);
        var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", this._scene);
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        hdrSkyboxMaterial.microSurface = 1.0;
        hdrSkyboxMaterial.cameraExposure = 0.6;
        hdrSkyboxMaterial.cameraContrast = 1.6;
        hdrSkyboxMaterial.disableLighting = true;
        hdrSkybox.material = hdrSkyboxMaterial;
        hdrSkybox.infiniteDistance = true;
    }

    createGround():void{
        // Create a built-in "ground" shape.
        this._ground = BABYLON.MeshBuilder.CreateGround('ground',
                                {width: 20, height: 35, subdivisions: 4}, this._scene);
        // const groundMaterial = new BABYLON.StandardMaterial("groundMaterial",  this._scene);
        // groundMaterial.diffuseColor = BABYLON.Color3.FromHexString('#454649');
        // //groundMaterial.specularColor = BABYLON.Color3.FromHexString('#101010');
        this._ground.receiveShadows = true;
        // this._ground.material = groundMaterial;
    }

    // createAndPositionWTurbines(): void{
    //     let posZ = -2.5;
    //     let posX = -4.5;
    //     const wturbine = <BABYLON.Mesh> this._scene.getMeshByName("windTurbine");
    //     this._shadowGenerator.addShadowCaster(wturbine);
    //     wturbine.position.z = posZ;
    //     wturbine.position.x = posX;

    //     [1,2,3,4,5].forEach((p)=>{
    //         let clonedWTurbine = wturbine.clone("wturbine" +p);  
    //         BABYLON.Tags.AddTagsTo(clonedWTurbine, "wturbine animable " + "wturbine" +p);
    //         if(p%2){
    //             BABYLON.Tags.AddTagsTo(clonedWTurbine, "animar");
    //             //clonedWTurbine.material.wireframe = true;
    //         }
    //         clonedWTurbine.position.x = posX + p -1;
    //         this._shadowGenerator.addShadowCaster(clonedWTurbine);
    //     })
    //     wturbine.setEnabled(false); //El objecto origen lo ocultamos
    // }


    // createAndPositionBombas(): void{
    //     let posZ = -0.5;
    //     let posX = 4.5;
    //     const bomba = <BABYLON.Mesh> this._scene.getMeshByName("bomba");
    //     this._shadowGenerator.addShadowCaster(bomba);
    //     bomba.position.x = posX;
    //     bomba.position.z = posZ;
    //     [1,2,3,4,5,6].forEach((p)=>{
    //         let clonedBomba = bomba.clone("bomba" +p);
	// 	    BABYLON.Tags.AddTagsTo(clonedBomba, "bomba animable " + "bomba" +p);
    //         clonedBomba.position.z = posZ + (p -1)*0.75;
    //         if (clonedBomba.getChildMeshes()[0].material)
    //             clonedBomba.getChildMeshes()[0].material = <BABYLON.Material>clonedBomba.getChildMeshes()[0].material?.clone("bomba" +p);
    //         if(p%2 != 1){
    //             BABYLON.Tags.AddTagsTo(clonedBomba, "animar");
    //         }
    //         this.addAnimColor(clonedBomba, BABYLON.Color3.Red(), BABYLON.Color3.Blue());
    //         this._shadowGenerator.addShadowCaster(clonedBomba);
    //     })
    //     bomba.setEnabled(false); //El objecto origen lo ocultamos
    // }


    // createAndPositionTurbinas(): void{
    //     let posZ = 0;
    //     let posX = 0.5;
    //     const turbina = <BABYLON.Mesh> this._scene.getMeshByName("turbina");
    //     this._shadowGenerator.addShadowCaster(turbina);
    //     turbina.position.x= posX;
    //     turbina.position.z= posZ;
    //     [1,2,3,4].forEach((p)=>{
    //         let clonedTurbina = turbina.clone("turbina" +p);
	// 	    BABYLON.Tags.AddTagsTo(clonedTurbina, "turbina animable " + "turbina" +p);
    //         clonedTurbina.position.x = posX + (p -1)*0.75;
    //         if(p%2 != 1){
    //             BABYLON.Tags.AddTagsTo(clonedTurbina, "animar");
    //         }           
    //         this.addAnimColor(clonedTurbina, BABYLON.Color3.Magenta(), BABYLON.Color3.Green());
    //         this._shadowGenerator.addShadowCaster(clonedTurbina);
    //     })
    //     turbina.setEnabled(false); //El objecto origen lo ocultamos
    // }

    addAnimColor(mesh:any,stoppedColor:BABYLON.Color3, animedColor:BABYLON.Color3){
        const color = mesh.matchesTagsQuery("animar") ? animedColor : stoppedColor;
        var mat = <BABYLON.PBRMaterial>mesh.getChildMeshes()[0].material?.clone(<string>mesh.getChildMeshes()[0].material?.name);
        mesh.getChildMeshes()[0].material = mat;
        mat.albedoColor = color;
    }

    doRender() : void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    private deg2rad(degree:number): number{
        return degree * Math.PI / 180;
    }

    // animateWTurbines():void{

    //     this._scene.onBeforeRenderObservable.add(() => {
    //         this._scene.getMeshesByTags("wturbine && animar", function (ct:BABYLON.AbstractMesh) { 
    //             ct.getChildMeshes()[1].rotate(BABYLON.Axis.Y, -0.05, BABYLON.Space.LOCAL);
    //             if(Number(ct.name.charAt(8))%2 == 1) //SOLO LAS IMPARES
    //                 ct.getChildMeshes()[0].rotate(BABYLON.Axis.Y, -0.005, BABYLON.Space.LOCAL);
    //         });
    //     })
    // }

    // animateBombas():void{
    //     this._scene.onBeforeRenderObservable.add(() => {
    //         this._scene.getMeshesByTags("bomba && animar", function (ct:BABYLON.AbstractMesh) { 
    //                 ct.getChildMeshes()[0].rotate(BABYLON.Axis.Y, -0.03, BABYLON.Space.LOCAL);
    //                 //mat.emissiveColor = BABYLON.Color3.Red(); //4573D5
    //                 //mat.wireframe=true;
    //         });
    //     })
    // }

    // animateTurbinas():void{
    //     this._scene.onBeforeRenderObservable.add(() => {
    //         this._scene.getMeshesByTags("turbina && animar", function (ct:BABYLON.AbstractMesh) { 
    //                 ct.getChildMeshes()[0].rotate(BABYLON.Axis.Y, -0.03, BABYLON.Space.LOCAL);
    //         });
    //     })
    // }

    // createAnimation(){
    //     const frameRate = 10;
    //     const xRotate = new BABYLON.Animation("xRotate", "rotation.x", frameRate, 
    //             BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    //     const keyFrames = []; 
    //     keyFrames.push({ frame: 0, value: 2 });
    //     keyFrames.push({ frame: frameRate,  value: -2  });
    //     keyFrames.push({ frame: 2 * frameRate, value: 2 });
    //     xRotate.setKeys(keyFrames);
    //     return xRotate;
    // }

    // addAnimatedCube(){
    //     const box = BABYLON.MeshBuilder.CreateBox("box", {});
    //     console.log("box",box);
    //     box.position.x = 2;
    //     const frameRate = 10;
    //     const xrotation = this.createAnimation();
    //     box.animations.push(xrotation);
    //     this._scene.beginAnimation(box, 0, 2 * frameRate, true);
    // }

    animations (modo:Number, escena:BABYLON.Scene, unirDesmembrar?: Boolean|false){
        switch (modo) {
            case 1:
                escena.animationGroups.forEach(element => {
                    if (BABYLON.Tags.HasTags(element) && BABYLON.Tags.GetTags(element).includes('animacionInactiva')) {
                        if ((element.name.includes('desmembrar') || element.name.includes('unir')) && unirDesmembrar) {
                            BABYLON.Tags._RemoveTagFrom(element, 'animacionInactiva')
                        } else { 
                            BABYLON.Tags._RemoveTagFrom(element, 'animacionInactiva')
                        }
                    }
                    if ((element.name.includes('desmembrar') || element.name.includes('unir')) && unirDesmembrar) {
                        BABYLON.Tags.AddTagsTo(element, "animacionActiva");
                        element.play()
                    } else if (!(element.name.includes('desmembrar') || element.name.includes('unir'))) {
                        BABYLON.Tags.AddTagsTo(element, "animacionActiva");
                        element.play()
                        element.loopAnimation = true;
                    }
                });
                break;
            case 2:
                escena.animationGroups.forEach(element => {
                    if (BABYLON.Tags.HasTags(element) && BABYLON.Tags.GetTags(element).includes('animacionActiva')) 
                        BABYLON.Tags._RemoveTagFrom(element, 'animacionActiva')
                    BABYLON.Tags.AddTagsTo(element, "animacionInactiva");
                    element.pause()
                    element.loopAnimation = false;
                });
                break;
            case 3:
                console.log("desmembrar")
                escena.animationGroups.forEach(element => {
                    if (BABYLON.Tags.HasTags(element) && BABYLON.Tags.GetTags(element).includes('animacionInactiva') && element.name.includes('desmembrar'))
                        BABYLON.Tags._RemoveTagFrom(element, 'animacionInactiva')
                    if (element.name.includes('desmembrar')){
                        BABYLON.Tags.AddTagsTo(element, "animacionActiva");
                        console.log(element)
                        element.play()
                        element.onAnimationEndObservable.add(function(eventData: BABYLON.TargetedAnimation, eventState: BABYLON.EventState) {
                            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                            BABYLON.Tags._RemoveTagFrom(element, 'animacionActiva')
                            BABYLON.Tags.AddTagsTo(element, "animacionInactiva");
                        });
                    }
                });
                break;
            case 4:
                console.log("unir")
                escena.animationGroups.forEach(element => {
                    if (BABYLON.Tags.HasTags(element) && BABYLON.Tags.GetTags(element).includes('animacionInactiva') && element.name.includes('unir')) 
                        BABYLON.Tags._RemoveTagFrom(element, 'animacionInactiva')
                    if (element.name.includes('unir')) {
                        BABYLON.Tags.AddTagsTo(element, "animacionActiva");
                        element.play()
                        element.onAnimationEndObservable.add(function(eventData: BABYLON.TargetedAnimation, eventState: BABYLON.EventState) {
                            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                            BABYLON.Tags._RemoveTagFrom(element, 'animacionActiva')
                            BABYLON.Tags.AddTagsTo(element, "animacionInactiva");
                        });
                    }
                });
                break;
            default:
                console.error("No existe el modo: " + modo);
                break;
        }
    }
}