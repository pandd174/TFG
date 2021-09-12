import * as BABYLON from 'babylonjs';
import { BabylonFileLoaderConfiguration } from 'babylonjs';
import 'babylonjs-loaders'; //Para que funcionen los loaders

export default class AssetsLoader {
    
    private _scene: BABYLON.Scene;
    private _assetsManager : BABYLON.AssetsManager;
	private _assets = [
            // { id:"bomba", type:"mesh", url:"./assets/objects/", file:"bomba.glb", tag:"init"},
            // { id:"turbina", type:"mesh", url:"./assets/objects/", file:"turbina.glb", tag:"init"},
            // { id:"wturbine", type:"mesh", url:"./assets/objects/", file:"windTurbine.glb", tag:"init"},
            // { id:"helipad", type:"cubeTexture", url:"./assets/objects/", file:"helipad.dds", tag:"init"},
            // { id:"environment", type:"cubeTexture", url:"./assets/objects/", file:"environmentSpecular.env", tag:"init"},
            // { id:"cube", type:"mesh", url:"./assets/objects/", file:"cube.glb", tag:"init"},
            // { id:"coche", type:"mesh", url:"./assets/objects/", file:"uploads_files_2792345_Koenigsegg.glb", tag:"init"},
            //{ id:"modelo", type:"mesh", url:"./assets/objects/", file:"ejemplo_2_mod.glb", tag:"init"},
            //{ id:"cocheDaVinci", type:"mesh", url:"./assets/objects/", file:"CocheDaVinci.glb", tag:"init"},
            { id:"cocheDaVinci3", type:"mesh", url:"./assets/objects/", file:"CocheDaVinci2.2.glb", tag:"init"},
            //{ id:"cubo", type:"mesh", url:"./assets/objects/", file:"cuboPrueba.glb", tag:"init"},
            { id:"hangar", type:"mesh", url:"./assets/objects/", file:"Hangar.glb", tag:"init"}
        ];
    private _assetsLoaded = 0;

    constructor(scene : BABYLON.Scene) {
        this._scene = scene;
        this._assetsManager = new BABYLON.AssetsManager(scene);
    }

    loadAssets(callbackFunc:any){
        this._assets.forEach( (asset) => {
            console.log("id:",asset.id, asset.type, asset.file, asset.url);
            let meshTask = asset.type == "mesh" ? this._assetsManager.addMeshTask(asset.id, "", asset.url, <string>asset.file)
                                                    : this._assetsManager.addCubeTextureTask(asset.id, asset.url + asset.file);
            meshTask.onSuccess =  (task:any) =>{
                if (task.name.includes("cocheDaVinci")) { this.addcocheDaVinciTag(task) }
                if (task.name.includes("hangar")) { this.addHangarTag(task) }
                this._assetsLoaded++;
                console.log("mesh loaded:",task);
	           // task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
            }
            meshTask.onError =  (task:any, message:any, exception:any) =>{
                console.log("Error:",message, exception);
            }
        });

        this._assetsManager.onFinish =  (tasks) => {
            console.log("Finish Loading");
            callbackFunc();
        };
        
        this._assetsManager.load();
    }


    addcocheDaVinciTag(task:any) {
        console.log("DA VINCI CARE");
        for (let i = 0; i < task.loadedMeshes.length; i++) {
            //console.log(task.loadedMeshes[i].name);
            const element = task.loadedMeshes[i];
            BABYLON.Tags.AddTagsTo(element, 'cocheDaVinci');
        }
        console.log("DA VINCI CARE FINITO");
    }


    addHangarTag(task:any) {
        for (let i = 0; i < task.loadedMeshes.length; i++) {
            //console.log(task.loadedMeshes[i].name);
            const element = task.loadedMeshes[i];
            BABYLON.Tags.AddTagsTo(element, 'Hangar');
        }
    }
}