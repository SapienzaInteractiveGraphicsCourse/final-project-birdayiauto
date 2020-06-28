"use strict";

var canvas;
var gl;
var program;
var engine;
var direction = 0;
var carTorso;
var wheelfrontLeft;
var wheelbackLeft;
var wheelbackRight;
var wheelfrontRight;

var ps_carTorso;
var ps_wheelfrontLeft;
var ps_wheelbackLeft;
var ps_wheelbackRight;
var ps_wheelfrontRight;

var turningFlag = 0;
var startTimer = 1;
var startMotion = 0;
var activateTimer = 0;
var counterTimer = 0;

var keysActions = {
    "KeyW": 'acceleration',
    "KeyS": 'braking',
    "KeyA": 'left',
    "KeyD": 'right',
    "KeyP": 'start'
};
// bearbird body parts
var shoulderLeft;
var shoulderRight;
var rightBone;
var leftBone;
var rightKnee;
var leftKnee;


var vehicleReady = false;

var ZERO_QUATERNION = new BABYLON.Quaternion();
var vehicle, chassisMesh, redMaterial, blueMaterial, greenMaterial, blackMaterial;
var wheelMeshes = [];
var actions = { accelerate: false, brake: false, right: false, left: false };
var chassisWidth = 1.8;
var chassisHeight = .6;
var chassisLength = 4;
var massVehicle = 200;

var wheelAxisPositionBack = -1;
var wheelRadiusBack = .4;
var wheelWidthBack = .3;
var wheelHalfTrackBack = 1;
var wheelAxisHeightBack = 0.4;

var wheelAxisFrontPosition = 1.0;
var wheelHalfTrackFront = 1;
var wheelAxisHeightFront = 0.4;
var wheelRadiusFront = .4;
var wheelWidthFront = .3;

var friction = 5;
var suspensionStiffness = 10;
var suspensionDamping = 0.3;
var suspensionCompression = 4.4;
var suspensionRestLength = 0.6;
var rollInfluence = 0.0;

var steeringIncrement = .01;
var steeringClamp = 0.2;
var maxEngineForce = 500;
var maxBreakingForce = 10;
var incEngine = 10.0;
var breakingForce = 0;
var engineForce = 0;
var vehicleSteering = 0;
var FRONT_LEFT = 0;
var FRONT_RIGHT = 1;
var BACK_LEFT = 2;
var BACK_RIGHT = 3;

var wheelDirectionCS0;
var wheelAxleCS;

var deltaAngle = 0.01 * Math.PI / 3;
var leftFrontAngle = 0;
var rightFrontAngle = 0;
var rotatedFlag = 1;

var bearbirdTorso;

