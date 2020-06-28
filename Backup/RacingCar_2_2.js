"use strict";

var canvas;
var gl;
var program;
var engine;

var carTorso;
var Body_Box;
var wheelfrontLeft;
var wheelbackLeft;
var wheelbackRight;
var wheelfrontRight;

var ps_carTorso;
var ps_wheelfrontLeft;
var ps_wheelbackLeft;
var ps_wheelbackRight;
var ps_wheelfrontRight;

var bearbirdTorso;
// bearbird body parts
var shoulderLeft;
var shoulderRight;
var rightBone;
var leftBone;
var rightKnee;
var leftKnee;
var keysActions = {
    "KeyW": 'acceleration',
    "KeyS": 'braking',
    "KeyA": 'left',
    "KeyD": 'right'
};

var vehicleReady = false;

var ZERO_QUATERNION = new BABYLON.Quaternion();
var vehicle, chassisMesh, redMaterial, blueMaterial, greenMaterial, blackMaterial;
var wheelMeshes = [];
var wheelMeshes2 = [];
var actions = { accelerate: false, brake: false, right: false, left: false };
var localscale_ = 1;
var offsetcar;
var chassisWidth = 1.8 * localscale_;
var chassisHeight = .9 * localscale_;
var chassisLength = 4 * localscale_;
var massVehicle = 200//*localscale_;
var pos_car_fact = 3;
var initial_car_pos = new BABYLON.Vector3(pos_car_fact * 70, 82, pos_car_fact * 40);

var wheelAxisPositionBack = -chassisLength * 0.4;//-1*localscale_;
var wheelRadiusBack = .4 * localscale_;
var wheelWidthBack = .3 * localscale_;
var wheelHalfTrackBack = chassisWidth * 0.5;//1*localscale_;
var wheelAxisHeightBack = 0.4 * localscale_;

var wheelAxisFrontPosition = chassisLength * 0.4;//1.0*localscale_;
var wheelHalfTrackFront = chassisWidth * 0.5;//1*localscale_;
var wheelAxisHeightFront = 0.4 * localscale_;
var wheelRadiusFront = .4 * localscale_;
var wheelWidthFront = .3 * localscale_;

var friction = 5;
var suspensionStiffness = 5 * 5  //*localscale_;
var suspensionDamping = 0.3 //*localscale_*1;
var suspensionCompression = 8.4 //*localscale_*1;
var suspensionRestLength = chassisWidth * 0.5;//0.3 //*localscale_;
var rollInfluence = 0.0;//*localscale_*1;

var steeringIncrement = .01;
var steeringClamp = 0.2;
var maxEngineForce = 500;//500*localscale_*1;
var maxBreakingForce = 10;//*localscale_*1;
var incEngine = 10.0;//*localscale_*1;
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
var coinFlag = 0;
var coinCounter = 0;
var speedFlag = 0;
var speedCounter = 0;
var turningFlag = 0;
var startMotion = 0;
var direction = 0;
var activateTimer = 0;
var counterTimer = 0;
var startTimer = 1;
// window.addEventListener('DOMContentLoaded', function () {
//     canvas = document.getElementById('gl-canvas');
//     engine = new BABYLON.Engine(canvas, true);
//     var createScene = function () {
//         var scene = new BABYLON.Scene(engine);
//         scene.clearColor = new BABYLON.Color3.White();
//         var camera = new BABYLON.FreeCamera('camera1', new BABYLON.
//             Vector3(0, 10, -10), scene);
//         camera.setTarget(BABYLON.Vector3.Zero());
//         var box = BABYLON.Mesh.CreateBox("Box", 4.0, scene);
//         return scene;
//     }

