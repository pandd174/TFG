
import * as pc from 'playcanvas';
import { getAssetPath } from './helpers';

class AssetDesc{
    id:string;
    type:string;
    url:string;
    tag:string;
    options?:{};
}

const assetsDesc:AssetDesc[] = [
	//Models
		{ id:"jump", type:"audio", url:"./objects/jump.mp3", tag:"init"},
		{ id:"background", type:"cubemap", url:"./images/helipad.dds", tag:"init", options:{ type: pc.TEXTURETYPE_RGBM}},
		{ id:"font", type:"font", url:"./fonts/arial.json", tag:"init"},
        { id:"cube", type:"container", url:"./objects/cube.glb", tag:"init"},   
        { id:"coche", type:"container", url:"./objects/uploads_files_2792345_Koenigsegg.glb", tag:"init"},   
		{ id:"orbitCamera", type:"script", url:"./cameras/orbit-camera.js", tag:"init"}
	];



export class AssetsLoader{

    public static loadAssets(app:pc.Application, allAssetsLoaded: () => void):void{
        console.log("loading Assets");
        assetsDesc.forEach((data:AssetDesc) =>{
            const asset = new pc.Asset(data.id, data.type, {
                url: getAssetPath(data.url)}, data.options);
            asset.tags.add(data.tag.split(' '));
            asset.tags.add(data.id);
            app.assets.add(asset);
        });
        
        //First load only the ones with 'init' Tag
        const assets = app.assets.findByTag('init');
        let assetsLoaded = 0;
        const assestTotal = assets.length;

        // Start loading all the assets
        for(var i = 0; i < assets.length; i++) {
            assets[i].ready(()=>{
                assetsLoaded += 1;        
            // Update the progress bar
            //self.setLoadingBarProgress(assetsLoaded / assestTotal);        
            if (assetsLoaded === assestTotal) {
                allAssetsLoaded();
            }        
            });
            app.assets.load(assets[i]);
        }

        if (!assets.length) {
            allAssetsLoaded();
        }    
    }

}