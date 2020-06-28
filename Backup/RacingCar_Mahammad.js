"use strict";

var canvas;
var gl;
var program;
var engine;
var sceneToRender = null;
var carMeshes = [];
var roadMeshes = [];
var bearbirdMeshes = [];
var flagMoveCarforward = 0;
var flagMoveCarbackward = 0;
var flagMoveCarleft = 0;
var flagMoveCarright = 0;
var Side = 0;
var Forward = 0;
var shoulderLeft;
var shoulderRight;
var rightBone;
var leftBone;
var rightKnee;
var leftKnee;
var carTorso;
var wheelfrontLeft;
var wheelbackLeft;
var wheelbackRight;
var wheelfrontRight;
var wheels_13;
var bearbirdBuddyTorso;
var leftFrontAngle = 0;
var rightFrontAngle = 0;
var deltaAngle = 0.01 * Math.PI / 3;
var x_ax_motion = 0;
var rotatedFlag = 1;
var z_ax_motion = 0;


window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');

    var engine = new BABYLON.Engine(canvas, true);
    engine.enableOfflineSupport = false; // Dont require a manifest file
    var createScene0 = function () {
        var scene0 = new BABYLON.Scene(engine);
        scene0.clearColor = new BABYLON.Color3.White();
        scene0.autoClear = false;
        var camera = new BABYLON.ArcRotateCamera("arcCam",
            0,
            0,
            50.0, BABYLON.Vector3.Zero(), scene0);
        camera.attachControl(canvas, true);

        // var light = new BABYLON.PointLight("PointLight",new BABYLON.Vector3(
        // 0,0,0),scene);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(100, 0, 0), scene0);

        light.parent = camera;
        light.intensity = 1.5;

        var bearbird = BABYLON.SceneLoader.ImportMesh("", "", "Models/bearbird.babylon", scene0,
            function (newMeshes) {
                camera.target = newMeshes[0];
                // console.log(newMeshes[0]);
                newMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
            });
        var car = BABYLON.SceneLoader.ImportMesh("", "", "Models/Cars/Car1/B/Car1.babylon", scene0,
            function (newMeshes) {
                camera.target = newMeshes[0];
                newMeshes[0].position = new BABYLON.Vector3(10, 0, 0);
            });
        //  Models/Roads/Road10/B/

        return scene0;
    }
    var createScene = function () {

        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.White();
        scene.enablePhysics();//new BABYLON.Vector3(0, -10, 0), new BABYLON.AmmoJSPlugin());


        var camera = new BABYLON.ArcRotateCamera("arcCam",
            0,
            0,
            50.0, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);


        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(100, 0, 0), scene);

        light.parent = camera;
        light.intensity = 1.5;

        ////////////////////////// KEY CONTROLS //////////////////////////////////////

        // add models : bearbirdbuddy, car and road
        ////////////////////////// BEARBIRDBUDDY /////////////////////////////////////
        const assetsManagerBearBird = new BABYLON.AssetsManager(scene);
        const meshTaskBearBird = assetsManagerBearBird.addMeshTask("bearbirdmeshes", "", "", "Models/bearbird.babylon");
        meshTaskBearBird.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(2, 0.45, 0);
            bearbirdBuddyTorso = task.loadedMeshes[0];
            bearbirdBuddyTorso.parent = carTorso;
            bearbirdBuddyTorso.position.x = 0.3;
            bearbirdBuddyTorso.position.z = 0.1;
            shoulderRight = task.loadedMeshes[9];
            shoulderLeft = task.loadedMeshes[11];
            rightKnee = task.loadedMeshes[25];
            leftKnee = task.loadedMeshes[26];
            rightBone = task.loadedMeshes[19];
            leftBone = task.loadedMeshes[20];

            shoulderRight.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
            shoulderLeft.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
            rightBone.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
            // rightKnee.rotate(new BABYLON.Vector3(1,0,0), -Math.PI/2);
            leftBone.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
            // leftKnee.rotate(new BABYLON.Vector3(1,0,0), -Math.PI/2);



        }
        console.log(meshTaskBearBird);
        assetsManagerBearBird.load();

        ////////////////////////// CAR /////////////////////////////////////
        var assetsManagerCar = new BABYLON.AssetsManager(scene);
        var meshTaskCar = assetsManagerCar.addMeshTask("carmeshes", "", "", "Models/Cars/Car4/B/Car4.babylon");
        meshTaskCar.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(2, 0.05, 0);
            // console.log(task.loadedMeshes[0].position.x);
            carTorso = task.loadedMeshes[0];
            wheelfrontLeft = task.loadedMeshes[32];
            wheelbackLeft = task.loadedMeshes[35];
            wheelbackRight = task.loadedMeshes[38];
            wheelfrontRight= task.loadedMeshes[41];

            // carTorso.setPositionWithLocalVector(carTorso.position);

            // wheels_13 = task.loadedMeshes[29];
            // // console.log(wheels_13);
            // // console.log(wheel1_14);
            // ///////////////////////// configuration of frontLeftWheel
            // wheelfrontLeft = task.loadedMeshes[30];
            // wheelfrontLeft_pivot.parent = carTorso;
            // wheelfrontLeft.parent = wheelfrontLeft_pivot;
            // wheelfrontLeft_pivot.position.x = 0.7513999938964844;
            // wheelfrontLeft_pivot.position.y = 0.0131000006198883;
            // wheelfrontLeft_pivot.position.z = -0.93910000026226044;
            // wheelfrontLeft.position.x = -0.7;
            // wheelfrontLeft.position.y = -0.0070;
            // wheelfrontLeft.position.z = 0.93064100026226044;
            // wheelfrontLeft.rotationQuaternion.w = 0.9922;
            // wheelfrontLeft.rotationQuaternion.x = 0.0032;
            // wheelfrontLeft.rotationQuaternion.w = 0.1218;
            // wheelfrontLeft.rotationQuaternion.w = -0.026;
            // wheelfrontLeft.ellipsoid.x = 0;
            // wheelfrontLeft.ellipsoid.y = 0;
            // wheelfrontLeft.ellipsoid.z = 0;

            // wheelfrontRight = task.loadedMeshes[42];
            // wheelfrontRight_pivot.parent = carTorso;
            // wheelfrontRight.parent = wheelfrontRight_pivot;
            // wheelfrontRight_pivot.position.x = -wheelfrontLeft_pivot.position.x;
            // wheelfrontRight_pivot.position.y = wheelfrontLeft_pivot.position.y;
            // wheelfrontRight_pivot.position.z = wheelfrontLeft_pivot.position.z;
            // wheelfrontRight.position.x = 0.7;
            // wheelfrontRight.position.y = -0.0070;
            // wheelfrontRight.position.z = 0.93064100026226044;
            // wheelfrontRight.rotationQuaternion.w = 0.9922;
            // wheelfrontRight.rotationQuaternion.x = 0.0032;
            // wheelfrontRight.rotationQuaternion.w = 0.1218;
            // wheelfrontRight.rotationQuaternion.w = -0.026;
            // wheelfrontLeft.ellipsoid.x = 0;
            // wheelfrontLeft.ellipsoid.y = 0;
            // wheelfrontLeft.ellipsoid.z = 0;
            // // console.log(wheelfrontRight);

            // wheelbackLeft = task.loadedMeshes[34];
            // wheelbackLeft_pivot.parent = carTorso;
            // wheelbackLeft.parent = wheelbackLeft_pivot;
            // wheelbackLeft_pivot.position.x = 0.7513999938964844;
            // wheelbackLeft_pivot.position.y = 0.0131000006198883;
            // wheelbackLeft_pivot.position.z = 1.13910000026226044;
            // wheelbackLeft.position.x = -0.8;
            // wheelbackLeft.position.y = -0.0070;
            // wheelbackLeft.position.z = -1.11064100026226044;

            // wheelbackRight = task.loadedMeshes[38];
            // wheelbackRight_pivot.parent = carTorso;
            // wheelbackRight.parent = wheelbackRight_pivot;
            // wheelbackRight_pivot.position.x = -0.7513999938964844;
            // wheelbackRight_pivot.position.y = 0.0131000006198883;
            // wheelbackRight_pivot.position.z = 1.13910000026226044;
            // wheelbackRight.position.x = 0.8;
            // wheelbackRight.position.y = -0.0070;
            // wheelbackRight.position.z = -1.11064100026226044;



        }
        console.log(meshTaskCar);
        assetsManagerCar.load();
        ////////////////////////// ROAD /////////////////////////////////////
        const assetsManagerRoad = new BABYLON.AssetsManager(scene);
        // const meshTaskRoad = assetsManagerRoad.addMeshTask("roadmeshes", "", "", "Models/Roads/Road10/B/Road10.babylon");
        const meshTaskRoad = assetsManagerRoad.addMeshTask("roadmeshes", "", "", "Models/Environments/Env7/B/Env7.babylon");
        meshTaskRoad.onSuccess = function (task) {
            // task.loadedMeshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(task.loadedMeshes[0], BABYLON.PhysicsImpostor.MeshImpostor, { mass: 3, friction: 0, restitution: 0.3 });
            Array.prototype.forEach.call(task.loadedMeshes, (m, i) => {
                // if (m.parent == null) {
                //     physicsRoot.addChild(m)
                // }
                task.loadedMeshes[i].physicsImpostor = new BABYLON.PhysicsImpostor(task.loadedMeshes[i], BABYLON.PhysicsImpostor.MeshImpostor, { mass: 3, friction: 0, restitution: 0.3 });
            });
            task.loadedMeshes[0].position = new BABYLON.Vector3(-14, -2.2*0+20, -40);
            //task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        }
        assetsManagerRoad.load();
        // var wheelfrontLeft_pivot = new BABYLON.MeshBuilder.CreateSphere("leftFront", { diameter: 0.05 }, scene);
        // var wheelfrontRight_pivot = new BABYLON.MeshBuilder.CreateSphere("rightFront", { diameter: 0.05 }, scene);
        // var wheelbackLeft_pivot = new BABYLON.MeshBuilder.CreateSphere("leftBack", { diameter: 0.05 }, scene);
        // var wheelbackRight_pivot = new BABYLON.MeshBuilder.CreateSphere("rightBack", { diameter: 0.05 }, scene);



        var groundSize = 100;

        var ground = BABYLON.Mesh.CreateGround("ground1", groundSize, groundSize, 2, scene);

        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);//0.75, 1, 0.25);
        ground.material = groundMaterial;
        ground.position.y = -0.30*0;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
        // console.log(meshTask);
        // scene.activeCamera.useFramingBehavior = true;

        // var framingBehavior = scene.activeCamera.getBehaviorByName("Framing");
        // framingBehavior.framingTime = 0;
        // framingBehavior.elevationReturnTime = -1;

        // var worldExtends = scene.getWorldExtends();
        // scene.activeCamera.lowerRadiusLimit = null;
        // framingBehavior.zoomOnBoundingInfo(worldExtends.min, worldExtends.max);


  /*------------End Create other Wheels as Instances, Parent and Position----------*/
  
  	/*-----------------------Path------------------------------------------*/ 
	
	// Create array of points to describe the curve
	var points = [];
	var n = 450; // number of points
	var r = 50; //radius
	for (var i = 0; i < n + 1; i++) {
		points.push( new BABYLON.Vector3((r + (r/5)*Math.sin(8*i*Math.PI/n))* Math.sin(2*i*Math.PI/n), 0, (r + (r/10)*Math.sin(6*i*Math.PI/n)) * Math.cos(2*i*Math.PI/n)));
	}	
	 /*----------------Position and Rotate Car at Start---------------------------*/
    //  carTorso.position.y = 4;
    //  carTorso.position.z = r;
    // carTorso.translate(0,0,0); 
    var path3d = new BABYLON.Path3D(points);
    var normals = path3d.getNormals();
    var theta = Math.acos(BABYLON.Vector3.Dot(BABYLON.Axis.Z,normals[0]));
    // scene.registerBeforeRender(function () {
                            
    //     carTorso.translate(new BABYLON.Vector3(0, 4, r), 0.001, BABYLON.Space.LOCAL);
    //     carTorso.rotate(BABYLON.Axis.Y, theta, BABYLON.Space.WORLD); 


    // });
 
    //  var startRotation = carTorso.rotationQuaternion;
     /*----------------End Position and Rotate Car at Start---------------------*/
    //Draw the curve
	var track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
	track.color = new BABYLON.Color3(0, 0, 0);
  /*-----------------------End Path------------------------------------------*/ 
        scene.onKeyboardObservable.add((kbInfo) => {


            // wheel1_14.parent = wheel1_14_pivot;
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    if (rotatedFlag) {
                        scene.registerBeforeRender(function () {
                            
                            carTorso.translate(new BABYLON.Vector3(0, 0, -1), 0.001, BABYLON.Space.LOCAL);
                            wheelfrontLeft.addRotation(-deltaAngle, 0, 0);
                            wheelfrontRight.addRotation(-deltaAngle, 0, 0);
                            wheelbackRight.addRotation(-deltaAngle, 0, 0);
                            wheelbackLeft.addRotation(-deltaAngle, 0, 0);


                        });
                    }
                    rotatedFlag = 0;

                   
                    if (kbInfo.event.key == "a" || kbInfo.event.key == "A") {
                        if (righatFrontAngle < Math.PI / 4) {
                            wheelfrontLeft.rotation.copyFromFloats(0,0,0);
                            // wheelfrontRight.rotation.copyFrom(wheelfrontLeft.rotation);
                            rightFrontAngle += deltaAngle;
                            carTorso.rotation.copyFromFloats(0, 0, 0);
                            // wheelfrontLeft.addRotation(0,deltaAngle,0);
                            // wheelfrontRight.addRotation(0,deltaAngle,0);

                            // wheelfrontLeft.rotate(new BABYLON.Vector3(0,-1,0), deltaAngle, BABYLON.Space.LOCAL);
                            
                            rotatedFlag = 0;
                        }
                        carTorso.addRotation(0, -2 * deltaAngle, 0);
                    }
                    else if (kbInfo.event.key == "d" || kbInfo.event.key == "D") {
                        // wheelfrontLeft.rotation.copyFromFloats(0,0,0);

                        if (rightFrontAngle > -Math.PI / 4) {
                            // wheelfrontLeft.rotation.copyFromFloats(0,0,0);

                            rightFrontAngle -= deltaAngle;
                            carTorso.rotation.copyFromFloats(0, 0, 0);
                            // wheelfrontLeft.addRotation(0,0,deltaAngle);
                            // wheelfrontLeft.rotate(new BABYLON.Vector3(0,1,0), deltaAngle, BABYLON.Space.LOCAL);

                            
                            // carTorso.translate(new BABYLON.Vector3(0, 0, 1), 0.01, BABYLON.Space.LOCAL);
                            // carTorso.position.x -= Math.cos(deltaAngle);
                            // console.log(rightFrontAngle);
                            rotatedFlag = 0;

                        }
                        carTorso.addRotation(0, 2 * deltaAngle, 0);

                    }
                    break;
            }

        });











        return scene;
    }

    var scene = createScene();
    // console.log(scene.getMeshById("wheel.13"));

    // console.log(scene.meshes);
    var scene1 = createScene0();
    sceneToRender = scene;
    engine.runRenderLoop(function () {
        if (sceneToRender) {
            sceneToRender.render();

        }

        //  scene1.render();
    });

});