//     var scene = createScene();
//     engine.runRenderLoop(function () {
//         scene.render();
//     });
// });
var cardimensions = function (glocabl_chassis_Width, glocabl_chassis_Height, glocabl_chassis_Length, glocabl_chassis_mass, localscale_) {



    chassisWidth = glocabl_chassis_Width;//1.8 * localscale_;
    chassisHeight = glocabl_chassis_Height;//.9 * localscale_;
    chassisLength = glocabl_chassis_Length;//4 * localscale_;
    massVehicle = glocabl_chassis_mass; //200//*localscale_;

    wheelAxisPositionBack = -chassisLength * 0.4;//-1*localscale_;
    wheelRadiusBack = .4 * localscale_;
    wheelWidthBack = .3 * localscale_;
    wheelHalfTrackBack = chassisWidth * 0.5;//1*localscale_;
    wheelAxisHeightBack = 0.4 * localscale_;

    wheelAxisFrontPosition = chassisLength * 0.4;//1.0*localscale_;
    wheelHalfTrackFront = chassisWidth * 0.5;//1*localscale_;
    wheelAxisHeightFront = 0.4 * localscale_;
    wheelRadiusFront = .4 * localscale_;
    wheelWidthFront = .3 * localscale_;

    friction = 5;
    suspensionStiffness = 5 * 5  //*localscale_;
    suspensionDamping = 0.3 //*localscale_*1;
    suspensionCompression = 8.4 //*localscale_*1;
    suspensionRestLength = 0.0 + 0 * chassisWidth * 0.5;//0.3 //*localscale_;
    rollInfluence = 0.0;//*localscale_*1;

    steeringIncrement = .01;
    steeringClamp = 0.2;
    maxEngineForce = 500 / 2;//500*localscale_*1;
    maxBreakingForce = 10 / 2;//*localscale_*1;
    incEngine = 10.0 / 2;//*localscale_*1;
    breakingForce = 0;
    engineForce = 0;
    vehicleSteering = 0;
    FRONT_LEFT = 0;
    FRONT_RIGHT = 1;
    BACK_LEFT = 2;
    BACK_RIGHT = 3;
}
var bombFlag = 0;
var bombCounter = 0;
var gatheredCoins = 0;
var startMotion2 = 0;
//bombs
var numBombs = 16;
var mesheshTasksBombs = [];
var pos_bombs_fact = 3;
var initial_bombs_pos = new BABYLON.Vector3(pos_car_fact * 70, 74.5, pos_car_fact * 25);
var bombs_positions = [new BABYLON.Vector3(initial_bombs_pos.x, initial_bombs_pos.y - pos_bombs_fact * 0.5, initial_bombs_pos.z),
new BABYLON.Vector3(initial_bombs_pos.x + 10, initial_bombs_pos.y - pos_bombs_fact * 0.7, initial_bombs_pos.z + pos_bombs_fact * 30),
new BABYLON.Vector3(initial_bombs_pos.x + 10, initial_bombs_pos.y - pos_bombs_fact * 0.7, initial_bombs_pos.z + pos_bombs_fact * 43),
new BABYLON.Vector3(initial_bombs_pos.x - pos_bombs_fact * 36, initial_bombs_pos.y - pos_bombs_fact * 0.35, initial_bombs_pos.z + pos_bombs_fact * 84),
new BABYLON.Vector3(initial_bombs_pos.x - pos_bombs_fact * 70, initial_bombs_pos.y - pos_bombs_fact * 0.85, initial_bombs_pos.z + pos_bombs_fact * 116),
new BABYLON.Vector3(-88, 71.5, 417),
new BABYLON.Vector3(-158.31759643554688, 71.2, 392.5709228515625),
new BABYLON.Vector3(-289.6668701171875, 71.5, 366.0986022949219),
new BABYLON.Vector3(-379.8580322265625, 70, 241.9297332763672),
new BABYLON.Vector3(-430.86285400390625, 77.3, 114.7979507446289),
new BABYLON.Vector3(-493.0850524902344, 75, 4.587120056152344),
new BABYLON.Vector3(-395.86175537109375, 72.3, -146.88792419433594),
new BABYLON.Vector3(-283.9041442871094, 71.9, -245.26821899414062),
new BABYLON.Vector3(-83.41072845458984, 73.6, -207.04055786132812),
new BABYLON.Vector3(37.76666259765625, 71.3, -183.37867736816406),
new BABYLON.Vector3(139.16384887695312, 72.1, -107.34320831298828)
]

//rewards
//bombs


