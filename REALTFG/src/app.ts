import Entities from './Entities';
import MyScene from './my-scene'
import * as BABYLON from 'babylonjs';
window.addEventListener('DOMContentLoaded', async () => {

    let myscene = new MyScene('renderCanvas');
    let aux = await myscene.createScene();

    console.log("Envio: " + aux)
    let entities = new Entities(myscene.scene, (<BABYLON.UniversalCamera>aux[0]), (<BABYLON.WebXRDefaultExperience>aux[1]));
    entities.listenToEvents();
    
    // Start render loop.
    myscene.doRender();
  });