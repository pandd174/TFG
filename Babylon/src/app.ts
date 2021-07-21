import Entities from './Entities';
import MyScene from './my-scene'
window.addEventListener('DOMContentLoaded', () => {

    let myscene = new MyScene('renderCanvas');
    myscene.createScene();

    let entities = new Entities(myscene.scene);
    entities.listenToEvents();
    
    // Start render loop.
    myscene.doRender();
  });