// var pos_Coins_fact = 3;
// var initial_Coins_pos = new BABYLON.Vector3(pos_car_fact * 70, 74.5, pos_car_fact * 25);
// var Coins_positions = [new BABYLON.Vector3(initial_Coins_pos.x, initial_Coins_pos.y - pos_Coins_fact * 1, initial_Coins_pos.z),
// new BABYLON.Vector3(initial_Coins_pos.x + 10, initial_Coins_pos.y - pos_Coins_fact * 0.7, initial_Coins_pos.z + pos_Coins_fact * 30),
// new BABYLON.Vector3(initial_Coins_pos.x + 10, initial_Coins_pos.y - pos_Coins_fact * 0.7, initial_Coins_pos.z + pos_Coins_fact * 43),
// new BABYLON.Vector3(initial_Coins_pos.x - pos_Coins_fact * 36, initial_Coins_pos.y - pos_Coins_fact * 0.35, initial_Coins_pos.z + pos_Coins_fact * 84),
// new BABYLON.Vector3(initial_Coins_pos.x - pos_Coins_fact * 70, initial_Coins_pos.y - pos_Coins_fact * 0.85, initial_Coins_pos.z + pos_Coins_fact * 116),
// new BABYLON.Vector3(-88, 71.5, 417),
// new BABYLON.Vector3(-158.31759643554688, 71.2, 392.5709228515625),
// new BABYLON.Vector3(-289.6668701171875, 71.5, 366.0986022949219),
// new BABYLON.Vector3(-379.8580322265625, 70, 241.9297332763672),
// new BABYLON.Vector3(-430.86285400390625, 77.3, 114.7979507446289),
// new BABYLON.Vector3(-493.0850524902344, 75, 4.587120056152344),
// new BABYLON.Vector3(-395.86175537109375, 72.3, -146.88792419433594),
// new BABYLON.Vector3(-283.9041442871094, 71.9, -245.26821899414062),
// new BABYLON.Vector3(-83.41072845458984, 73.6, -207.04055786132812),
// new BABYLON.Vector3(37.76666259765625, 71.3, -183.37867736816406),
// new BABYLON.Vector3(139.16384887695312, 72.1, -107.34320831298828)
// ]
var numCoins = 80;
var coinsTorsos = [];
var coinsPlanes = [];
var meshesTasksCoins = [];
var coinsPositions = [
    // First Group
    new BABYLON.Vector3(215, 72.5, 50),
    new BABYLON.Vector3(216, 72.5, 48),
    new BABYLON.Vector3(218, 72.5, 46),
    new BABYLON.Vector3(220, 72, 44),
    new BABYLON.Vector3(222, 72, 42),
    // Second Group
    new BABYLON.Vector3(228, 73.1, 0),
    new BABYLON.Vector3(227, 73.3, -2),
    new BABYLON.Vector3(226, 74.1, -4),
    new BABYLON.Vector3(225, 74.3, -6),
    new BABYLON.Vector3(224, 74.5, -8),

    // Third Group
    new BABYLON.Vector3(179, 73.1, -83),
    new BABYLON.Vector3(181, 73.3, -86),
    new BABYLON.Vector3(183, 74.1, -89),
    new BABYLON.Vector3(185, 73.1, -92),
    new BABYLON.Vector3(187, 73.3, -95),
    new BABYLON.Vector3(188, 74.1, -98),
    new BABYLON.Vector3(187, 74.3, -101),
    new BABYLON.Vector3(187, 74.5, -104),
    new BABYLON.Vector3(187, 74.3, -107),
    new BABYLON.Vector3(187, 74.5, -109),
    // e {x: -21.2725830078125, y: 71.23190389723554, z: -210.91212463378906}
    //fourth group
    new BABYLON.Vector3(-21, 72.23, -210),
    new BABYLON.Vector3(-22, 72.23, -210),
    new BABYLON.Vector3(-23, 72.23, -210),
    new BABYLON.Vector3(-24, 72.23, -210),
    new BABYLON.Vector3(-25, 72.23, -210),
    new BABYLON.Vector3(-26, 72.23, -210),
    new BABYLON.Vector3(-27, 72.23, -210),
    new BABYLON.Vector3(-28, 72.23, -210),
    new BABYLON.Vector3(-29, 72.23, -210),
    new BABYLON.Vector3(-30, 72.23, -210),

    // fifth gtroup
    // e {x: -221.45681762695312, y: 71.91479574293867, z: -225.51959228515625}
    new BABYLON.Vector3(-221, 72.23, -225),
    new BABYLON.Vector3(-222, 72.23, -225),
    new BABYLON.Vector3(-223, 72.23, -225),
    new BABYLON.Vector3(-224, 72.23, -225),
    new BABYLON.Vector3(-225, 72.23, -225),
    new BABYLON.Vector3(-226, 72.23, -225),
    new BABYLON.Vector3(-227, 72.23, -225),
    new BABYLON.Vector3(-228, 72.23, -225),
    new BABYLON.Vector3(-229, 72.23, -225),
    new BABYLON.Vector3(-230, 72.23, -225),

    // sixth group
    // e {x: -492.9230041503906, y: 71.88243948073163, z: -23.842891693115234}
    new BABYLON.Vector3(-496, 73.23, -23),
    new BABYLON.Vector3(-496, 73.23, -22),
    new BABYLON.Vector3(-496, 73.23, -21),
    new BABYLON.Vector3(-496, 73.23, -20),
    new BABYLON.Vector3(-496, 73.23, -19),
    new BABYLON.Vector3(-492, 73.23, -18),
    new BABYLON.Vector3(-496, 73.23, -16),
    new BABYLON.Vector3(-496, 73.23, -15),
    new BABYLON.Vector3(-492, 73.23, -13),
    new BABYLON.Vector3(-492, 73.23, -12),

    // e {x: -398.6725158691406, y: 72.62645803541913, z: 187.11956787109375}
    // seventh group

    new BABYLON.Vector3(-398, 73.23, 187),
    new BABYLON.Vector3(-396, 73.23, 190),
    new BABYLON.Vector3(-394, 73.23, 193),
    new BABYLON.Vector3(-392, 73.23, 196),
    new BABYLON.Vector3(-390, 72.53, 199),
    new BABYLON.Vector3(-388, 72.23, 202),
    new BABYLON.Vector3(-388, 71.23, 205),
    new BABYLON.Vector3(-388, 71.23, 208),
    new BABYLON.Vector3(-388, 71.23, 211),
    new BABYLON.Vector3(-388, 71.23, 213),

    // e {x: -86.47960662841797, y: 71.32195364088788, z: 416.4701843261719}
    // eighth group 
    new BABYLON.Vector3(-86, 72, 416),
    new BABYLON.Vector3(-84, 72, 416),
    new BABYLON.Vector3(-82, 72, 416),
    new BABYLON.Vector3(-80, 72, 416),
    new BABYLON.Vector3(-78, 72, 416),
    new BABYLON.Vector3(-76, 72, 414),
    new BABYLON.Vector3(-74, 72, 412),
    new BABYLON.Vector3(-72, 72, 410),
    new BABYLON.Vector3(-70, 72, 408),
    new BABYLON.Vector3(-68, 72, 406),

    // e {x: 162.05426025390625, y: 71.7837990388371, z: 308.0093078613281}
    // nineth group
    new BABYLON.Vector3(162, 72.5, 308),
    new BABYLON.Vector3(158, 73.5, 305),
    new BABYLON.Vector3(164, 73.5, 302),
    new BABYLON.Vector3(160, 74.5, 299),
    new BABYLON.Vector3(168, 74.9, 296),
    new BABYLON.Vector3(164, 74.9, 293),
    new BABYLON.Vector3(170, 74.9, 290),
    new BABYLON.Vector3(168, 74.5, 287),
    new BABYLON.Vector3(173, 74.2, 284),
    new BABYLON.Vector3(171, 74.2, 281)

];
// initial_car_pos=new BABYLON.Vector3(initial_bombs_pos.x-pos_bombs_fact*70, initial_bombs_pos.y-pos_bombs_fact*1.0+5, initial_bombs_pos.z+pos_bombs_fact*116)
// initial_car_pos = new BABYLON.Vector3(pos_car_fact * 70, 79, pos_car_fact * 25)
// initial_car_pos = new BABYLON.Vector3(162, 74, 308);
var bombExplosion = function (moveableObject, moveableObjectTorso, stayedObject, stayedObjectPlane, effect, positionInfo) {
    if (moveableObject.intersectsMesh(stayedObjectPlane)) {
        effect.then((set) => {
            set.systems.forEach(s => {
                s.worldOffset = positionInfo;
            });
            set.start();
        });
        bombFlag = 1;
        stayedObject.setEnabled(false);
        stayedObjectPlane.setEnabled(false);
    }
    if (bombFlag == 1) {
        if (bombCounter < 32 * 5) {
            moveableObjectTorso.addRotation(0, Math.PI / 32, 0);
            moveableObjectTorso.translate(new BABYLON.Vector3(0, 0, -1), 0.01, BABYLON.Space.LOCAL);
            bombCounter += 1;
        }
        else {
            bombFlag = 0;
            bombCounter = 0;
        }
    }
}

