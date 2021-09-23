
var FlyCamera = pc.createScript('flyCamera');
var Raycast = pc.createScript('raycast');


////////////////////////////////////////////////////////////////////////////
//                          RayCast                                       //
////////////////////////////////////////////////////////////////////////////


// initialize code called once per entity
Raycast.prototype.initialize = function() {
    if (!this.entity.camera) {
        console.error('This script must be applied to an entity with a camera component.');
        return;
    }

    // Add a mousedown event handler
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.mouseDown, this);

    // Add touch event only if touch is available
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.touchStart, this);
    }
};

Raycast.prototype.mouseDown = function (e) {
    this.doRaycast(e.x, e.y);
};

Raycast.prototype.touchStart = function (e) {
    // Only perform the raycast if there is one finger on the screen
    if (e.touches.length === 1) {
        this.doRaycast(e.touches[0].x, e.touches[0].y);
    }
    e.event.preventDefault();
};

Raycast.prototype.doRaycast = function (screenX, screenY) {
    // The pc.Vec3 to raycast from (the position of the camera)
    var from = this.entity.getPosition();

    // The pc.Vec3 to raycast to (the click position projected onto the camera's far clip plane)
    var to = this.entity.camera.screenToWorld(screenX, screenY, this.entity.camera.farClip);

    // Raycast between the two points and return the closest hit result
    var result = this.app.systems.rigidbody.raycastFirst(from, to);

    // If there was a hit, store the entity
    if (result) {
        var hitEntity = result.entity;
        console.log('You selected ' + hitEntity.name);
    }    
    return result;
};

////////////////////////////////////////////////////////////////////////////
//                          FlyCamera                                     //
////////////////////////////////////////////////////////////////////////////

FlyCamera.attributes.add('speed', {
    type: 'number',
    default: 10
});

FlyCamera.attributes.add('fastSpeed', {
    type: 'number',
    default: 20
});

FlyCamera.attributes.add('mode', {
    type: 'number',
    default: 0,
    enum: [{
        "Lock": 0
    }, {
        "Drag": 1
    }]
});

FlyCamera.attributes.add('text', {
    type: 'string',
    default: 'Aqui va la seleccion'
});

FlyCamera.prototype.initialize = function () {
    // Camera euler angle rotation around x and y axes
    var eulers = this.entity.getLocalEulerAngles();
    this.ex = eulers.x;
    this.ey = eulers.y;
    this.moved = false;
    this.lmbDown = false;

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.app.mouse.disableContextMenu();
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
};

FlyCamera.prototype.update = function (dt) {
    // Update the camera's orientation
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);

    var app = this.app;

    var speed = this.speed;
    if (app.keyboard.isPressed(pc.KEY_SHIFT)) {
        speed = this.fastSpeed;
    }

    // Update the camera's position
    if (app.keyboard.isPressed(pc.KEY_UP) || app.keyboard.isPressed(pc.KEY_W)) {
        this.entity.translateLocal(0, 0, -speed * dt);
    } else if (app.keyboard.isPressed(pc.KEY_DOWN) || app.keyboard.isPressed(pc.KEY_S)) {
        this.entity.translateLocal(0, 0, speed * dt);
    }

    if (app.keyboard.isPressed(pc.KEY_LEFT) || app.keyboard.isPressed(pc.KEY_A)) {
        this.entity.translateLocal(-speed * dt, 0, 0);
    } else if (app.keyboard.isPressed(pc.KEY_RIGHT) || app.keyboard.isPressed(pc.KEY_D)) {
        this.entity.translateLocal(speed * dt, 0, 0);
    }
};

FlyCamera.prototype.onMouseMove = function (event) {
    if (!this.mode) {
        if (!pc.Mouse.isPointerLocked())
            return;
    } else {
        if (!this.lmbDown)
            return;
    }


    // Update the current Euler angles, clamp the pitch.
    if (!this.moved) {
        // first move event can be very large
        this.moved = true;
        return;
    }
    this.ex -= event.dy / 5;
    this.ex = pc.math.clamp(this.ex, -90, 90);
    this.ey -= event.dx / 5;
};

FlyCamera.prototype.onMouseDown = function (event) {
    if (event.button === 0) {
        this.lmbDown = true;

        // When the mouse button is clicked try and capture the pointer
        if (!this.mode && !pc.Mouse.isPointerLocked()) {
            this.app.mouse.enablePointerLock();
        }
    }
};

FlyCamera.prototype.onMouseUp = function (event) {
    if (event.button === 0) {
        this.lmbDown = false;
    }

    
    if (this.mode) {
        this.selectObject(new pc.Vec3(event.x, event.y, event.z));
    }
};

FlyCamera.prototype.selectObject =function(pos){
    //console.log("Llego a la linea 167, pos: ", pos);
    var result;
    if (pos)
        result=this.doRaycast(pos.x,pos.y);
    else
        result=this.doRaycast(this.app.mouse._lastX,this.app.mouse._lastY);
    //console.log("Llego a la linea 169, result: ", result);
    if(result && result.entity){        
        if(result.entity.model?.meshInstances.length > 0){
            //console.log("Llego a la linea 115");
            for(let i=0; i < result.entity.model.meshInstances.length ; i++ ){
                const ray = this.createRay(pos);  
                let intersectResult = new pc.Vec3();   
                console.log("AABB", 
                    result.entity.model.meshInstances[i].node.name,
                    result.entity.model.meshInstances[i].aabb.intersectsRay(ray, intersectResult) );
            }
        } console.log("meshInstances:",result.entity.model?.meshInstances.length)
        return result;
    }
};

FlyCamera.prototype.createRay = function(screenPosition){
    var camera=this.entity;
    var from = camera.camera.screenToWorld(screenPosition.x, screenPosition.y, camera.camera.nearClip);
    var to = camera.camera.screenToWorld(screenPosition.x, screenPosition.y, camera.camera.farClip);
    var r = new pc.Vec3();
    var dir = r.sub2(to, from);
    dir.normalize();   
    var ray = new pc.Ray(from, dir);
    console.log("ray:",ray);
    return ray;
}

FlyCamera.prototype.getFirstMeshSelectable =  function (screenPosition) {
    var camera=this.entity;
    var from = camera.camera.screenToWorld(screenPosition.x, screenPosition.y, camera.camera.nearClip);
    var to = camera.camera.screenToWorld(screenPosition.x, screenPosition.y, camera.camera.farClip);
    var result = this.app.systems.rigidbody.raycastFirst(from, to);
    if(result  && result.entity){
        //Recorrer MeshInstances
        // Solo tratar los que empiezan por "puerta", "ventana"
        // Lista de intersecciones OK + pto de interseccion Tupla [Mesh, intersectPoint]
        // De la lista obtengo el que este más cerca del "from"

        //Obtener objetos seleccionables y animables ("puerta", "ventana")
        //Estos objetos los metes en una lista estados ( inicial, final, animar=false, 90, dirección)
    }
};



FlyCamera.prototype.doRaycast = function (x, y) {
    // The pc.Vec3 to raycast from (the position of the camera)
    var from = this.entity.getPosition();

    // The pc.Vec3 to raycast to (the click position projected onto the camera's far clip plane)
    var to = this.entity.camera.screenToWorld(x, y, this.entity.camera.farClip);

    // Raycast between the two points and return the closest hit result
    var result = this.app.systems.rigidbody.raycastFirst(from, to);

    // If there was a hit, store the entity
    if (result) {
        var hitEntity = result.entity;
        console.log('You selected ' + hitEntity.name);
        this.text = hitEntity.name;
    }    
    return result;
};