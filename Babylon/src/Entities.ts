import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

export default class Entities {

    private _scene: BABYLON.Scene;
    private _plane: BABYLON.Mesh;
    private _button = new GUI.Button;
    private _buttonUp = new GUI.Button;
    private _buttonDown = new GUI.Button;
    private _buttonLeft = new GUI.Button;
    private _buttonRight = new GUI.Button;
    private _buttonForward = new GUI.Button;
    private _buttonBackward = new GUI.Button;
    private _panel1:GUI.StackPanel = new GUI.StackPanel;
    private _panel2:GUI.StackPanel = new GUI.StackPanel;
    private _textBlock:GUI.TextBlock[] = new Array(new GUI.TextBlock);
    private _picker = new GUI.ColorPicker;
    private _oldMesh: BABYLON.Nullable<BABYLON.AbstractMesh>;
    private _gl: BABYLON.GlowLayer;

    constructor(scene : BABYLON.Scene) {
        this._scene = scene;
        this._gl = new BABYLON.GlowLayer("glow", scene);
        this.createPanel();
    }

    listenToEvents(): void{
        this.addClickSelectObject();
    }

    private addClickSelectObject():void{
        this._scene.onPointerObservable.add((evt) =>{
            console.log("click");
            //this._oldMesh?this.movementButtons(this.getParent(this._oldMesh), evt):null;
            if((<BABYLON.PickingInfo>evt.pickInfo).hit && (<BABYLON.PickingInfo>evt.pickInfo).pickedMesh && evt.event.button === 0){
                let mesh = (<BABYLON.PickingInfo>evt.pickInfo).pickedMesh;
                //this.addGlown(<BABYLON.AbstractMesh>mesh);
                this.addTextOver(mesh);
                const parent = this.getParent(mesh); //Obtenemos el mesh root
                this.createPicker(parent);
                this.movementButtons(parent, evt);
                if(this.isAnimable(parent))
                    this.animar(parent)
                this._oldMesh = mesh;
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
            this._button.width = 1;
            this._button.height = 0.5;
            this._button.color = '#222222';
            this._button.fontSize = 120;
            this._button.background = "white";//new BABYLON.Color3(0.2, 0.2, 0.2);
            this._button.onPointerUpObservable.add(function() {
                alert("you did it!");
            });
            advancedTexture.addControl(this._button);
        }
        console.log("parent:",parent.name, parent.position);
        (<GUI.TextBlock>this._button.textBlock).text =  parent.name;
        const position = parent.getAbsolutePosition();
        this._plane.position.x = position.x;
        this._plane.position.z = position.z;
        const despY = parent.getBoundingInfo().boundingBox.vectorsWorld[1].y-parent.getBoundingInfo().boundingBox.vectorsWorld[0].y+0.2;
        this._plane.position.y = position.y + despY;
        this._plane.setEnabled(true);
        // if(BABYLON.Tags.HasTags(parent) && (<any> parent).matchesTagsQuery("animable")){
        //     (<GUI.TextBlock>this._button.textBlock).text =  parent.name;
        //     const position = parent.getAbsolutePosition();
        //     this._plane.position.x = position.x;
        //     this._plane.position.z = position.z;
        //     const despY =  (<any> parent).matchesTagsQuery("turbina || bomba") ? 0.5 : parent.getBoundingInfo().boundingBox.vectorsWorld[1].y-parent.getBoundingInfo().boundingBox.vectorsWorld[0].y+0.2;
        //     this._plane.position.y = position.y + despY;
        //     this._plane.setEnabled(true);
        // }else{
        //    // this._plane.setEnabled(false);
        // }

        
    }


    createPanel():void{
        // GUI

        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel1 = new GUI.StackPanel();
        panel1.width = "200px";
        panel1.isVertical = true;
        panel1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(panel1);
        
        var textBlock = new GUI.TextBlock();
        textBlock.text = "Diffuse color:";
        textBlock.height = "30px";
        this._textBlock.push(textBlock);
        panel1.addControl(this._textBlock[0]);

        var advancedTexture2 = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel2 = new GUI.StackPanel();
        panel2.width = "150px";
        panel2.isVertical = true;
        panel2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture2.addControl(panel2);
        
        var textBlock2 = new GUI.TextBlock();
        textBlock2.text = "Control Movement:";
        textBlock2.height = "30px";
        panel2.addControl(textBlock2);   

        this._panel1 = (panel1);
        this._panel2 = (panel2);
        this.createMovementsKeys();
    }

    createPicker(mesh:BABYLON.AbstractMesh):void{
        // GUI
        this._panel1.removeControl(this._picker);

        console.log(BABYLON.Tags.GetTags(mesh))
        console.log((<string>BABYLON.Tags.GetTags(mesh, true)).includes('materialEspecial'));
        var MeshMaterial:BABYLON.StandardMaterial;
        if (!mesh.material?.getClassName().includes('StandardMaterial') && !BABYLON.Tags.MatchesQuery(mesh, 'materialEspecial')){
            MeshMaterial = new BABYLON.StandardMaterial("MeshMaterial", this._scene);
            mesh.material = MeshMaterial;
        }else if (!BABYLON.Tags.MatchesQuery(mesh, 'materialEspecial'))
            MeshMaterial = <BABYLON.StandardMaterial>mesh.material;
        else 
            return;

        var picker = new GUI.ColorPicker();
        picker.value = MeshMaterial.diffuseColor;
        picker.height = "150px";
        picker.width = "150px";
        picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        picker.onValueChangedObservable.add(function(value) { // value is a color3
            MeshMaterial.diffuseColor.copyFrom(value);
        });

        this._picker = picker;
        this._panel1.addControl(this._picker);     
    }

    createMovementsKeys():void{
        // GUI
        var buttonUp = GUI.Button.CreateSimpleButton(
            "but",
            //"🠕"
            "up"
          );
        buttonUp.height = "20px";
        buttonUp.width = "75px";
        buttonUp.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonUp.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        var buttonDown = GUI.Button.CreateSimpleButton(
            "but",
            //"🠗"
            "down"
          );
        buttonDown.height = "20px";
        buttonDown.width = "75px";
        buttonDown.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonDown.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        var buttonLeft = GUI.Button.CreateSimpleButton(
            "but",
            //"🠔"
            "left"
          );
        buttonLeft.height = "20px";
        buttonLeft.width = "75px";
        buttonLeft.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        buttonLeft.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        
        var buttonRight = GUI.Button.CreateSimpleButton(
            "but",
            //"🠖"
            "right"
          );
        buttonRight.height = "20px";
        buttonRight.width = "75px";
        buttonRight.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        buttonRight.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        
        var buttonForward = GUI.Button.CreateSimpleButton(
            "but",
            //"🠖"
            "forward"
          );
        buttonForward.height = "20px";
        buttonForward.width = "75px";
        buttonForward.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonForward.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        
        var buttonBackward = GUI.Button.CreateSimpleButton(
            "but",
            //"🠖"
            "backward"
          );
        buttonBackward.height = "20px";
        buttonBackward.width = "75px";
        buttonBackward.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonBackward.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        this._buttonDown = buttonDown;
        this._buttonUp = buttonUp;
        this._buttonLeft = buttonLeft;
        this._buttonRight = buttonRight;
        this._buttonForward = buttonForward;
        this._buttonBackward = buttonBackward;

        this._panel2.addControl(buttonUp);
        this._panel2.addControl(buttonDown);
        this._panel2.addControl(buttonLeft);
        this._panel2.addControl(buttonRight);
        this._panel2.addControl(buttonForward);
        this._panel2.addControl(buttonBackward);
    }

    private addGlown(mesh:BABYLON.AbstractMesh){
        console.log("GLOWWWWWWW")
        let materialAux = new BABYLON.NodeMaterial("lightNodeMat", this._scene, { emitComments: false });
        var loadedTextures = (<BABYLON.Material>mesh.material).getActiveTextures();
        var lightBaseColorTex;
        var lightEmissiveTex;

        for (var i = 0; i < loadedTextures.length; i++) {
            if (loadedTextures[i].name.includes("(Base Color)")) {
                lightBaseColorTex = loadedTextures[i];
            } else if (loadedTextures [i].name.includes("(Emissive)")) {
                lightEmissiveTex = loadedTextures[i];
            }
        }

        // build node material
        // let NodeMaterialBlockAux = new BABYLON.NodeMaterialBlock('bloqueAux');
        // materialAux._fragmentOutputNodes.push(NodeMaterialBlockAux);
        // materialAux._vertexOutputNodes.push(NodeMaterialBlockAux);
        materialAux.optimize();
        materialAux.build(false);
        mesh.material = materialAux;

        // assign original textures to node material
        var baseColor = materialAux.getBlockByName("baseColorTexture");
        var emissiveColor = materialAux.getBlockByName("emissiveTexture");

        (<any>baseColor).texture = lightBaseColorTex;
        (<any>emissiveColor).texture = lightEmissiveTex;

        // get shader values to drive glow
        var glowMask = materialAux.getBlockByName("glowMask");

        // set up glow layer post effect
        var gl = new BABYLON.GlowLayer("glow", this._scene);
        gl.intensity = 1.25;

        // set up material to use glow layer
        gl.referenceMeshToUseItsOwnMaterial(mesh);
        // enable glow mask to render only emissive into glow layer, and then disable glow mask
        gl.onBeforeRenderMeshToEffect.add(() => {
            (<any>glowMask).value = 1.0;
        });
        gl.onAfterRenderMeshToEffect.add(() => {
            (<any>glowMask).value = 0.0;
        });
        // this._oldMesh?this._gl.addExcludedMesh((<BABYLON.AbstractMesh>this._oldMesh)) : null;
        // this._gl.addIncludedOnlyMesh((<BABYLON.AbstractMesh>mesh));
    }


    private movementButtons(mesh:BABYLON.AbstractMesh, pointerInfo:any):void {
        console.log("POINTERUP: " + BABYLON.PointerEventTypes.POINTERUP);
        console.log(pointerInfo.type);
        this._buttonDown.onPointerDownObservable.clear()
        this._buttonDown.onPointerDownObservable.add(function() {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                mesh.movePOV(0,-0.1, 0)
        });
        this._buttonUp.onPointerDownObservable.clear()
        this._buttonUp.onPointerDownObservable.add(function() {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                mesh.movePOV(0,0.1, 0)
        });
        this._buttonLeft.onPointerDownObservable.clear()
        this._buttonLeft.onPointerDownObservable.add(function() {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                mesh.movePOV(-0.1, 0, 0)
        });
        this._buttonRight.onPointerDownObservable.clear()
        this._buttonRight.onPointerDownObservable.add(function() {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                mesh.movePOV(0.1, 0, 0)
        });
        this._buttonForward.onPointerDownObservable.clear()
        this._buttonForward.onPointerDownObservable.add(function() {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                mesh.movePOV(0, 0, 0.1)
        });
        this._buttonBackward.onPointerDownObservable.clear()
        this._buttonBackward.onPointerDownObservable.add(function() {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
                mesh.movePOV(0, 0, -0.1)
        });
    }
}