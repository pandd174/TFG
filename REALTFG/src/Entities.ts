import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import * as myScene from './my-scene';
import descripcionPiezas from "./descripcionPiezas.json"; 
import { TextBlock } from 'babylonjs-gui/2D/controls/textBlock';

export default class Entities {

    private _scene: BABYLON.Scene;
    private _plane: BABYLON.Mesh;
    private _button = new GUI.Button;
    private _buttonAnimar = new GUI.Button;
    private _buttonAnimarOff = new GUI.Button;
    private _buttonAnimarUnir = new GUI.Button;
    private _buttonAnimarDesmembrar = new GUI.Button;
    private _buttonAnimar3D:GUI.MeshButton3D;
    private _buttonAnimarOff3D:GUI.MeshButton3D;
    private _buttonAnimarUnir3D:GUI.MeshButton3D;
    private _buttonAnimarDesmembrar3D:GUI.MeshButton3D;
    private _panel1:GUI.StackPanel = new GUI.StackPanel;
    private _panel2:GUI.StackPanel = new GUI.StackPanel;
    private _textBlock:GUI.TextBlock//[] = new Array(new GUI.TextBlock);
    private _picker = new GUI.ColorPicker;
    private _oldMesh: BABYLON.Nullable<BABYLON.AbstractMesh>;
    private _gl: BABYLON.GlowLayer;
    private _cube: BABYLON.Mesh;

    constructor(scene : BABYLON.Scene) {
        this._scene = scene;
        this._gl = new BABYLON.GlowLayer("glow", scene);
        // this._cube = BABYLON.Mesh.CreateBox("caja", 1, scene);
        // this._cube.position.y -= 2;
        // this._cube.position.z += 5;
        //BABYLON.Tags.AddTagsTo(this._cube, "cube")
        this.createPanel3D();

    }

