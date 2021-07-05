import * as pc from 'playcanvas'


export class Cameras {
    public app:pc.Application



	createStaticCamera(){
		// Create an Entity with a camera component
		var camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.4, 0.45, 0.5)
		});
		// Add the new Entities to the hierarchy
		this.app.root.addChild(camera);
		// Move the camera 10m along the z-axis
		camera.translate(5, 10, 5);
	}


	createOrbitCamera(lookatEntity:pc.Entity):pc.Entity{
		// Create a camera with an orbit camera script
		var camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.4, 0.45, 0.5)
		});
		camera.addComponent("script");
		if(camera.script){
			camera.script.create("orbitCamera", {
				attributes: {
					inertiaFactor: 0.2, // Override default of 0 (no inertia)
					focusEntity: lookatEntity,
				}
			});
			camera.script.create("orbitCameraInputMouse");
			camera.script.create("orbitCameraInputTouch");
		}
		console.log("cameraScript",camera.script);
		this.app.root.addChild(camera);
		return camera;
		
	}

	createFlyCamera(){
		const camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.5, 0.5, 0.8),
			nearClip: 0.3,
			farClip: 30
		});
	
		// add the fly camera script to the camera
		camera.addComponent("script");
		if(camera.script){
			camera.script.create("flyCamera", {
				attributes: {
					mode: 1
				}
			})
		}
		console.log("cameraScript",camera.script);
		this.app.root.addChild(camera);
		camera.translate(5, 10, 5);
		//camera.translate(0, 0, 0);
		//const text = this.createText();
		//camera.addChild(text);
		return camera;
	}

	createFirstPersonCamera(){
		// Create a camera that will be driven by the character controller
		const camera = new pc.Entity();
		camera.addComponent("camera", {
			clearColor: new pc.Color(0.4, 0.45, 0.5),
			farClip: 100,
			fov: 65,
			nearClip: 0.1
		});
		camera.setLocalPosition(0, 1, 0);

		// Create a physical character controller
		const characterController = new pc.Entity();
		characterController.addComponent("collision", {
			axis: 0,
			height: 2,
			radius: 0.5,
			type: "capsule"
		});
		characterController.addComponent("rigidbody", {
			angularDamping: 0,
			angularFactor: pc.Vec3.ZERO,
			friction: 0.3,
			linearDamping: 0,
			linearFactor: pc.Vec3.ONE,
			mass: 80,
			restitution: 0,
			type: "dynamic"
		});
		characterController.addComponent("script");
		if (characterController.script) {
			characterController.script.create("characterController");
			characterController.script.create("firstPersonCamera", {
				attributes: {
					camera: camera
				}
			});
			characterController.script.create("gamePadInput");
			characterController.script.create("keyboardInput");
			characterController.script.create("mouseInput");
			characterController.script.create("touchInput");
		}
		characterController.setLocalPosition(0, 1, 10);

		// Add the character controll and camera to the hierarchy
		this.app.root.addChild(characterController);
		characterController.addChild(camera);
	}
}