function coinGather(moveableObject, stayedObject, stayedObjectTorso, textBlock) { // here will be added textblock later
    if (moveableObject.intersectsMesh(stayedObject)) {

        gatheredCoins++;
        textBlock.text = new String(gatheredCoins);

        coinFlag = 0;

        coinCounter = 0;
        stayedObject.setEnabled(false);
        stayedObjectTorso.setEnabled(false);

    }

}

function speedTheCar(moveableObject, moveableObjectTorso, stayedObjectTorso) {
    if (moveableObject.intersectsMesh(stayedObjectTorso)) {
        // effect.then((set) => {
        //     set.systems.forEach(s => {
        //         s.worldOffset = positionInfo;
        //     });
        //     set.start();
        // });
        // add 1 to coin table 
        // speedFlag = 1;
        if (speedCounter < 5 * 32) {
            // stayedObjectTorso.addRotation(0, Math.PI / 2, 0);
            // moveableObjectTorso.translate(new BABYLON.Vector3(0, 0, -2), 0.08, BABYLON.Space.LOCAL);
            // chassisMesh.translate(new BABYLON.Vector3(0, 0, -2), 0.08, BABYLON.Space.LOCAL);

            speedCounter += 1;
        }
        else {
            speedFlag = 0;
            // stayedObject.setEnabled(false);
            // stayedObjectTorso.setEnabled(false);
            speedCounter = 0;
        }
    }

}

var positionExplosions = [];
var bombTorso;
var coinTorso;
var boxBomb;
var bombsTorsos = [];
var boxesBombs = [];

//speedy paltform
// var positionExplosions = [];
var platformTorso;
var platformPlane;
var platformsTorsos = [];
var platformsPlanes = [];

var numPlatforms = 7;
var mesheshTasksPlatforms = [];
var pos_Platforms_fact = 4;
var initial_Platforms_pos = new BABYLON.Vector3(-336.03118896484375 - 1, 72.03173147291913, 268.58819580078125);
var Platforms_positions = [new BABYLON.Vector3(initial_Platforms_pos.x, initial_Platforms_pos.y, initial_Platforms_pos.z),
new BABYLON.Vector3(-420.957275390625, 76.9, 129.4896240234375),
new BABYLON.Vector3(-398.8640441894531, 71.6, -191.5227508544922),
new BABYLON.Vector3(-233.5518341064453, 72.15, -221.46478271484375),
new BABYLON.Vector3(-59.789588928222656, 72.82, -208.4573974609375),
new BABYLON.Vector3(213.85012817382812 - 0.5, 71.97, 51.392662048339844),
new BABYLON.Vector3(-43.57901382446289, 73.5, 383.9021911621094)
]
var Platforms_Rotations = [
    new BABYLON.Vector3(5, 45, 2),
    new BABYLON.Vector3(-4, 0, -7.0),
    new BABYLON.Vector3(1, -110, 6.5),
    new BABYLON.Vector3(-3, -85, -5),
    new BABYLON.Vector3(4, -78, 1.5),
    new BABYLON.Vector3(-7, 170, -4.5),
    new BABYLON.Vector3(0, 125, -4)
]

