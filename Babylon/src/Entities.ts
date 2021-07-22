import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

export default class Entities {

    private _scene: BABYLON.Scene;
    private _plane: BABYLON.Mesh;
    private _button: GUI.Button;
    private _panel = new GUI.StackPanel();
    private _textBlock = new GUI.TextBlock();
    private _picker = new GUI.ColorPicker();

    constructor(scene : BABYLON.Scene) {
        this._scene = scene;
        this.createPanel();
    }

    listenToEvents(): void{
        this.addClickSelectObject();
    }

    private addClickSelectObject():void{
        this._scene.onPointerObservable.add((evt) =>{
            console.log("click");
            if((<BABYLON.PickingInfo>evt.pickInfo).hit && (<BABYLON.PickingInfo>evt.pickInfo).pickedMesh && evt.event.button === 0){
                let mesh = (<BABYLON.PickingInfo>evt.pickInfo).pickedMesh;
                this.addTextOver(mesh);
                const parent = this.getParent(mesh); //Obtenemos el mesh root
                this.createPicker(parent);
                if(this.isAnimable(parent))
                    this.animar(parent)
            }
        }, BABYLON.PointerEventTypes.POINTERUP);
    }

    private getParent(mesh:any): BABYLON.AbstractMesh{
        let retmesh = mesh;
        while(retmesh.parent && retmesh.parent.name != "__root__" ){
            retmesh = retmesh.parent;
        }
        return retmesh;
    }

    private isAnimable(mesh:any){
       return  mesh && BABYLON.Tags.HasTags(mesh) && mesh.matchesTagsQuery("animable")
    }

    private animar(mesh:any){
        if(mesh.matchesTagsQuery("animar")){
            mesh.removeTags("animar");
        }else{
            BABYLON.Tags.AddTagsTo(mesh, "animar");
        }
        this.addAditionalChange(mesh)
    }

    private addAditionalChange(mesh:any){
        if(mesh.matchesTagsQuery("bomba")){
            this.changeColorBomba(mesh)
        }
        if(mesh.matchesTagsQuery("turbina")){
            this.changeColorTurbina(mesh)
        }
    }

    private changeColorBomba(mesh:any){
        const color = mesh.matchesTagsQuery("animar") ? BABYLON.Color3.Blue() : BABYLON.Color3.Red();
        var mat = <BABYLON.PBRMaterial>mesh.getChildMeshes()[0].material;
        mat.albedoColor = color;
    }

    private changeColorTurbina(mesh:any){
        const color = mesh.matchesTagsQuery("animar") ? BABYLON.Color3.Green() : BABYLON.Color3.Magenta();
        var mat = <BABYLON.PBRMaterial>mesh.getChildMeshes()[0].material;
        mat.albedoColor = color;
    }

    addTextOver(mesh:any){
        const parent = this.getParent(mesh);
        if(!this._plane){
            this._plane = BABYLON.Mesh.CreatePlane("plane", 1, this._scene);
            this._plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(this._plane);
            this._button = GUI.Button.CreateSimpleButton("but1", "Click Me");
            this._button.width = 0.75;
            this._button.height = 0.2;
            this._button.color = '#222222';
            this._button.fontSize = 120;
            this._button.background = "white";//new BABYLON.Color3(0.2, 0.2, 0.2);
            this._button.onPointerUpObservable.add(function() {
                alert("you did it!");
            });
            advancedTexture.addControl(this._button);
        }
        console.log("parent:",parent.name, parent.position);
        if(BABYLON.Tags.HasTags(parent) && (<any> parent).matchesTagsQuery("animable")){
            (<GUI.TextBlock>this._button.textBlock).text =  parent.name;
            const position = parent.getAbsolutePosition();
            this._plane.position.x = position.x;
            this._plane.position.z = position.z;
            const despY =  (<any> parent).matchesTagsQuery("turbina || bomba") ? 0.5 : 2;
            this._plane.position.y = position.y + despY;
            this._plane.setEnabled(true);
        }else{
           // this._plane.setEnabled(false);
        }

        
    }


    createPanel():void{
        // GUI

        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel = new GUI.StackPanel();
        panel.width = "200px";
        panel.isVertical = true;
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(panel);

        this._panel = panel;
    }


    createPicker(mesh:BABYLON.AbstractMesh):void{
        // GUI
        this._panel.removeControl(this._textBlock);
        this._panel.removeControl(this._picker);

        var MeshMaterial = new BABYLON.StandardMaterial("MeshMaterial", this._scene);

        mesh.material = MeshMaterial;

        var textBlock = new GUI.TextBlock();
        textBlock.text = "Diffuse color:";
        textBlock.height = "30px";
        this._textBlock = textBlock;
        this._panel.addControl(this._textBlock);     

        var picker = new GUI.ColorPicker();
        picker.value = MeshMaterial.diffuseColor;
        picker.height = "150px";
        picker.width = "150px";
        picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        picker.onValueChangedObservable.add(function(value) { // value is a color3
            MeshMaterial.diffuseColor.copyFrom(value);
        });

        this._picker = picker;
        this._panel.addControl(this._picker);     
    }
}