window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');

    // var engine = new BABYLON.Engine(canvas, true);
    var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };

    var createScene = async function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.White();

        var camera = new BABYLON.ArcRotateCamera("arcCam",
            0,
            0,
            20.0, new BABYLON.Vector3(0, 0, 0), scene);//20.0, BABYLON.Vector3.Zero(), scene);
        camera.setPosition(new BABYLON.Vector3(100 + 10, 150 + 1, 80));
        camera.attachControl(canvas, true);

        // var light = new BABYLON.PointLight("PointLight",new BABYLON.Vector3(
        // 0,0,0),scene);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(100, 0, 0), scene);




        light.parent = camera;
        light.intensity = 1.5;


        // Game Timer
        var gameTimer = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var tableTimer = new BABYLON.GUI.Rectangle();
        var timerClock = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var clockPic = new BABYLON.GUI.Image("", "clock.png");
        clockPic.width = "100px";
        clockPic.height = "100px";
        clockPic.verticalAlignment = 0;
        clockPic.leftInPixels = 750;
        timerClock.addControl(clockPic);
        tableTimer.width = "200px";
        tableTimer.height = "100px";
        tableTimer.cornerRadius = 10;
        tableTimer.color = "Orange";
        tableTimer.thickness = 10;
        tableTimer.background = "Red";
        tableTimer.horizontalAlignment = 1;
        tableTimer.verticalAlignment = 0;
        var j = 0;

        gameTimer.addControl(tableTimer);
        var textTimer = new BABYLON.GUI.TextBlock();
        textTimer.text = "00:00";
        textTimer.color = "green";
        textTimer.fontSize = 48;
        textTimer.width = "200px";
        tableTimer.addControl(textTimer);
        // Countdown Timer

        var countdownTimer = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var i = 5; // seconds
        var textCountdown = new BABYLON.GUI.TextBlock("text", new String(i));
        textCountdown.fontSize = 555;

        ////////////////////////// COIN //////////////////////////////////////
        var coinTable = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var coinContainer = new BABYLON.GUI.Rectangle();
        coinContainer.width = "75px";
        coinContainer.height = "75px";
        coinContainer.cornerRadius = 20;
        coinContainer.thickness = 5;
        coinContainer.color = "Yellow";
        coinContainer.background = "Blue";
        coinContainer.horizontalAlignment = 0;
        coinContainer.verticalAlignment = 0;
        coinContainer.leftInPixels = 100;
        coinTable.addControl(coinContainer);
        var coinText = new BABYLON.GUI.TextBlock();
        coinText.text = "0";
        coinText.color = "green";
        coinText.fontStyle = "bold";
        coinText.fontSize = 48;
        coinText.width = "200px";
        coinContainer.addControl(coinText);

        var coinSignTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var coinSign = new BABYLON.GUI.Image("", "coin.png");
        coinSign.width = "50px";
        coinSign.height = "50px";
        coinSign.verticalAlignment = 0;
        coinSign.horizontalAlignment = 0;
        coinSign.leftInPixels = 50;
        coinSignTexture.addControl(coinSign);


        // Enable physics
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.AmmoJSPlugin());//,new BABYLON.CannonJSPlugin());
        greenMaterial = new BABYLON.StandardMaterial("RedMaterial", scene);
        greenMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.8, 0.5);
        greenMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.8, 0.5);

        blackMaterial = new BABYLON.StandardMaterial("RedMaterial", scene);
        blackMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        blackMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
        wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

        // Enable physics
        var groundSize = 300;
        //  car.position.y=1.5;

        // var ground = BABYLON.Mesh.CreateGround("ground1", { width: groundSize, height: groundSize }, scene);
        var ground = BABYLON.Mesh.CreateGround("ground1", groundSize, groundSize, 2, scene);

        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);//0.75, 1, 0.25);
        ground.material = groundMaterial;
        ground.position.y = -0;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);




        //   Convert to physics object and position
        var assetsManagerCity = new BABYLON.AssetsManager(scene);

        var meshTaskCity = assetsManagerCity.addMeshTask("Citymeshes", "", "", "Models/Environments/Env7/B/Env7.babylon");
        meshTaskCity.onSuccess = function (task) {

            var City_ = task.loadedMeshes[0];
        }

        /////////////////////////////// BOMBS /////////////////////////////////
        var meshTaskBomb = assetsManagerCity.addMeshTask("bombmeshes", "", "", "Models/bomb.babylon");
        meshTaskBomb.onSuccess = function (task) {
            task.loadedMeshes[0].scaling = new BABYLON.Vector3(4, 4, 4);
            task.loadedMeshes[0].addRotation(Math.PI / 6, 0, 0);
            positionExplosion = new BABYLON.Vector3(0, 0, -15);
            bombTorso = task.loadedMeshes[0];
            boxBomb.parent = bombTorso;
        }

        var meshTaskBomb2 = assetsManagerCity.addMeshTask("bombmeshes2", "", "", "Models/bomb.babylon");
        meshTaskBomb2.onSuccess = function (task) {
            task.loadedMeshes[0].scaling = new BABYLON.Vector3(4, 4, 4);
            task.loadedMeshes[0].addRotation(Math.PI / 6, 0, 0);
            positionExplosion2 = new BABYLON.Vector3(10, 0, -5);
            bombTorso2 = task.loadedMeshes[0];
            boxBomb2.parent = bombTorso2;
        }

        /////////////////////////////// COINS /////////////////////////////////
        var meshTaskCoin = assetsManagerCity.addMeshTask("coinmeshes", "", "", "Models/coin.babylon");
        meshTaskCoin.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(0, 400, -20.5);
            task.loadedMeshes[0].scaling = new BABYLON.Vector3(20, 20, 20);
            task.loadedMeshes[0].addRotation(Math.PI / 6, 0, 0);
            positionExplosion2 = new BABYLON.Vector3(10, 0, -25);
            coinTorso = task.loadedMeshes[0];
            coinPlane.parent = coinTorso;
        }

        var meshTaskPlatform = assetsManagerCity.addMeshTask("platformmeshes", "", "", "Models/speedy.babylon");
        meshTaskPlatform.onSuccess = function (task) {

            task.loadedMeshes[0].position = new BABYLON.Vector3(0, 0.0, -25.5);
            task.loadedMeshes[0].scaling = new BABYLON.Vector3(1, 1, 1);
            task.loadedMeshes[0].addRotation(0, Math.PI, 0);

            var platformMaterial = new BABYLON.StandardMaterial("platformmat", scene);
            platformMaterial.emissiveTexture = new BABYLON.Texture("speedy.png", scene);
            platformTorso = task.loadedMeshes[0];
            platformTorso.material = platformMaterial;
            platformPlane.parent = platformTorso;
        }
        var meshTaskBearBirdBuddy = assetsManagerCity.addMeshTask("bearbirdmeshes", "","","Models/bearbird.babylon");
        meshTaskBearBirdBuddy.onSuccess = function(task){
            bearbirdTorso = task.loadedMeshes[0];
            bearbirdTorso.parent = carTorso;
            bearbirdTorso.position.y = 0.5;
            bearbirdTorso.position.x = 0.35;

            shoulderRight = task.loadedMeshes[9];
            shoulderLeft = task.loadedMeshes[11];
            rightKnee = task.loadedMeshes[25];
            leftKnee = task.loadedMeshes[26];
            rightBone = task.loadedMeshes[19];
            leftBone = task.loadedMeshes[20];

            shoulderRight.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
            shoulderLeft.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
            rightBone.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
            leftBone.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
        }
        var meshTaskCar = assetsManagerCity.addMeshTask("carmeshes", "", "", "Models/Cars/Car9/B/Car9.babylon");
        meshTaskCar.onSuccess = function (task) {
            let cannon = true;
            let forceFactor = cannon ? 1 : 1500;
            carTorso = task.loadedMeshes.filter(q => q.name == "Car1")[0]
            // bearbirdTorso.parent = carTorso;
            wheelfrontLeft = task.loadedMeshes.filter(q => q.name == "Left_Wheel")[0]
            wheelbackLeft = task.loadedMeshes.filter(q => q.name == "Back_Left_Wheel")[0]
            wheelbackRight = task.loadedMeshes.filter(q => q.name == "Back_Right_Wheel")[0]
            wheelfrontRight = task.loadedMeshes.filter(q => q.name == "Right_Wheel")[0]
            ps_carTorso = task.loadedMeshes.filter(q => q.name == "Body_Box")[0]
            ps_wheelfrontLeft = task.loadedMeshes.filter(q => q.name == "Left_Wheel_Cylinder")[0];
            ps_wheelbackLeft = task.loadedMeshes.filter(q => q.name == "Back_Left_Wheel_Cylinder")[0];
            ps_wheelbackRight = task.loadedMeshes.filter(q => q.name == "Back_Right_Wheel_Cylinder")[0];;
            ps_wheelfrontRight = task.loadedMeshes.filter(q => q.name == "Right_Wheel_Cylinder")[0];
            chassisMesh = carTorso;
            var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);
            camera.radius = 10;
            camera.heightOffset = 4;
            camera.rotationOffset = 0;
            camera.cameraAcceleration = 0.05;
            camera.maxCameraSpeed = 400;
            camera.attachControl(canvas, true);
            camera.lockedTarget = chassisMesh; //version 2.5 onwards
            scene.activeCamera = camera;
            carFrontier.parent = carTorso;

            wheelMeshes[FRONT_LEFT] = wheelfrontLeft;
            wheelMeshes[FRONT_RIGHT] = wheelfrontRight;
            wheelMeshes[BACK_LEFT] = wheelbackLeft;
            wheelMeshes[BACK_RIGHT] = wheelbackRight;

        }


        var carFrontier = BABYLON.MeshBuilder.CreateSphere("carBox", { diameterX: 1.5, diameterY: 0.5, diameterZ: 0.5 }, scene);
        carFrontier.isVisible = true;
        var coinPlane = BABYLON.MeshBuilder.CreateGround("ground", { width: 0.05, height: 0.05 }, scene);
        var platformPlane = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
        platformPlane.isVisible = true;
        platformPlane.addRotation(Math.PI / 2, 0, 0);


        var boxBomb = BABYLON.MeshBuilder.CreateGround("ground", { width: 0.05, height: 0.05 }, scene);
        var boxBomb2 = BABYLON.MeshBuilder.CreateGround("ground", { width: 0.05, height: 0.05 }, scene);

        var explosion = BABYLON.ParticleHelper.CreateAsync("explosion", scene);
        boxBomb.addRotation(-Math.PI / 6, 0, 0);
        boxBomb.addRotation(Math.PI / 2, 0, 0);
        boxBomb.isVisible = true;
        boxBomb2.addRotation(-Math.PI / 6, 0, 0);
        boxBomb2.addRotation(Math.PI / 2, 0, 0);
        boxBomb2.isVisible = true;




        assetsManagerCity.load();


        assetsManagerCity.onFinish = function (task) {
            task[0].loadedMeshes.forEach((m, i) => {
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0.9, restitution: 0.3 });
            })
            var terraind = task[0].loadedMeshes[0];
            var ticker = 0;

            let spheres = [];

            scene.registerBeforeRender(function () {
                if (ticker++ % 60) return;

                let s = BABYLON.MeshBuilder.CreateBox("b", { diameter: 1 });
                s.position.y = 200;
                s.position.z = 15 + Math.random() * 20;
                s.position.x = -10 + Math.random() * 20;
                s.scaling = new BABYLON.Vector3(3, 3, 3);

                s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10 });

                var tuple = [s, new Date().getTime()]
                spheres.push(tuple);
                spheres.forEach(function ([sphere, sphere_time]) {
                    var difference = ((new Date().getTime()) - sphere_time) / 1000;
                    if (difference > 10) {
                        sphere.dispose();
                    }
                });

                spheres = spheres.filter(s => !s[0].isDisposed());

            });


            ps_carTorso.isVisible = false;

            createVehicle2(new BABYLON.Vector3(0, 0, 0), ZERO_QUATERNION, carTorso, scene);

        }






        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);

        scene.onKeyboardObservable.add((kbInfo) => {

            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    if (startTimer && (kbInfo.event.key == "p" || kbInfo.event.key == "P")) {
                        console.log(i);
                        
                        countdownTimer.addControl(textCountdown);

                        var handle = window.setInterval(() => {
                            // console.log(i);
                            textCountdown.text = new String(i);
    
                            
                            // console.log(i)
                            if (i == 0) {
                                // textCountdown.text = new String(i);
    
                                window.clearInterval(handle);
                                textCountdown.dispose();
                                countdownTimer.dispose();
                                startMotion = 1;
                                startTimer = 0;
                                activateTimer = 1;
                            }
                            i--;
                        }, 1000);
                    }
                    if (activateTimer) {
                        activateTimer = 0;
                        var handle2 = window.setInterval(() => {
                            j++;
                            if (j % 60 == 0) {
                                counterTimer += 1;
                                j = 0;
                            }
                            if (j < 10) {
                                var timerText = "0" + counterTimer + ":0" + j;
                            }
                            else {
                                var timerText = "0" + counterTimer + ":" + j;
                            }
                            textTimer.text = timerText;
                        }, 1000);

                    }
                    break;
                }
            });
        scene.registerBeforeRender(function () {
            
            var dt = engine.getDeltaTime().toFixed() / 1000;

            if (vehicleReady) {
                var speed = vehicle.getCurrentSpeedKmHour();
                var maxSteerVal = 0.2;
                breakingForce = 0;
                engineForce = 0;

                
                    
                
                if (startMotion) {
                    if (actions.braking) {
                        if (speed < -1) {
                            breakingForce = maxBreakingForce;
                            direction = 1;
                        } else {
                            engineForce = maxEngineForce;
                        }
                    } else if (actions.acceleration) {
                        if (speed > 1) {
                            direction = -1;
                            breakingForce = maxBreakingForce;
                        } else {
                            engineForce = -maxEngineForce;
                        }
                    }
                    if (actions.right) {
                        if (vehicleSteering < steeringClamp) {
                            vehicleSteering += steeringIncrement;
                            turningFlag = 1;
                        }
                    } else if (actions.left) {
                        if (vehicleSteering > -steeringClamp) {
                            vehicleSteering -= steeringIncrement;
                            turningFlag = 2;
                        }
                    }
                    else {
                        turningFlag = 3;
                        vehicleSteering = 0;
                    }
                    
                }
                vehicle.applyEngineForce(engineForce, FRONT_LEFT);
                vehicle.applyEngineForce(engineForce, FRONT_RIGHT);

                vehicle.setBrake(breakingForce / 2, FRONT_LEFT);
                vehicle.setBrake(breakingForce / 2, FRONT_RIGHT);
                vehicle.setBrake(breakingForce, BACK_LEFT);
                vehicle.setBrake(breakingForce, BACK_RIGHT);

                vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT);
                vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT);


                var tm, p, q, i;
                var n = vehicle.getNumWheels();
                for (i = 0; i < n; i++) {
                    vehicle.updateWheelTransform(i, true);
                    tm = vehicle.getWheelTransformWS(i);
                    p = tm.getOrigin();
                    q = tm.getRotation();
                    wheelMeshes[i].addRotation(direction * 5 * deltaAngle, 0, 0);
                    if (turningFlag == 1) {
                        if (rightFrontAngle < Math.PI / 12) {
                            wheelMeshes[0].rotate(new BABYLON.Vector3(0, 1, 0), deltaAngle, carTorso.position);//rotationQuaternion.set(q.x(), q.y(), q.z(), q.w());
                            wheelMeshes[1].rotate(new BABYLON.Vector3(0, 1, 0), deltaAngle, carTorso.position);
                            bearbirdTorso.rotate(new BABYLON.Vector3(0, 0, 1), deltaAngle, BABYLON.Space.LOCAL);
                        }
                        rightFrontAngle += deltaAngle;
                    }
                    else if (turningFlag == 2) {
                        if (rightFrontAngle > -Math.PI / 12) {
                            wheelMeshes[0].rotate(new BABYLON.Vector3(0, 1, 0), -deltaAngle, carTorso.position);
                            wheelMeshes[1].rotate(new BABYLON.Vector3(0, 1, 0), -deltaAngle, carTorso.position);
                            bearbirdTorso.rotate(new BABYLON.Vector3(0, 0, 1), -deltaAngle, BABYLON.Space.LOCAL);

                        }
                        rightFrontAngle -= deltaAngle;
                    }
                    else if (turningFlag == 3) {
                        wheelMeshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
                        wheelMeshes[1].rotation = new BABYLON.Vector3(0, 0, 0);
                        bearbirdTorso.rotation = new BABYLON.Vector3(0, 0, 0);

                        // wheelMeshes[0].addRotation(direction * 5 * deltaAngle, 0, 0);
                        // wheelMeshes[1].addRotation(direction * 5 * deltaAngle, 0, 0);

                        rightFrontAngle = 0;
                    }
                }
                tm = vehicle.getChassisWorldTransform();
                p = tm.getOrigin();
                q = tm.getRotation();
                chassisMesh.position.set(p.x(), p.y(), p.z());
                chassisMesh.rotationQuaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        });
        return scene;
    }
    function createVehicle2(pos, quat, own_mesh, scene) {
        //Going Native
        var wheel_size_FRONT_LEFT = wheelMeshes[FRONT_LEFT].getBoundingInfo().boundingBox.extendSizeWorld;
        var wheel_size_FRONT_RIGHT = wheelMeshes[FRONT_RIGHT].getBoundingInfo().boundingBox.extendSizeWorld;
        var wheel_size_BACK_LEFT = wheelMeshes[BACK_LEFT].getBoundingInfo().boundingBox.extendSizeWorld;
        var wheel_size_BACK_RIGHT = wheelMeshes[BACK_RIGHT].getBoundingInfo().boundingBox.extendSizeWorld;

        //body
        var physicsWorld = scene.getPhysicsEngine().getPhysicsPlugin().world;

        var geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5));
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(53, 80, 40));//53, 100, 40));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        var motionState = new Ammo.btDefaultMotionState(transform);
        var localInertia = new Ammo.btVector3(0, 0, 0);
        geometry.calculateLocalInertia(massVehicle, localInertia);

        var massOffset = new Ammo.btVector3(0, -0 * wheel_size_FRONT_LEFT.y / 2, 0);
        var transform2 = new Ammo.btTransform();
        transform2.setIdentity();
        transform2.setOrigin(massOffset);
        var compound = new Ammo.btCompoundShape();
        compound.addChildShape(transform2, geometry);

        var body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, compound, localInertia));

        physicsWorld.addRigidBody(body);

        var engineForce = 0;
        var vehicleSteering = 0;
        var breakingForce = 0;
        var tuning = new Ammo.btVehicleTuning();
        var rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
        vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
        vehicle.setCoordinateSystem(0, 1, 2);
        physicsWorld.addAction(vehicle);
        var trans = vehicle.getChassisWorldTransform();
        function addWheel(isFront, pos, radius, width, index) {


            var wheelInfo = vehicle.addWheel(
                pos,
                wheelDirectionCS0,
                wheelAxleCS,
                suspensionRestLength,
                radius,
                tuning,
                isFront);

            wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
            wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
            wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
            wheelInfo.set_m_maxSuspensionForce(600000);
            wheelInfo.set_m_frictionSlip(40);
            wheelInfo.set_m_rollInfluence(rollInfluence);
        }
        var wheel_position_FRONT_LEFT = wheelMeshes[FRONT_LEFT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_FRONT_RIGHT = wheelMeshes[FRONT_RIGHT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_BACK_LEFT = wheelMeshes[BACK_LEFT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_BACK_RIGHT = wheelMeshes[BACK_RIGHT].getBoundingInfo().boundingBox.centerWorld;


        var offsetcar = ps_carTorso.getBoundingInfo().boundingBox.extendSizeWorld.y / 2;
        addWheel(true, new Ammo.btVector3(wheel_position_FRONT_LEFT.x * 1, -1 * wheel_position_FRONT_LEFT.y / 1 + offsetcar, 1 * wheel_position_FRONT_LEFT.z), wheel_size_FRONT_LEFT.y, wheel_size_FRONT_LEFT.z, FRONT_LEFT);
        addWheel(true, new Ammo.btVector3(wheel_position_FRONT_RIGHT.x * 1, -1 * wheel_position_FRONT_RIGHT.y / 1 + offsetcar, 1 * wheel_position_FRONT_RIGHT.z), wheel_size_FRONT_RIGHT.y, wheel_size_FRONT_RIGHT.z, FRONT_RIGHT);
        addWheel(false, new Ammo.btVector3(wheel_position_BACK_LEFT.x * 1, -1 * wheel_position_BACK_LEFT.y / 1 + offsetcar, 1 * wheel_position_BACK_LEFT.z), wheel_size_BACK_LEFT.y, wheel_size_BACK_LEFT.z, BACK_LEFT);
        addWheel(false, new Ammo.btVector3(wheel_position_BACK_RIGHT.x * 1, -1 * wheel_position_BACK_RIGHT.y / 1 + offsetcar, 1 * wheel_position_BACK_RIGHT.z), wheel_size_BACK_RIGHT.y, wheel_size_BACK_RIGHT.z, BACK_RIGHT);

        vehicleReady = true;
    }
    function createChassisMesh(w, l, h, scene) {

        var mesh = new BABYLON.MeshBuilder.CreateBox("box", { width: w, depth: h, height: l }, scene);
        mesh.rotationQuaternion = new BABYLON.Quaternion();
        mesh.material = greenMaterial;

        var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);
        camera.radius = 10;
        camera.heightOffset = 4;
        camera.rotationOffset = 0;
        camera.cameraAcceleration = 0.05;
        camera.maxCameraSpeed = 400;
        camera.attachControl(canvas, true);
        camera.lockedTarget = mesh; //version 2.5 onwards
        scene.activeCamera = camera;

        return mesh;
    }
    function createWheelMesh(radius, width, scene) {
        var mesh = new BABYLON.MeshBuilder.CreateCylinder("Wheel", { diameter: radius * 2, height: width, tessellation: 24 }, scene);

        mesh.rotationQuaternion = new BABYLON.Quaternion();
        mesh.material = blackMaterial;
        mesh.isVisible = true;
        return mesh;
    }


    function keyup(e) {
        if (keysActions[e.code]) {
            actions[keysActions[e.code]] = false;


            //e.preventDefault();
            //e.stopPropagation();

            //return false;
        }

    }

    function keydown(e) {
        if (keysActions[e.code]) {
            actions[keysActions[e.code]] = true;
            //e.preventDefault();
            //e.stopPropagation();

            //return false;
        }
    }
    var dispossingObjectd = (newMeshes, scene, scaling) => {
        // Set the date we're counting down to
        var countDownDate = new Date().getTime();

        // Update the count down every 1 second
        var x = setInterval(function () {

            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            document.getElementById("demo").innerHTML = days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ";

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("demo").innerHTML = "EXPIRED";
            }
        }, 1000);
    };
    var makePhysicsObject = (newMeshes, scene, scaling) => {
        // Create physics root and position it to be the center of mass for the imported mesh
        var physicsRoot = new BABYLON.Mesh("physicsRoot", scene);
        //physicsRoot.position.y -= 0.9;

        // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
        newMeshes.forEach((m, i) => {
            if ((m.name.indexOf("Box") != -1) || (m.name.indexOf("Cylinder") != -1)) {
                m.isVisible = false
                physicsRoot.addChild(m)
            }
        })

        // Add all root nodes within the loaded gltf to the physics root
        newMeshes.forEach((m, i) => {
            if (m.parent == null) {
                physicsRoot.addChild(m)
            }
        })

        // Make every collider into a physics impostor
        physicsRoot.getChildMeshes().forEach((m) => {
            if (m.name.indexOf("Box") != -1) {
                m.scaling.x = Math.abs(m.scaling.x)
                m.scaling.y = Math.abs(m.scaling.y)
                m.scaling.z = Math.abs(m.scaling.z)
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, friction: 0.5, restitution: 0.3 }, scene);
            }
            else
                if (m.name.indexOf("Cylinder") != -1) {
                    m.scaling.x = 3.0 * Math.abs(m.scaling.x)
                    m.scaling.y = 4.0 * Math.abs(m.scaling.y)
                    m.scaling.z = 3.0 * Math.abs(m.scaling.z)
                    // m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 10, friction: 0.5, restitution: 0.0 }, scene);
                    m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10, friction: 0.5, restitution: 0.7 }, scene);
                }

        })

        // Scale the root object and turn it into a physics impsotor
        physicsRoot.scaling.scaleInPlace(scaling)
        physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.NoImpostor, { mass: 10, friction: 0.5, restitution: 0.7 }, scene);

        return physicsRoot
    }

    var engine;
    try {
        engine = createDefaultEngine();
    } catch (e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        engine = createDefaultEngine();
    }
    if (!engine) throw 'engine should not be null.';
    scene = createScene();;
    scene.then(returnedScene => { sceneToRender = returnedScene; });

    // var scene1 = createScene0();
    // assetsManagerCity.onFinish= function (task) {
    engine.runRenderLoop(function () {
        if (sceneToRender) {
            sceneToRender.render();
        }
    });
    // };
});