initial_car_pos = new BABYLON.Vector3(-43.57901382446289, 75, 383.9021911621094)

window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');

    // var engine = new BABYLON.Engine(canvas, true);
    var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
    // engine.enableOfflineSupport = false; // Dont require a manifest file
    // var createScene0 = function () {
    //     var scene0 = new BABYLON.Scene(engine);
    //     scene0.clearColor = new BABYLON.Color3.White();
    //     scene0.autoClear = false;
    //     var camera = new BABYLON.ArcRotateCamera("arcCam",
    //         0,
    //         0,
    //         50.0, BABYLON.Vector3.Zero(), scene0);
    //     camera.attachControl(canvas, true);

    //     // var light = new BABYLON.PointLight("PointLight",new BABYLON.Vector3(
    //     // 0,0,0),scene);
    //     var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(100, 0, 0), scene0);

    //     light.parent = camera;
    //     light.intensity = 1.5;

    //     var bearbird = BABYLON.SceneLoader.ImportMesh("", "", "Models/bearbird.babylon", scene0,
    //         function (newMeshes) {
    //             camera.target = newMeshes[0];
    //             console.log(newMeshes[0]);
    //             newMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
    //         });
    //     var car = BABYLON.SceneLoader.ImportMesh("", "", "Models/Cars/Car1/B/Car1.babylon", scene0,
    //         function (newMeshes) {
    //             camera.target = newMeshes[0];
    //             newMeshes[0].position = new BABYLON.Vector3(2, 0, 0);
    //         });
    //     //  Models/Roads/Road10/B/
    //     //Models/Roads/Road11/B/
    //     return scene0;
    // }
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
        coinSign.leftInPixels = 45;
        coinSign.topInPixels = 15;
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
        var groundSize = 3000;
        //  car.position.y=1.5;

        // var ground = BABYLON.Mesh.CreateGround("ground1", { width: groundSize, height: groundSize }, scene);
        var ground = BABYLON.Mesh.CreateGround("ground1", groundSize, groundSize, 2, scene);

        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);//0.75, 1, 0.25);
        ground.material = groundMaterial;
        ground.position.y = -0;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
        // ground.rotate(BABYLON.Axis.X, Math.PI / 22, BABYLON.Space.WORLD);

        // var newMeshes = (await BABYLON.SceneLoader.ImportMeshAsync("", "Models/scenes/weirdShape.glb", "", scene)).meshes;

        //   Convert to physics object and position
        var assetsManagerCity = new BABYLON.AssetsManager(scene);
        // var meshTaskCity = assetsManagerCity.addMeshTask("Citymeshes", "", "", "Models/Environments/Env6/B/Env6.babylon");
        // var meshTaskCity = assetsManagerCity.addMeshTask("Citymeshes", "", "", "Models/scenes/terrain.glb");


        var meshTaskCity = assetsManagerCity.addMeshTask("Citymeshes", "", "", "Models/Environments/Env12/B/Env12.babylon");
        meshTaskCity.onSuccess = function (task) {
            // task.loadedMeshes[0].position = new BABYLON.Vector3(2, 0.05, 0);
            // console.log(task.loadedMeshes[0].position.x);
            var City_ = task.loadedMeshes[0];
        }

        /////////////////////////////// BOMBS /////////////////////////////////
        for (let ibomb = 0; ibomb < numBombs; ibomb++) {
            var meshTaskBomb = assetsManagerCity.addMeshTask("bombmeshes", "", "", "Models/bomb.babylon");
            mesheshTasksBombs.push(meshTaskBomb);
            mesheshTasksBombs[ibomb].onSuccess = function (task) {
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(4, 4, 4);
                task.loadedMeshes[0].addRotation(Math.PI / 6, 0, 0);
                // task.loadedMeshes[0].position = bombs_positions[ibomb]//new BABYLON.Vector3(3 * 70, 74, 3 * 40);
                positionExplosions[ibomb] = bombs_positions[ibomb];//new BABYLON.Vector3(3 * 70, 74, 3 * 40);
                bombTorso = task.loadedMeshes[0];
                var boxBomb = BABYLON.MeshBuilder.CreateGround("ground", { width: 1.7, height: 1.7 }, scene);
                boxBomb.position = bombs_positions[ibomb];
                bombTorso.parent = boxBomb;
                boxBomb.addRotation(-Math.PI / 6, 0, 0);
                boxBomb.addRotation(Math.PI / 2, 0, 0);
                boxBomb.isVisible = true;

                // boxBomb.parent = bombTorso;
                // boxBomb.isVisible = true;
                bombsTorsos.push(bombTorso);
                boxesBombs.push(boxBomb);
            }
        }


        for (let icoin = 0; icoin < numCoins; icoin++) {
            var meshTaskCoin = assetsManagerCity.addMeshTask("coinmeshes", "", "", "Models/coin.babylon");
            meshesTasksCoins.push(meshTaskCoin);
            meshTaskCoin.onSuccess = function (task) {
                // task.loadedMeshes[0].position = coinsPositions[icoin];
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(5, 5, 5);
                task.loadedMeshes[0].addRotation(Math.PI / 6, 0, 0);
                coinTorso = task.loadedMeshes[0];
                coinsTorsos.push(coinTorso);
                var coinPlane = BABYLON.MeshBuilder.CreateGround("ground", { width: 1, height: 1 }, scene);
                // coinPlane.addRotation(-Math.PI / 6, 0, 0);
                coinPlane.addRotation(Math.PI / 2, 0, 0);
                coinPlane.position = coinsPositions[icoin];

                coinTorso.parent = coinPlane;
                coinPlane.isVisible = true;
                coinsPlanes.push(coinPlane);

            }

        }
        //speedy platform
        for (let iplatform = 0; iplatform < numPlatforms; iplatform++) {
            var meshTaskPlatform = assetsManagerCity.addMeshTask("platformmeshes", "", "", "Models/speedy.babylon");
            mesheshTasksPlatforms.push(meshTaskPlatform);
            mesheshTasksPlatforms[iplatform].onSuccess = function (task) {

                task.loadedMeshes[0].position = Platforms_positions[iplatform];//new BABYLON.Vector3(0, 0.0, -25.5);
                task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
                task.loadedMeshes[0].addRotation(0, Math.PI, 0);
                task.loadedMeshes[0].addRotation(BABYLON.Tools.ToRadians(Platforms_Rotations[iplatform].x), BABYLON.Tools.ToRadians(Platforms_Rotations[iplatform].y), BABYLON.Tools.ToRadians(Platforms_Rotations[iplatform].z));
                var platformMaterial = new BABYLON.StandardMaterial("platformmat", scene);
                platformMaterial.emissiveTexture = new BABYLON.Texture("speedy.png", scene);
                platformTorso = task.loadedMeshes[0];
                platformTorso.material = platformMaterial;
                platformPlane.parent = platformTorso;
                platformsTorsos.push(platformTorso);
                platformsPlanes.push(platformPlane);
            }
        }

        var meshTaskBearBirdBuddy = assetsManagerCity.addMeshTask("bearbirdmeshes", "", "", "Models/bearbird.babylon");
        meshTaskBearBirdBuddy.onSuccess = function (task) {
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
        // var assetsManagerCar = new BABYLON.AssetsManager(scene);
        var meshTaskCar = assetsManagerCity.addMeshTask("carmeshes", "", "", "Models/Cars/Car11/B/Car11.babylon");
        meshTaskCar.onSuccess = function (task) {
            let cannon = true;
            let forceFactor = cannon ? 1 : 1500;
            carTorso = task.loadedMeshes.filter(q => q.name == "Car1")[0]
            Body_Box = task.loadedMeshes.filter(q => q.name == "Body_Box")[0];
            Body_Box.isVisible = true;
            wheelfrontLeft = task.loadedMeshes.filter(q => q.name == "Left_Wheel")[0]
            wheelbackLeft = task.loadedMeshes.filter(q => q.name == "Back_Left_Wheel")[0]
            wheelbackRight = task.loadedMeshes.filter(q => q.name == "Back_Right_Wheel")[0]
            wheelfrontRight = task.loadedMeshes.filter(q => q.name == "Right_Wheel")[0]
            ps_carTorso = task.loadedMeshes.filter(q => q.name == "Body_Box")[0]
            ps_wheelfrontLeft = task.loadedMeshes.filter(q => q.name == "Left_Wheel_Cylinder")[0];
            ps_wheelbackLeft = task.loadedMeshes.filter(q => q.name == "Back_Left_Wheel_Cylinder")[0];
            ps_wheelbackRight = task.loadedMeshes.filter(q => q.name == "Back_Right_Wheel_Cylinder")[0];;
            ps_wheelfrontRight = task.loadedMeshes.filter(q => q.name == "Right_Wheel_Cylinder")[0];
            // ps_wheelfrontLeft.setMotor(3 * forceFactor, 20 * forceFactor);
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
            carFrontier.position.z = -1.2;




            wheelMeshes2[FRONT_LEFT] = wheelMeshes[FRONT_LEFT] = wheelfrontLeft;
            wheelMeshes2[FRONT_RIGHT] = wheelMeshes[FRONT_RIGHT] = wheelfrontRight;
            wheelMeshes2[BACK_LEFT] = wheelMeshes[BACK_LEFT] = wheelbackLeft;
            wheelMeshes2[BACK_RIGHT] = wheelMeshes[BACK_RIGHT] = wheelbackRight;

            //wheelfrontLeft .position=new CANNON.Vec3(0,0,0);
            // wheelfrontRight.position=new CANNON.Vec3(0,0,0);
            // wheelbackLeft  .position=new CANNON.Vec3(0,0,0);
            // wheelbackRight .position=new CANNON.Vec3(0,0,0);

            //new CANNON.Vec3(axisWidth / 2, 0, -wheelDepthPosition)
        }

        var carFrontier = BABYLON.MeshBuilder.CreateSphere("carBox", { diameterX: 1.5, diameterY: 0.5, diameterZ: 0.5 }, scene);
        carFrontier.isVisible = true;

        var platformPlane = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
        platformPlane.isVisible = true;
        platformPlane.addRotation(Math.PI / 2, 0, 0);
        var explosion = BABYLON.ParticleHelper.CreateAsync("explosion", scene);



        assetsManagerCity.load();


        assetsManagerCity.onFinish = function (task) {
            //var makePhysicsground = makePhysicsObject(task[0].loadedMeshes, scene,1, true)
            //     // makePhysicsground.material = groundMaterial;

            task[0].loadedMeshes.forEach((m, i) => {
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0.9, restitution: 0.3 });
                //m.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);
            })
            var terraind = task[0].loadedMeshes[0];
            //camera.target = terraind;
            // terraind.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);
            //MeshImpostor
            var ticker = 0;

            let spheres = [];
            // var cube=BABYLON.SceneLoader.ImportMesh("", "scenes/", "cube.babylon", scene, function (newMeshes1){
            // var cube=BABYLON.SceneLoader.ImportMesh("", "Car6/B/", "Car6.babylon", scene, function (newMeshes1){

            scene.registerBeforeRender(function () {
                if (ticker++ % 60) return;

                let s = BABYLON.MeshBuilder.CreateBox("b", { diameter: 1 });
                s.position.y = 200;
                s.position.z = -150 + Math.random() * 200;
                s.position.x = -150 + Math.random() * 200;
                s.scaling = new BABYLON.Vector3(3, 3, 3);

                s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10 });

                //dispossingObjectd();
                // var tuple = Object.freeze({ sphere:sphere, time:new Date().getTime() })
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


            //var makePhysicsCar = makePhysicsObject(task[1].loadedMeshes, scene, 1, false)
            // makePhysicsCar.scaling = new BABYLON.Vector3(1, 1, 1);
            // makePhysicsCar.position.y = 100;
            // makePhysicsCar.position.x = 53;
            // makePhysicsCar.position.z = 40;
            // ps_carTorso.isVisible = false;

            createVehicle2(new BABYLON.Vector3(0, 0, 0), ZERO_QUATERNION, carTorso, scene);

            scene.registerAfterRender(function () {
                for (let ibomb = 0; ibomb < numBombs; ibomb++) {
                    bombsTorsos[ibomb].addRotation(0, Math.PI / 12, Math.PI / 12);
                    // bombExplosion(carFrontier, carTorso, bombTorso, boxBomb, explosion, positionExplosion);
                    bombExplosion(carFrontier, carTorso, bombsTorsos[ibomb], boxesBombs[ibomb], explosion, positionExplosions[ibomb]);
                }
                for (let icoin = 0; icoin < numCoins; icoin++) {
                    coinGather(carFrontier, coinsPlanes[icoin], coinsTorsos[icoin], coinText);
                    coinsTorsos[icoin].addRotation(0, Math.PI / 12, Math.PI / 12);
                    // coinsPlanes[icoin].addRotation(0, -Math.PI / 12, -Math.PI / 12);
                    coinsPlanes.rotation = new BABYLON.Vector3(0, 0, 0);

                }
                for (let iplatform = 0; iplatform < numPlatforms; iplatform++) {
                    speedTheCar(carFrontier, chassisMesh, platformsPlanes[iplatform]);//moveableObject, moveableObjectTorso, stayedObjectTorso)
                }

            });

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
                                startMotion2 = 1;
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

                        // } else if (actions.braking) {
                    } else if (actions.acceleration) {
                        if (speed > 1) {
                            breakingForce = maxBreakingForce;
                            direction = -1;
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

                    } else {
                        vehicleSteering = 0;
                        turningFlag = 3;
                    }
                }
                // if (actions.acceleration) {


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
                    vehicle.updateWheelTransform(i, false);
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
                chassisMesh.position.set(p.x(), p.y() + offsetcar - suspensionRestLength, p.z());
                chassisMesh.rotationQuaternion.set(q.x(), q.y(), q.z(), q.w());
                //chassisMesh.rotate(BABYLON.Axis.X, Math.PI);

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
        var body_size = Body_Box.getBoundingInfo().boundingBox.extendSizeWorld;
        Body_Box.isVisible = false;
        // cardimensions(chassisWidth ,chassisHeight,chassisLength,massVehicle  ,1);
        massVehicle = 50;
        cardimensions(2 * body_size.x, 2 * body_size.y, 2 * body_size.z, massVehicle, 1);
        //body
        var physicsWorld = scene.getPhysicsEngine().getPhysicsPlugin().world;
        var geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5));
        var transform = new Ammo.btTransform();
        transform.setIdentity();

        transform.setOrigin(new Ammo.btVector3(initial_car_pos.x, initial_car_pos.y, initial_car_pos.z));//53, 100, 40));//59, 80, 40
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        var motionState = new Ammo.btDefaultMotionState(transform);
        var localInertia = new Ammo.btVector3(0, 0, 0);
        geometry.calculateLocalInertia(massVehicle, localInertia);

        //chassisMesh = createChassisMesh(chassisWidth, chassisHeight, chassisLength, scene);

        var massOffset = new Ammo.btVector3(0, 0.1 + chassisWidth * 0.0 - 0 * wheel_size_FRONT_LEFT.y / 2, 0);
        var transform2 = new Ammo.btTransform();
        transform2.setIdentity();
        transform2.setOrigin(massOffset);
        var compound = new Ammo.btCompoundShape();
        compound.addChildShape(transform2, geometry);

        var body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, compound, localInertia));//own_mesh.physicsImpostor.physicsBody;// new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, compound, localInertia));
        body.setActivationState(4);

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

            // wheelMeshes[index] = createWheelMesh(radius, width, scene);
            //wheelMeshes[index].position=new CANNON.Vec3(0, 0, 0);
            // wheelMeshes[index] .rotate(BABYLON.Axis.Z, Math.PI / 2);

        }
        // var wheel_size_FRONT_LEFT =  wheelMeshes[FRONT_LEFT].getBoundingInfo().boundingBox .extendSizeWorld;
        // var wheel_size_FRONT_RIGHT = wheelMeshes[FRONT_RIGHT].getBoundingInfo().boundingBox.extendSizeWorld;
        // var wheel_size_BACK_LEFT =   wheelMeshes[BACK_LEFT].getBoundingInfo().boundingBox  .extendSizeWorld;
        // var wheel_size_BACK_RIGHT =  wheelMeshes[BACK_RIGHT].getBoundingInfo().boundingBox .extendSizeWorld;


        // var wheel_position_FRONT_LEFT = wheelMeshes[FRONT_LEFT].getBoundingInfo().boundingBox .centerWorld;
        // var wheel_position_FRONT_RIGHT= wheelMeshes[FRONT_RIGHT].getBoundingInfo().boundingBox.centerWorld;
        // var wheel_position_BACK_LEFT  = wheelMeshes[BACK_LEFT].getBoundingInfo().boundingBox  .centerWorld;
        // var wheel_position_BACK_RIGHT = wheelMeshes[BACK_RIGHT].getBoundingInfo().boundingBox .centerWorld;
        var wheel_position_FRONT_LEFT = wheelMeshes[FRONT_LEFT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_FRONT_RIGHT = wheelMeshes[FRONT_RIGHT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_BACK_LEFT = wheelMeshes[BACK_LEFT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_BACK_RIGHT = wheelMeshes[BACK_RIGHT].getBoundingInfo().boundingBox.centerWorld;


        offsetcar = - 1 * ps_carTorso.getBoundingInfo().boundingBox.extendSizeWorld.y / 1;
        //wheelMeshes[FRONT_LEFT].getBoundingInfo().boundingBox.extendSize.y/2;

        //addWheel(true, new Ammo.btVector3( wheel_position_FRONT_LEFT.x  * 1, 1 * wheel_position_FRONT_LEFT.y / 1 + offsetcar   , 1 * wheel_position_FRONT_LEFT.z), wheel_size_FRONT_LEFT.y, wheel_size_FRONT_LEFT.z, FRONT_LEFT);

        //addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, 1 * wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
        //addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, 1 * wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
        //addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, 1 * wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
        //addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, 1 * wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);
        addWheel(true, new Ammo.btVector3(wheel_position_FRONT_LEFT.x * 1, 1 * wheel_position_FRONT_LEFT.y / 1 + offsetcar, 1 * wheel_position_FRONT_LEFT.z), wheel_size_FRONT_LEFT.y, wheel_size_FRONT_LEFT.z, FRONT_LEFT);
        addWheel(true, new Ammo.btVector3(wheel_position_FRONT_RIGHT.x * 1, 1 * wheel_position_FRONT_RIGHT.y / 1 + offsetcar, 1 * wheel_position_FRONT_RIGHT.z), wheel_size_FRONT_RIGHT.y, wheel_size_FRONT_RIGHT.z, FRONT_RIGHT);
        addWheel(false, new Ammo.btVector3(wheel_position_BACK_LEFT.x * 1, 1 * wheel_position_BACK_LEFT.y / 1 + offsetcar, 1 * wheel_position_BACK_LEFT.z), wheel_size_BACK_LEFT.y, wheel_size_BACK_LEFT.z, BACK_LEFT);
        addWheel(false, new Ammo.btVector3(wheel_position_BACK_RIGHT.x * 1, 1 * wheel_position_BACK_RIGHT.y / 1 + offsetcar, 1 * wheel_position_BACK_RIGHT.z), wheel_size_BACK_RIGHT.y, wheel_size_BACK_RIGHT.z, BACK_RIGHT);

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
        //var mesh = new BABYLON.MeshBuilder.CreateBox("wheel", {width:.82, height:.82, depth:.82}, scene);
        // var mesh = new BABYLON.MeshBuilder.CreateCylinder("Wheel", { diameter: 1, height: 0.5, tessellation: 24 }, scene);
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
