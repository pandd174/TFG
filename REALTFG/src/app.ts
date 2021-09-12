import Entities from './Entities';
import MyScene from './my-scene'
window.addEventListener('DOMContentLoaded', async () => {

    let myscene = new MyScene('renderCanvas');
    await myscene.createScene();

    let entities = new Entities(myscene.scene);
    entities.listenToEvents();
    
    // Start render loop.
    myscene.doRender();
  });