    // public getCube():BABYLON.Mesh {
    //     return this._cube;
    // }

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
                //this.createPicker(parent);
                //this.movementButtons(parent, evt);
                this.movementButtons3D(parent, evt);
            //     if(evt.event['pointerId'] === 1 && evt.event.button === 0
            //     || evt.event['pointerId'] === 201 // 201 -> Oculus Quest 2 (Mando 1)
            //     || evt.event['pointerId'] === 200) // 200 -> Oculus Quest 2 (Mando 1)
            //    {
            //        //Animación
            //        console.log("-->ANIM")
            //        if(this.isAnimable(parent))
            //            this.animar(parent)
            //    }else{
            //        //etiqueta sobre objeto seleccionado.
            //         if(this.isClickable(parent))
            //             this.addTextOver(parent);
            //    }
                // if(this.isAnimable(parent))
                //     this.animar(parent)
                this._oldMesh = mesh;
            }
            if((<BABYLON.PickingInfo>evt.pickInfo).hit && (<BABYLON.PickingInfo>evt.pickInfo).pickedMesh && evt.event.button === 2){
                let mesh = (<BABYLON.PickingInfo>evt.pickInfo).pickedMesh;
                // if(this.isAnimable(parent))
                //     this.animar(parent)
                const parent = this.getParent(mesh); //Obtenemos el mesh root
                //this.createPicker(parent);
                //this.movementButtons(parent, evt);
                if (parent!=null)
                    myScene.default.prototype.animations(5, this._scene, false, parent);
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

    // createPicker(mesh:BABYLON.AbstractMesh):void{
    //     // GUI
    //     this._panel1.removeControl(this._picker);

    //     var MeshMaterial:BABYLON.StandardMaterial;
    //     if (!mesh.material?.getClassName().includes('StandardMaterial') && !BABYLON.Tags.MatchesQuery(mesh, 'materialEspecial')){
    //         MeshMaterial = new BABYLON.StandardMaterial("MeshMaterial", this._scene);
    //         mesh.material = MeshMaterial;
    //     }else if (!BABYLON.Tags.MatchesQuery(mesh, 'materialEspecial'))
    //         MeshMaterial = <BABYLON.StandardMaterial>mesh.material;
    //     else 
    //         return;

    //     var picker = new GUI.ColorPicker();
    //     picker.value = MeshMaterial.diffuseColor;
    //     picker.height = "150px";
    //     picker.width = "150px";
    //     picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //     picker.onValueChangedObservable.add(function(value) { // value is a color3
    //         MeshMaterial.diffuseColor.copyFrom(value);
    //     });

    //     this._picker = picker;
    //     this._panel1.addControl(this._picker);     
    // }

    addTextOver(mesh:any){
        if (this._oldMesh?.id==mesh.id) {
            this._plane.setEnabled(!this._plane.isEnabled());
        } else {
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
                // this._button.onPointerUpObservable.add(function() {
                //     alert("you did it!");
                // });
                advancedTexture.addControl(this._button);
            }
            //console.log("parent: " + parent.name + " ; Descripcion: " + descripcionPiezas.find((value: string[], index: number, obj: string[][]) => {return parent.name==obj[index][0]})?.pop());
            let descripcion = "";
            if (descripcionPiezas.find((value: string[], index: number, obj: string[][]) => {return parent.name==obj[index][0]})) {
                descripcion = (<string[]>descripcionPiezas.find((value: string[], index: number, obj: string[][]) => {return parent.name==obj[index][0]}))[1];
            }
            (<GUI.TextBlock>this._button.textBlock).text =  parent.name;
            this._textBlock.text = descripcion;
            const position = parent.getAbsolutePosition();
            this._plane.position.x = position.x;
            this._plane.position.z = position.z;
            const despY =  true ? 1.3 : parent.getBoundingInfo().boundingBox.vectorsWorld[1].y-parent.getBoundingInfo().boundingBox.vectorsWorld[0].y+0.2;
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

        
    }


    createPanel3D():void{
        // GUI

        // Create the 3D UI manager
        var manager = new GUI.GUI3DManager(this._scene);
    
        // Create a horizontal stack panel
        // var panel = new GUI.StackPanel3D();
        // panel.margin = 0.02;
      
        // manager.addControl(panel);
        // panel.position.z = -1.5;
    
        // Let's add some buttons!
        // var addButton = function() {
        //     var button = new GUI.Button3D("orientation");
        //     panel.addControl(button);
        //     button.onPointerUpObservable.add(function(){
        //         panel.isVertical = !panel.isVertical;
        //     });   
            
        //     var text1 = new GUI.TextBlock();
        //     text1.text = "change orientation";
        //     text1.color = "white";
        //     text1.fontSize = 24;
        //     button.content = text1;  
        // }
    
        // addButton();    
        // addButton();
        // addButton();

        //HACER EL 3D

        var panel1 = new GUI.StackPanel3D();
        panel1.isVertical = true; //(3,1.5,0)
        panel1.position.x=1;
        manager.addControl(panel1);
        
        var plano = BABYLON.Mesh.CreatePlane("plane0", 1, this._scene);
        plano.position.z = 1.5;
        plano.position.x = 2.5;
        var button = new GUI.MeshButton3D(plano, "descripcion");
        BABYLON.Tags.AddTagsTo(plano, "botones3D")
        console.log("tras anadir tag")
        console.log(this._scene.getMeshesByTags("botones3D"))
        //console.log(this._scene)
        var textBlock = new GUI.TextBlock();
        textBlock.textWrapping = GUI.TextWrapping.WordWrap;
        textBlock.paddingTop = "10px";
        textBlock.paddingLeft = "10px";
        textBlock.paddingRight = "10px"
        textBlock.paddingBottom = "10px";
        textBlock.resizeToFit = true;
        //textBlock.lineSpacing = "5px";
        textBlock.fontSize = "16px";
        textBlock.color = "white";
        textBlock.text = "Descripcion";
        button.content = textBlock;
        this._textBlock = (textBlock);
    
        panel1.addControl(button);

        var panel2 = new GUI.StackPanel3D();
        panel2.isVertical = true;
        manager.addControl(panel2);

        this.createKeys3D(panel2, true);
    }


    createPanel():void{
        // GUI

        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel1 = new GUI.StackPanel();
        panel1.width = "400px";
        panel1.isVertical = true;
        panel1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(panel1);

        var sv = new GUI.ScrollViewer();
        sv.background = "grey";
        sv.width = "400px";
        sv.height = "400px";
        //sv.paddingRight = "50%"
    
        panel1.addControl(sv);
        
        var textBlock = new GUI.TextBlock();
        textBlock.textWrapping = GUI.TextWrapping.WordWrap;
        textBlock.paddingTop = "10px";
        textBlock.paddingLeft = "10px";
        textBlock.paddingRight = "10px"
        textBlock.paddingBottom = "10px";
        textBlock.resizeToFit = true;
        //textBlock.lineSpacing = "5px";
        textBlock.fontSize = "16px";
        textBlock.color = "white";
        textBlock.text = "Descripcion";
        this._textBlock = (textBlock);
        sv.addControl(this._textBlock);


        var advancedTexture2 = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel2 = new GUI.StackPanel();
        panel2.width = "151px";
        panel2.isVertical = true;
        panel2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        
        advancedTexture2.addControl(panel2);

        this._panel1 = (panel1);
        this._panel2 = (panel2);
        this.createKeys(this._panel2, true);
        // BABYLON.Tags.AddTagsTo(panel1, "panel")
        // BABYLON.Tags.AddTagsTo(panel2, "panel")
    }

    createKeys(panel:GUI.StackPanel, esEntities?:Boolean|false):void{
        // GUI
        var buttonAnimar = GUI.Button.CreateSimpleButton(
            "animar",
            "Animar"
          );
        buttonAnimar.height = "20px";
        buttonAnimar.width = "120px";
        buttonAnimar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonAnimar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        buttonAnimar.color = "blue";
        buttonAnimar.background = "white";

        var buttonAnimarOff = GUI.Button.CreateSimpleButton(
            "inanimar",
            "No animar"
          );
        buttonAnimarOff.height = "20px";
        buttonAnimarOff.width = "120px";
        buttonAnimarOff.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonAnimarOff.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        buttonAnimarOff.color = "blue";
        buttonAnimarOff.background = "white";
        
        var buttonAnimarUnir = GUI.Button.CreateSimpleButton(
            "unir",
            "Ensamblar"
          );
        buttonAnimarUnir.height = "20px";
        buttonAnimarUnir.width = "120px";
        buttonAnimarUnir.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonAnimarUnir.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        buttonAnimarUnir.color = "blue";
        buttonAnimarUnir.background = "white";

        var buttonAnimarDesmembrar = GUI.Button.CreateSimpleButton(
            "desmembrar",
            "Desensamblar"
          );
        buttonAnimarDesmembrar.height = "20px";
        buttonAnimarDesmembrar.width = "120px";
        buttonAnimarDesmembrar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonAnimarDesmembrar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        buttonAnimarDesmembrar.color = "blue";
        buttonAnimarDesmembrar.background = "white";

        if (esEntities) {
            this._buttonAnimar = buttonAnimar;
            this._buttonAnimarOff = buttonAnimarOff;
            this._buttonAnimarUnir = buttonAnimarUnir;
            this._buttonAnimarDesmembrar = buttonAnimarDesmembrar;
        }
        panel.addControl(buttonAnimar);
        panel.addControl(buttonAnimarOff);
        panel.addControl(buttonAnimarUnir);
        panel.addControl(buttonAnimarDesmembrar);
    }

    createKeys3D(panel:GUI.StackPanel3D, esEntities?:Boolean|false):void{
        // GUI
        var plano1 = BABYLON.Mesh.CreatePlane("plane1", 1, this._scene);
        plano1.position.z = 1.5;
        plano1.position.x = 3.5;
        var buttonAnimar = new GUI.MeshButton3D(plano1, "animar");
        var textoAnimar = new GUI.TextBlock("animar", "Animar")
        textoAnimar.color = "blue";
        buttonAnimar.content = textoAnimar;
        // buttonAnimar.background = "white";

        var plano2 = BABYLON.Mesh.CreatePlane("plane2", 1, this._scene);
        plano2.position.z = 1.5;
        plano2.position.x = 3.5;
        var buttonAnimarOff = new GUI.MeshButton3D(plano2, "inanimar");
        var textoAnimarOff = new GUI.TextBlock("inanimar", "No animar")
        textoAnimarOff.color = "blue";
        buttonAnimar.content = textoAnimarOff;
        // buttonAnimarOff.background = "white";
        
        var plano3 = BABYLON.Mesh.CreatePlane("plane3", 1, this._scene);
        plano3.position.z = 1.5;
        plano3.position.x = 3.5;
        var buttonAnimarUnir = new GUI.MeshButton3D(plano3, "unir");
        var textoAnimarUnir = new GUI.TextBlock("unir","Ensamblar")
        textoAnimarUnir.color = "blue";
        buttonAnimarUnir.content = textoAnimarUnir;
        // buttonAnimarUnir.background = "white";

        var plano4 = BABYLON.Mesh.CreatePlane("plane4", 1, this._scene);
        plano4.position.z = 1.5;
        plano4.position.x = 3.5;
        var buttonAnimarDesmembrar = new GUI.MeshButton3D(plano4, "desmembrar");
        var textoAnimarDesmembrar = new GUI.TextBlock("desmembrar", "Desensamblar")
        textoAnimarDesmembrar.color = "blue";
        buttonAnimarDesmembrar.content = textoAnimarDesmembrar;
        // buttonAnimarDesmembrar.background = "white";

        if (esEntities) {
            this._buttonAnimar3D = buttonAnimar;
            this._buttonAnimarOff3D = buttonAnimarOff;
            this._buttonAnimarUnir3D = buttonAnimarUnir;
            this._buttonAnimarDesmembrar3D = buttonAnimarDesmembrar;
        }
        BABYLON.Tags.AddTagsTo(plano1, "botones3D")
        BABYLON.Tags.AddTagsTo(plano2, "botones3D")
        BABYLON.Tags.AddTagsTo(plano3, "botones3D")
        BABYLON.Tags.AddTagsTo(plano4, "botones3D")
        panel.addControl(buttonAnimar);
        panel.addControl(buttonAnimarOff);
        panel.addControl(buttonAnimarUnir);
        panel.addControl(buttonAnimarDesmembrar);
    }

    private movementButtons(mesh:BABYLON.AbstractMesh, pointerInfo:any):void {
        let escena = this._scene;
        this._buttonAnimar.onPointerDownObservable.clear()
        this._buttonAnimar.onPointerDownObservable.add(function(eventData: GUI.Vector2WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(1, escena);
        });
        this._buttonAnimarOff.onPointerDownObservable.clear()
        this._buttonAnimarOff.onPointerDownObservable.add(function(eventData: GUI.Vector2WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(2, escena);
        });
        this._buttonAnimarUnir.onPointerDownObservable.clear()
        this._buttonAnimarUnir.onPointerDownObservable.add(function(eventData: GUI.Vector2WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(4, escena);
        });
        this._buttonAnimarDesmembrar.onPointerDownObservable.clear()
        this._buttonAnimarDesmembrar.onPointerDownObservable.add(function(eventData: GUI.Vector2WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(3, escena);
        });
    }

    private movementButtons3D(mesh:BABYLON.AbstractMesh, pointerInfo:any):void {
        let escena = this._scene;
        this._buttonAnimar3D.onPointerDownObservable.clear()
        this._buttonAnimar3D.onPointerDownObservable.add(function(eventData: GUI.Vector3WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(1, escena);
        });
        this._buttonAnimarOff3D.onPointerDownObservable.clear()
        this._buttonAnimarOff3D.onPointerDownObservable.add(function(eventData: GUI.Vector3WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(2, escena);
        });
        this._buttonAnimarUnir3D.onPointerDownObservable.clear()
        this._buttonAnimarUnir3D.onPointerDownObservable.add(function(eventData: GUI.Vector3WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(4, escena);
        });
        this._buttonAnimarDesmembrar3D.onPointerDownObservable.clear()
        this._buttonAnimarDesmembrar3D.onPointerDownObservable.add(function(eventData: GUI.Vector3WithInfo, eventState: BABYLON.EventState) {
            // while (pointerInfo.type!=BABYLON.PointerEventTypes.POINTERUP)
            myScene.default.prototype.animations(3, escena);
        });
    }

    public getButtons3D ():GUI.Button3D[] {
        return [this._buttonAnimar3D, this._buttonAnimarOff3D, this._buttonAnimarUnir3D, this._buttonAnimarDesmembrar3D];
    }
}