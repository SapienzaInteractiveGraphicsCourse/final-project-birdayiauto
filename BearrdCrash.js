"use strict";

var canvas;
var gl;
var program;
var engine;

var startPressed = false;

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

// bearbird body parts
var bearbirdTorso;
var shoulderLeft;
var shoulderRight;
var rightBone;
var leftBone;
var rightKnee;
var leftKnee;

// actions
var keysActions = {
    "KeyW": 'acceleration',
    "KeyS": 'braking',
    "KeyA": 'left',
    "KeyD": 'right'
};


var ZERO_QUATERNION = new BABYLON.Quaternion();
var vehicle, chassisMesh, redMaterial, blueMaterial, greenMaterial, blackMaterial;
var numtries = 0;
var falls_counter = 0;

//flags

var gameStarted = true;
var dayornight = true;
var onOrOff = false;
var startCountdownTimer = true;

var soundOn = false;
var startPressed = false;
var activateP = false;
var makePause = false;
var pauseActivated = false;
var notStart = false;
var vehicleReady = false;
var sky1 = false;
var startMotion = false;
var startMotion2 = false;
var finishedTruly = false;
var gameWinning = false;
var gameover_on = false;
var activateTimer = false;
var bombFlag = false;


var speedFlag = 0;  // used as multiplier for speeding the vehicle or not
var turningFlag = 0; // takes 3 values for 3 scenarios -> turn left, turn right, do not turn
var checkPos = 0; // take 2 values which checks the route of the car in order to prevent cheating
var direction = 0; // take 2 values in terms of direction of vehicle 1 and -1

// counters
var speedCounter = 0;
var bombCounter = 0;
var coinCounter = 0;
var gatheredCoins = 0;
var collectCoins = 0;


// car properties
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
var pause_car_Pos;//= new BABYLON.Vector3(pos_car_fact * 70, 82, pos_car_fact * 40);
var pause_car_Rot;//= new BABYLON.Vector3(pos_car_fact * 70, 82, pos_car_fact * 40);
var local_pause = false;//true;//false;
var begginingpause=true;
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
var rightFrontAngle = 0;


var initial_car_pos = new BABYLON.Vector3(-490.2470703125, 80, 20.43869018554687);
var startline_pos = new BABYLON.Vector3(-486.2470703125, 75.4, 25.43869018554687);

//sky
var skybox;
var skyboxMaterial;
var skyname;
//music
var music;
var music2;
var music3;
var music4;
var music5;
var music6;
//scene
var scene = null;

var positionExplosions = [];

///////////////////////////////////////// USER INTERFACE VARIABLES  /////////////////////////////////////////////////
// timer data
var jinit0 = 480;//253;
var currentTime = jinit0;
var printedTime = 0;
var counterTimer = Math.floor(currentTime / 60);
var previousCoin;
var heightRatio = 0.45;
var difficultyRatio = 0;

// buttons click check
var click = 0;
var clickSound = 0;

////////////////////////////////////////// OBSTACLES AND REWARDS ////////////////////////////////////////////////////
//bombs
var numBombs = 16;
var pos_bombs_fact = 3;
var intensityValue = 1;
var initial_bombs_pos = new BABYLON.Vector3(pos_car_fact * 70, 74.5, pos_car_fact * 25);
var meshTasksBombs = [];
var bombTorsos = [];
var bombPlanes = [];
var intersectionBombs = [];


var bomb_positions = [
    new BABYLON.Vector3(initial_bombs_pos.x, initial_bombs_pos.y - pos_bombs_fact * 0.5, initial_bombs_pos.z),
    new BABYLON.Vector3(initial_bombs_pos.x + 10, initial_bombs_pos.y - pos_bombs_fact * 0.7, initial_bombs_pos.z + pos_bombs_fact * 30),
    new BABYLON.Vector3(initial_bombs_pos.x + 10, initial_bombs_pos.y - pos_bombs_fact * 0.7, initial_bombs_pos.z + pos_bombs_fact * 43),
    new BABYLON.Vector3(initial_bombs_pos.x - pos_bombs_fact * 36, initial_bombs_pos.y - pos_bombs_fact * 0.35, initial_bombs_pos.z + pos_bombs_fact * 84),
    new BABYLON.Vector3(initial_bombs_pos.x - pos_bombs_fact * 70, initial_bombs_pos.y - pos_bombs_fact * 0.85, initial_bombs_pos.z + pos_bombs_fact * 116),
    new BABYLON.Vector3(-88, 71.5, 417),
    new BABYLON.Vector3(-158.31759643554688, 71.2, 392.5709228515625),
    new BABYLON.Vector3(-289.6668701171875, 71.5, 366.0986022949219),
    new BABYLON.Vector3(-379.8580322265625, 70, 241.9297332763672),
    new BABYLON.Vector3(-430.86285400390625, 77.3, 114.7979507446289),//77.3//
    new BABYLON.Vector3(-493.0850524902344, 76.8, 4.587120056152344),
    new BABYLON.Vector3(-395.86175537109375, 73.3, -146.88792419433594),
    new BABYLON.Vector3(-283.9041442871094, 69.3, -245.26821899414062),
    new BABYLON.Vector3(-83.41072845458984, 73.6, -207.04055786132812),
    new BABYLON.Vector3(37.76666259765625, 71.3, -183.37867736816406),
    new BABYLON.Vector3(139.16384887695312, 72.1, -107.34320831298828)
]



var numCoins = 80;
var coinTorsos = [];
var coinPlanes = [];
var meshTasksCoins = [];
var intersectionCoins = [];

var coinPositions = [
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
    new BABYLON.Vector3(179 - 1, 73.1 + 1, -9 - 83),
    new BABYLON.Vector3(181 - 1, 73.3 + 1, -9 - 86),
    new BABYLON.Vector3(183 - 1, 74.1 + 1, -9 - 89),
    new BABYLON.Vector3(185 - 1, 73.1 + 1, -9 - 92),
    new BABYLON.Vector3(187 - 1, 73.3 + 1, -9 - 95),
    new BABYLON.Vector3(188 - 1, 74.1 - 1, -9 - 98),
    new BABYLON.Vector3(187 - 1, 74.3 - 1, -9 - 101),
    new BABYLON.Vector3(187 - 1, 74.5 - 1, -9 - 104),
    new BABYLON.Vector3(187 - 1, 74.3 - 1, -9 - 107),
    new BABYLON.Vector3(187 - 1, 74.5 - 1.5, -9 - 109),
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
    new BABYLON.Vector3(-221, 70.83, -225),
    new BABYLON.Vector3(-222, 70.83, -225),
    new BABYLON.Vector3(-223, 70.83, -225),
    new BABYLON.Vector3(-224, 70.83, -225),
    new BABYLON.Vector3(-225, 70.83, -225),
    new BABYLON.Vector3(-226, 70.83, -225),
    new BABYLON.Vector3(-227, 70.83, -225),
    new BABYLON.Vector3(-228, 70.83, -225),
    new BABYLON.Vector3(-229, 70.83, -225),
    new BABYLON.Vector3(-230, 70.83, -225),

    // sixth group
    // e {x: -492.9230041503906, y: 71.88243948073163, z: -23.842891693115234}
    new BABYLON.Vector3(-496 + 2, 74.37, -23 - 10),
    new BABYLON.Vector3(-496 + 2, 74.37, -22 - 10),
    new BABYLON.Vector3(-496 + 2, 74.37, -21 - 10),
    new BABYLON.Vector3(-496 + 2, 74.37, -20 - 10),
    new BABYLON.Vector3(-496 + 2, 74.37, -19 - 10),
    new BABYLON.Vector3(-494 + 2, 74.37, -18 - 10),
    new BABYLON.Vector3(-496 + 2, 74.37, -16 - 10),
    new BABYLON.Vector3(-496 + 2, 74.37, -15 - 10),
    new BABYLON.Vector3(-494 + 2, 74.37, -13 - 10),
    new BABYLON.Vector3(-494 + 2, 74.37, -12 - 10),

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
//e {x: -234.41542053222656, y: 70.37197958082929, z: -223.41043090820312}
var Coins_Rotations = [
    // First Group
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    // Second Group
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),

    // Third Group
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    // e {x: -21.2725830078125, y: 71.23190389723554, z: -210.91212463378906}
    //fourth group
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),

    // fifth gtroup
    // e {x: -221.45681762695312, y: 71.91479574293867, z: -225.51959228515625}
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),

    // sixth group
    // e {x: -492.9230041503906, y: 71.88243948073163, z: -23.842891693115234}
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),

    // e {x: -398.6725158691406, y: 72.62645803541913, z: 187.11956787109375}
    // seventh group

    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),

    // e {x: -86.47960662841797, y: 71.32195364088788, z: 416.4701843261719}
    // eighth group 
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),

    // e {x: 162.05426025390625, y: 71.7837990388371, z: 308.0093078613281}
    // nineth group
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 0)
]


var numPlatforms = 7;
var pos_Platforms_fact = 4;
var platformTorsos = [];
var platformPlanes = [];
var meshTasksPlatforms = [];
var initial_Platforms_pos = new BABYLON.Vector3(-336.03118896484375 - 1, 72.03173147291913, 268.58819580078125);
var Platforms_positions = [
    new BABYLON.Vector3(initial_Platforms_pos.x, initial_Platforms_pos.y, initial_Platforms_pos.z),
    new BABYLON.Vector3(-420.957275390625, 76.95, 129.4896240234375),
    new BABYLON.Vector3(-398.8640441894531, 71.6, -191.5227508544922),
    new BABYLON.Vector3(-233.5518341064453, 70.45, -221.46478271484375),
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

var bombExplosion = function (moveableObject, moveableObject2, moveableObjectTorso, stayedObject, stayedObjectPlane, effect, positionInfo, intersectionInfo) {
    if ((moveableObject.intersectsMesh(stayedObjectPlane) || moveableObject2.intersectsMesh(stayedObjectPlane)) && intersectionInfo) {
        effect.then((set) => {
            set.systems.forEach(s => {
                s.worldOffset = positionInfo;
            });
            set.start();
        });
        for (let ibomb = 0; ibomb < numBombs; ibomb++) {
            if (stayedObject == bombTorsos[ibomb]) {
                intersectionBombs[ibomb] = false;
            }
        }
        bombFlag = true;
        stayedObject.dispose();
        stayedObjectPlane.dispose();
        if (soundOn) {
            music3.play();
        }
    }
}


function coinGather(moveableObject, moveableObject2, stayedObject, stayedObjectTorso, textBlock, intersectionInfoCoins) { // here will be added textblock later
    if ((moveableObject.intersectsMesh(stayedObject) || moveableObject2.intersectsMesh(stayedObject)) && intersectionInfoCoins) {
        if (soundOn) {
            music6.play();
        }
        if (previousCoin != stayedObject) {
            previousCoin = stayedObject;
            gatheredCoins++;
            textBlock.text = new String(gatheredCoins);
        }
        for (let icoin = 0; icoin < numCoins; icoin++) {
            if (stayedObject == coinPlanes[icoin]) {
                intersectionCoins[icoin] = false;
            }
        }

        collectCoins++;
        if (collectCoins == 0) {
            previousCoin = stayedObject;
        }
        stayedObject.dispose();
        stayedObjectTorso.dispose();

    }

}

function speedTheCar(moveableObject, moveableObjectTorso, stayedObjectTorso) {
    if (moveableObject.intersectsMesh(stayedObjectTorso)) {
        speedFlag = 1;
        if (soundOn) {
            music5.play();

        }
    }

    if (speedFlag == 1) {
        if (speedCounter < 20 * 32) {
            speedCounter += 1;
            speedFlag = 1;
        }
        else {
            speedCounter = 0;
            speedFlag = 0;
        }
    }
}


function checkRoots(moveableObject, checkPos1, checkPos2) {
    if (moveableObject.intersectsMesh(checkPos1)) {
        checkPos = 1;
    }
    if (checkPos == 1 && moveableObject.intersectsMesh(checkPos2)) {
        checkPos = 2;
    }

}
function finishLineChecker(moveableObject, finishLine) {
    if (checkPos == 2 && moveableObject.intersectsMesh(finishLine)) {
        finishedTruly = true;
    }
}
var buttonBackHelp;
var helpInstructions;
var buttonBackSettings;
var buttonSound;
var buttonStart;
var buttonSettings;
var sliderLight;
var buttonDayOrNight;
var sliderDifficulty;
var sliderHeight;
var buttonHelp;
var soundText;
var moonIcon;
var sunIcon;
var soundIcon;
var soundOnIcon;
var soundOffIcon;
var buttonNight = true;
var clicked = false;
var clickedDay = false;
var dayText;
var dayIcon;
var numberOfspheres = Math.floor(100 * difficultyRatio);
var menuData = function (scene, pauseFlag) {
    var advancedTextureMenu;
    var advancedTextureHelp;
    var advancedTextureSettings;
    advancedTextureMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var tableMenu = new BABYLON.GUI.Rectangle();
    tableMenu.width = "820px";
    tableMenu.height = "150px";
    tableMenu.cornerRadius = 10;
    // tableMenu.color = "Blue";
    // tableMenu.thickness = 10;
    // tableMenu.background = "Purple";
    tableMenu.leftInPixels = -25;




    if (pauseFlag) {
        buttonStart = BABYLON.GUI.Button.CreateSimpleButton("butStart", "Resume");;
        notStart = true;
    }
    else {
        buttonStart = BABYLON.GUI.Button.CreateSimpleButton("butStart", "Play");;
        gameStarted = false;
    }
    buttonStart.width = "200px"
    buttonStart.height = "80px";
    buttonStart.color = "red";
    buttonStart.cornerRadius = 20;
    buttonStart.thickness = 5;
    buttonStart.background = "yellow";
    buttonStart.fontSize = 40;
    buttonStart.fontStyle = "bold";
    buttonStart.leftInPixels = -260;
    buttonStart.onPointerUpObservable.add(function () {
        startPressed = true;
        activateP = true;
        advancedTextureMenu.dispose();
        makePause = true;
        if (notStart) {
            startMotion = true;
            //local_pause=true;
        }


    });

    buttonSettings = BABYLON.GUI.Button.CreateSimpleButton("butSettings", "Settings");
    buttonSettings.width = "200px";
    buttonSettings.height = "80px";
    buttonSettings.color = "red";
    buttonSettings.fontSize = 40;
    buttonSettings.fontStyle = "bold";
    buttonSettings.thickness = 5;
    buttonSettings.cornerRadius = 20;
    buttonSettings.background = "yellow";
    buttonSettings.leftInPixels = -20;
    buttonSettings.onPointerUpObservable.add(function () {
        advancedTextureMenu.dispose();
        advancedTextureSettings = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        buttonBackSettings = BABYLON.GUI.Button.CreateSimpleButton("buttonBackSettings", "Back");

        buttonSound = BABYLON.GUI.Button.CreateSimpleButton("buttonSound", soundText);
        buttonSound.width = "150px";
        buttonSound.height = "40px";
        buttonSound.color = "red";
        buttonSound.cornerRadius = 20;
        buttonSound.thickness = 5;
        buttonSound.background = "yellow";
        buttonSound.fontStyle = "bold";
        buttonSound.fontSize = 25;
        buttonSound.leftInPixels = 240;
        buttonSound.topInPixels = 43;

        soundOffIcon = new BABYLON.GUI.Image("", "soundOff.png");
        soundOffIcon.width = "60px";
        soundOffIcon.height = "60px";
        soundOffIcon.leftInPixels = 90;
        soundOffIcon.topInPixels = 40;

        soundOnIcon = new BABYLON.GUI.Image("", "soundOn.png");
        soundOnIcon.width = "60px";
        soundOnIcon.height = "60px";
        soundOnIcon.leftInPixels = 380;
        soundOnIcon.topInPixels = 40;

        if (clickSound == 0) {
            advancedTextureSettings.addControl(soundOffIcon)
        }
        else {
            if (clicked == false) {
                if (soundIcon == "off")
                    advancedTextureSettings.addControl(soundOffIcon)
                else {
                    advancedTextureSettings.addControl(soundOnIcon)
                }
            }

        }


        buttonSound.onPointerUpObservable.add(function () {
            clicked = true

            if (clickSound == 0) {
                soundOnIcon.dispose()
                advancedTextureSettings.addControl(soundOffIcon)

                clickSound = 1;
            }
            if (clickSound == 2) {
                clickSound = 1
                buttonSound.textBlock.text = "On";
                onOrOff = true;
                music.pause();
                music2.pause();
                soundOn = false;

                advancedTextureSettings.addControl(soundOffIcon);
                soundOnIcon.dispose();
            }
            else if (clickSound == 1) {
                clickSound = 2
                buttonSound.textBlock.text = "Off";
                onOrOff = false;
                music.play();
                music2.play();
                soundOn = true;
                BABYLON.Engine.audioEngine.unlock();
                advancedTextureSettings.addControl(soundOnIcon);

                soundOffIcon.dispose();
            }
        });

        sliderLight = new BABYLON.GUI.Slider();
        sliderLight.minimum = 0;
        sliderLight.maximum = 2;
        sliderLight.value = intensityValue;
        sliderLight.height = "15px";
        sliderLight.width = "220px";
        sliderLight.background = "yellow";
        sliderLight.leftInPixels = 230;
        sliderLight.topInPixels = -35;
        sliderLight.onValueChangedObservable.add(function (value) {
            intensityValue = value;
        });

        buttonDayOrNight = BABYLON.GUI.Button.CreateSimpleButton("butDayOrNight", dayText);
        buttonDayOrNight.width = "150px";
        buttonDayOrNight.height = "40px";
        buttonDayOrNight.color = "red";
        buttonDayOrNight.cornerRadius = 20;
        buttonDayOrNight.fontSize = 25;
        buttonDayOrNight.fontStyle = "bold";
        buttonDayOrNight.thickness = 5;
        buttonDayOrNight.background = "yellow";
        buttonDayOrNight.leftInPixels = 240;
        buttonDayOrNight.topInPixels = 130;


        sunIcon = new BABYLON.GUI.Image("", "sun.png");
        sunIcon.width = "80px";
        sunIcon.height = "80px";
        sunIcon.leftInPixels = 90;
        sunIcon.topInPixels = 130;

        moonIcon = new BABYLON.GUI.Image("", "moon.png");
        moonIcon.width = "60px";
        moonIcon.height = "60px";
        moonIcon.leftInPixels = 380;
        moonIcon.topInPixels = 130;


        if (click == 0) {
            advancedTextureSettings.addControl(sunIcon)
        }
        else {
            if (clickedDay == false) {
                if (dayIcon == "moon")
                    advancedTextureSettings.addControl(moonIcon)
                else {
                    advancedTextureSettings.addControl(sunIcon)
                }
            }

        }


        buttonDayOrNight.onPointerUpObservable.add(function () {
            clickedDay = true;
            if (click == 0) {
                advancedTextureSettings.addControl(sunIcon)
                moonIcon.dispose()
                click = 1;
            }
            if (click == 2) {
                click = 1;
                buttonDayOrNight.textBlock.text = "Night";
                dayornight = false;
                skyname = dayornight ? "skybox2" : "skybox";

                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/" + skyname, scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.disableLighting = true;
                skybox.material = skyboxMaterial;
                advancedTextureSettings.addControl(sunIcon);
                moonIcon.dispose();


            }
            else {
                click = 2;
                buttonDayOrNight.textBlock.text = "Day";
                dayornight = true;
                skyname = dayornight ? "skybox2" : "skybox";

                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/" + skyname, scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.disableLighting = true;
                skybox.material = skyboxMaterial;
                advancedTextureSettings.addControl(moonIcon);
                sunIcon.dispose();
            }
        });

        sliderDifficulty = new BABYLON.GUI.Slider("butDifficulty", "Hard");
        sliderDifficulty.width = "220px";
        sliderDifficulty.height = "15px";
        sliderDifficulty.minimum = 0.0;
        sliderDifficulty.maximum = 1;
        sliderDifficulty.value = difficultyRatio;
        sliderDifficulty.leftInPixels = 230;
        sliderDifficulty.topInPixels = -130;
        if (startPressed) {
            sliderDifficulty.isEnabled = false;
            sliderDifficulty.background = "red";
        }
        else {
            sliderDifficulty.isEnabled = true;
            sliderDifficulty.background = "yellow";
            sliderDifficulty.onValueChangedObservable.add(function (value) {
                difficultyRatio = value;
            });
        }





        sliderHeight = new BABYLON.GUI.Slider();
        sliderHeight.minimum = 0.1;
        sliderHeight.maximum = 0.5;
        sliderHeight.value = heightRatio;
        sliderHeight.height = "15px";
        sliderHeight.width = "220px";
        sliderHeight.leftInPixels = 230;
        sliderHeight.topInPixels = 210;
        sliderHeight.background = "yellow";

        sliderHeight.onValueChangedObservable.add(function (value) {
            heightRatio = value;
        });

        buttonBackSettings.width = "150px";
        buttonBackSettings.height = "40px";
        buttonBackSettings.color = "red";
        buttonBackSettings.cornerRadius = 20;
        buttonBackSettings.fontStyle = "bold";
        buttonBackSettings.fontSize = 25;
        buttonBackSettings.thickness = 5;
        buttonBackSettings.background = "yellow";
        buttonBackSettings.leftInPixels = -220;
        buttonBackSettings.topInPixels = -200;


        var settingsInstructions = new BABYLON.GUI.Image("", "Settings.png");
        settingsInstructions.width = "800px";
        settingsInstructions.height = "500px";
        settingsInstructions.verticalAlignment = 2;
        settingsInstructions.horizontalAlignment = 2;
        settingsInstructions.leftInPixels = 45;
        settingsInstructions.topInPixels = 15;
        advancedTextureSettings.addControl(settingsInstructions);
        advancedTextureSettings.addControl(buttonBackSettings);
        advancedTextureSettings.addControl(sliderLight);
        advancedTextureSettings.addControl(sliderHeight);
        advancedTextureSettings.addControl(buttonDayOrNight);
        advancedTextureSettings.addControl(buttonSound);
        advancedTextureSettings.addControl(sliderDifficulty);

        // advancedTextureSettings.addControl(sunIcon);


        buttonBackSettings.onPointerUpObservable.add(function () {
            menuData(scene, pauseFlag);
            clicked = false;
            clickedDay = false;
            advancedTextureSettings.dispose();
        });
    });

    buttonHelp = BABYLON.GUI.Button.CreateSimpleButton("butHelp", "Help");;
    buttonHelp.width = "200px"
    buttonHelp.height = "80px";
    buttonHelp.color = "red";
    buttonHelp.fontSize = 40;
    buttonHelp.fontStyle = "bold";
    buttonHelp.thickness = 5;
    buttonHelp.cornerRadius = 20;
    buttonHelp.background = "yellow";
    buttonHelp.leftInPixels = 220;
    buttonHelp.onPointerUpObservable.add(function () {
        advancedTextureMenu.dispose();
        advancedTextureHelp = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        buttonBackHelp = BABYLON.GUI.Button.CreateSimpleButton("buttonBackHelp", "Back");
        buttonBackHelp.width = "150px"
        buttonBackHelp.height = "40px";
        buttonBackHelp.fontSize = 25;
        buttonBackHelp.fontStyle = "bold";
        buttonBackHelp.thickness = 5;
        buttonBackHelp.color = "red";
        buttonBackHelp.cornerRadius = 20;
        buttonBackHelp.background = "yellow";
        buttonBackHelp.leftInPixels = -260;
        buttonBackHelp.topInPixels = -240;

        helpInstructions = new BABYLON.GUI.Image("", "helpInstructions2.png");
        helpInstructions.width = "800px";
        helpInstructions.height = "600px";
        helpInstructions.verticalAlignment = 2;
        helpInstructions.horizontalAlignment = 2;
        helpInstructions.leftInPixels = 45;
        helpInstructions.topInPixels = 15;
        advancedTextureHelp.addControl(helpInstructions);
        advancedTextureHelp.addControl(buttonBackHelp);
        buttonBackHelp.onPointerUpObservable.add(function () {
            menuData(scene, pauseFlag);
            advancedTextureHelp.dispose();
        });
    });




    advancedTextureMenu.addControl(tableMenu);
    advancedTextureMenu.addControl(buttonHelp);
    advancedTextureMenu.addControl(buttonSettings);
    advancedTextureMenu.addControl(buttonStart);
}


window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    gameover_on = false;
    var engine = null;

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

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(100, 0, 0), scene);
        light.parent = camera;
        // light.intensity = 0.5;

        var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);//-1, -2, -1), scene);
        light2.position = new BABYLON.Vector3(-0, 340, -0);
        // light2.intensity = 0.5;
        // var light = light2;
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light2, true);
        //shadowGenerator.setDarkness(1.0);
        // shadowGenerator.useExponentialShadowMap = true;
        // Shadows
        // var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 200, 40, scene);
        lightSphere.position = light2.position;
        lightSphere.material = new BABYLON.StandardMaterial("light", scene);
        lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);




        music = new BABYLON.Sound("River", "sounds/river-1.wav", scene, null, { loop: true, autoplay: false, volume: 0.2 });
        music2 = new BABYLON.Sound("HighRiser", "sounds/HighRiser.mp3", scene, null, { loop: true, autoplay: false });
        music3 = new BABYLON.Sound("HighRiser", "sounds/Explosion_1.mp3", scene, null, { loop: false, autoplay: false, volume: 1 });
        music4 = new BABYLON.Sound("HighRiser", "sounds/Car_Alarm.mp3", scene, null, { loop: false, autoplay: false, volume: 1 });
        music5 = new BABYLON.Sound("HighRiser", "sounds/high_speed.wav", scene, null, { loop: false, autoplay: false, volume: 1 });
        music6 = new BABYLON.Sound("HighRiser", "sounds/coins1.mp3", scene, null, { loop: false, autoplay: false, volume: 1 });
        // Skybox
        skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
        skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyname = dayornight ? "skybox" : "skybox2";

        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/" + skyname, scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        menuData(scene, pauseActivated);
        light.intensity = intensityValue;

        canvas.height = heightRatio * canvas.width;


        // Game Timer
        var gameTimer = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var tableTimer = new BABYLON.GUI.Rectangle();
        var timerClock = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var clockPic = new BABYLON.GUI.Image("", "clock.png");
        clockPic.width = "70px";
        clockPic.height = "70px";
        clockPic.verticalAlignment = 0;
        // clockPic.horizontalAlignment = 1;
        clockPic.leftInPixels = 600;
        clockPic.topInPixels = 5;
        timerClock.addControl(clockPic);
        tableTimer.width = "100px";
        tableTimer.height = "50px";
        tableTimer.cornerRadius = 10;
        tableTimer.color = "red";
        tableTimer.thickness = 10;
        tableTimer.background = "yellow";
        // tableTimer.horizontalAlignment = 1;
        tableTimer.verticalAlignment = 0;
        tableTimer.leftInPixels = 680;
        tableTimer.topInPixels = 5;//-300;


        gameTimer.addControl(tableTimer);
        var textTimer = new BABYLON.GUI.TextBlock();
        var timerSetup = currentTime - counterTimer * 60;
        if (timerSetup < 10) {

            textTimer.text = "0" + counterTimer + ":" + "0" + timerSetup;
        }
        else {
            textTimer.text = "0" + counterTimer + ":" + timerSetup;

        }
        textTimer.color = "red";
        textTimer.fontSize = 25;
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
        coinContainer.width = "50px";
        coinContainer.height = "50px";
        coinContainer.cornerRadius = 20;
        coinContainer.thickness = 5;
        coinContainer.color = "red";
        coinContainer.background = "yellow";
        coinContainer.horizontalAlignment = 0;
        coinContainer.verticalAlignment = 0;
        coinContainer.topInPixels = 10;
        coinContainer.leftInPixels = 100;
        coinTable.addControl(coinContainer);
        var coinText = new BABYLON.GUI.TextBlock();
        coinText.text = "0";
        coinText.color = "red";
        coinText.fontStyle = "bold";
        coinText.fontSize = 25;
        coinText.width = "200px";
        coinContainer.addControl(coinText);

        var coinSignTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var coinSign = new BABYLON.GUI.Image("", "coin.png");
        coinSign.width = "30px";
        coinSign.height = "30px";
        coinSign.verticalAlignment = 0;
        coinSign.horizontalAlignment = 0;
        coinSign.leftInPixels = 60;
        coinSign.topInPixels = 20;
        coinSignTexture.addControl(coinSign);


        var gameOverTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var gameOverPic = new BABYLON.GUI.Image("", "gameOver.png");
        gameOverPic.width = "800px";
        gameOverPic.height = "800px";

        var gameWinningTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var gameWinningPic = new BABYLON.GUI.Image("", "gameWinning.png");
        gameWinningPic.width = "800px";
        gameWinningPic.height = "800px";

        // Enable physics
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.AmmoJSPlugin());
        greenMaterial = new BABYLON.StandardMaterial("RedMaterial", scene);
        greenMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.8, 0.5);
        greenMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.8, 0.5);

        blackMaterial = new BABYLON.StandardMaterial("RedMaterial", scene);
        blackMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        blackMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
        wheelAxleCS = new Ammo.btVector3(-1, 0, 0);
        
        // Enable physics
        // var groundSize = 3000;

        // var ground = BABYLON.Mesh.CreateGround("ground1", groundSize, groundSize, 2, scene);

        // var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        // groundMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);//0.75, 1, 0.25);
        // ground.material = groundMaterial;
        // ground.position.y = -0;
        // ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

        //   Convert to physics object and position
        var assetsManagerCity = new BABYLON.AssetsManager(scene);


        var meshTaskCity = assetsManagerCity.addMeshTask("Citymeshes", "", "", "Models/Environment/B/Env13.babylon");
        meshTaskCity.onSuccess = function (task) {
            var City_ = task.loadedMeshes[0];
        }

        /////////////////////////////// BOMBS /////////////////////////////////
        for (let ibomb = 0; ibomb < numBombs; ibomb++) {
            var meshTaskBomb = assetsManagerCity.addMeshTask("bombmeshes", "", "", "Models/Bomb/bomb.babylon");
            meshTasksBombs.push(meshTaskBomb);
            meshTasksBombs[ibomb].onSuccess = function (task) {
                var bombTorso = task.loadedMeshes[0];
                var bombPlane = BABYLON.MeshBuilder.CreateGround("ground", { width: 1.7, height: 1.7 }, scene);

                bombTorso.scaling = new BABYLON.Vector3(4, 4, 4);
                bombTorso.addRotation(Math.PI / 6, 0, 0);
                positionExplosions[ibomb] = bomb_positions[ibomb];//new BABYLON.Vector3(3 * 70, 74, 3 * 40);
                intersectionBombs[ibomb] = true;
                bombPlane.position = bomb_positions[ibomb];
                bombTorso.parent = bombPlane;
                bombPlane.addRotation(-Math.PI / 6, 0, 0);
                bombPlane.addRotation(Math.PI / 2, 0, 0);
                bombPlane.isVisible = false;
                bombTorso.isVisible = true;
                bombTorsos.push(bombTorso);
                bombPlanes.push(bombPlane);
            }
        }


        for (let icoin = 0; icoin < numCoins; icoin++) {
            var meshTaskCoin = assetsManagerCity.addMeshTask("coinmeshes", "", "", "Models/Coin/coin.babylon");
            meshTasksCoins.push(meshTaskCoin);
            meshTaskCoin.onSuccess = function (task) {
                var coinTorso = task.loadedMeshes[0];
                var coinPlane = BABYLON.MeshBuilder.CreateGround("ground", { width: 1, height: 1 }, scene);

                intersectionCoins[icoin] = true;
                coinTorso.scaling = new BABYLON.Vector3(5, 5, 5);
                coinTorso.addRotation(Math.PI / 6, 0, 0);

                coinPlane.addRotation(Math.PI / 2, 0, 0);
                coinTorso.addRotation(BABYLON.Tools.ToRadians(Coins_Rotations[icoin].x), BABYLON.Tools.ToRadians(Coins_Rotations[icoin].y), BABYLON.Tools.ToRadians(Coins_Rotations[icoin].z));
                coinPlane.position = coinPositions[icoin];
                coinTorso.parent = coinPlane;
                coinPlane.isVisible = false;
                coinTorso.isVisible = true;

                coinTorsos.push(coinTorso);
                coinPlanes.push(coinPlane);

            }

        }
        for (let iplatform = 0; iplatform < numPlatforms; iplatform++) {
            var meshTaskPlatform = assetsManagerCity.addMeshTask("platformmeshes", "", "", "Models/SpeedPlatform/speedy.babylon");
            meshTasksPlatforms.push(meshTaskPlatform);
            meshTasksPlatforms[iplatform].onSuccess = function (task) {
                var platformTorso = task.loadedMeshes[0];
                var platformMaterial = new BABYLON.StandardMaterial("platformmat", scene);
                var platformPlane = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
                platformTorso.position = Platforms_positions[iplatform];//new BABYLON.Vector3(0, 0.0, -25.5);
                platformTorso.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
                platformTorso.addRotation(0, Math.PI, 0);
                platformTorso.addRotation(BABYLON.Tools.ToRadians(Platforms_Rotations[iplatform].x), BABYLON.Tools.ToRadians(Platforms_Rotations[iplatform].y), BABYLON.Tools.ToRadians(Platforms_Rotations[iplatform].z));
                platformMaterial.diffuseTexture = new BABYLON.Texture("speedy.png", scene);
                platformTorso = task.loadedMeshes[0];
                platformTorso.material = platformMaterial;
                platformPlane.isVisible = false;
                platformTorso.isVisible = true;
                platformPlane.addRotation(Math.PI / 2, 0, 0);
                platformPlane.parent = platformTorso;
                platformTorsos.push(platformTorso);
                platformPlanes.push(platformPlane);
            }
        }

        var meshTaskBearBirdBuddy = assetsManagerCity.addMeshTask("bearbirdmeshes", "", "", "Models/BearBirdBuddy/bearbird.babylon");
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
        var meshTaskCar = assetsManagerCity.addMeshTask("carmeshes", "", "", "Models/Cars/Car11/B/Car11.babylon");
        meshTaskCar.onSuccess = function (task) {
            let cannon = true;
            let forceFactor = cannon ? 1 : 1500;
            carTorso = task.loadedMeshes.filter(q => q.name == "Car1")[0]
            Body_Box = task.loadedMeshes.filter(q => q.name == "Body_Box")[0];
            Body_Box.isVisible = false;
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
            carFrontier.position.z = -1.2;
            carBackwardMesh.parent = carTorso;
            carBackwardMesh.position.z = 1.2;



            wheelMeshes2[FRONT_LEFT] = wheelMeshes[FRONT_LEFT] = wheelfrontLeft;
            wheelMeshes2[FRONT_RIGHT] = wheelMeshes[FRONT_RIGHT] = wheelfrontRight;
            wheelMeshes2[BACK_LEFT] = wheelMeshes[BACK_LEFT] = wheelbackLeft;
            wheelMeshes2[BACK_RIGHT] = wheelMeshes[BACK_RIGHT] = wheelbackRight;

            shadowGenerator.addShadowCaster(carTorso);
            shadowGenerator.useExponentialShadowMap = true;
        }

        var carFrontier = BABYLON.MeshBuilder.CreateSphere("carForwardMesh", { diameterX: 1.5, diameterY: 0.5, diameterZ: 0.5 }, scene);
        carFrontier.isVisible = false;
        var carBackwardMesh = BABYLON.MeshBuilder.CreateSphere("carBackwardMesh", { diameterX: 1.8, diameterY: 0.5, diameterZ: 0.5 }, scene);
        carBackwardMesh.isVisible = false;

        var explosion = BABYLON.ParticleHelper.CreateAsync("explosion", scene);
        var startAndFinishLine = BABYLON.MeshBuilder.CreateGround("startAndFinish", { width: 8, height: 2 }, scene);
        startAndFinishLine.position = startline_pos;
        startAndFinishLine.addRotation(0, Math.PI / 4, 0);
        startAndFinishLine.addRotation(Math.PI / 40, 0, 0);
        startAndFinishLine.addRotation(0, 0, -Math.PI / 40);
        var startLineMaterial = new BABYLON.StandardMaterial("startMat", scene);
        startLineMaterial.diffuseTexture = new BABYLON.Texture("startLine.png");
        startAndFinishLine.material = startLineMaterial;
        assetsManagerCity.load();
        var lineChecker = BABYLON.MeshBuilder.CreateGround("check3", { width: 16, height: 8 }, scene);
        lineChecker.addRotation(Math.PI / 2, 0, 0);
        lineChecker.isVisible = false;
        // lineChecker.addRotation(0, Math.PI / 6, 0);
        lineChecker.parent = startAndFinishLine;
        var checkRoot = BABYLON.MeshBuilder.CreateGround("check1", { width: 16, height: 8 }, scene);
        checkRoot.addRotation(Math.PI / 2, 0, 0);
        checkRoot.position = new BABYLON.Vector3(158, 72.5, 310);
        checkRoot.isVisible = false;
        var checkRoot2 = BABYLON.MeshBuilder.CreateGround("check2", { width: 16, height: 8 }, scene);
        checkRoot2.addRotation(Math.PI / 2, BABYLON.Tools.ToRadians(225), 0);
        checkRoot2.position = new BABYLON.Vector3(13.332803726196289, 71.44557272047773, -205.10496520996094);//-492, 76.23, -10);
        checkRoot2.isVisible = false;

        assetsManagerCity.onFinish = function (task) {
            var unmutebuttom = document.getElementById('babylonUnmuteIconBtn');
            task[0].loadedMeshes.forEach((m, i) => {
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0.9, restitution: 0.3 });
            })
            var terraind = task[0].loadedMeshes[0];

            var ticker = 0;

            let spheres = [];

            scene.registerBeforeRender(function () {
                if (ticker++ % 60) return;
                var showFloatingSphereNodeMat = Math.random() >= 0;//0.5;

                let s = BABYLON.MeshBuilder.CreateSphere("b", { diameter: 1, segments: 32 });

                if (showFloatingSphereNodeMat) {
                    // var sphereFloatingNodeMat = BABYLON.MeshBuilder.CreateSphere("sphere_floating_nodemat", { diameter: 2, segments: 32 }, scene);

                    // sphereFloatingNodeMat.position.y = 3;
                    // sphereFloatingNodeMat.position.x = -2;
                    // sphereFloatingNodeMat.position.z = -2;
                    //#IFJ86Q/3//JN2BSF#29 //fireBall.json //"Models/Fireball/fireBall.json"
                    BABYLON.NodeMaterial.ParseFromSnippetAsync("JN2BSF#29", scene).then((nodeMaterial) => {
                        var worldPosVarName = nodeMaterial.getBlockByName("worldPos").output.associatedVariableName;

                        s.material = nodeMaterial;
                        // s.material.shadowDepthWrapper = new BABYLON.ShadowDepthWrapper(nodeMaterial, scene, {
                        //     remappedVariables: ["worldPos", worldPosVarName, "alpha", "1."]
                        // });
                    });
                    // BABYLON.nodeMaterial.loadAsync("Models/Fireball/fireBall.json").then((nodeMaterial) => {
                    //     nodeMaterial.build(true);

                    // // BABYLON.NodeMaterial.ParseFromSnippetAsync("JN2BSF#29", scene).then((nodeMaterial) => {
                    //     var worldPosVarName = nodeMaterial.getBlockByName("worldPos").output.associatedVariableName;

                    //      s.material = nodeMaterial;
                    //     // s.material.shadowDepthWrapper = new BABYLON.ShadowDepthWrapper(nodeMaterial, scene, {
                    //     //     remappedVariables: ["worldPos", worldPosVarName, "alpha", "1."]
                    //     // });
                    // });
                    // let skyMaterial = new BABYLON.NodeMaterial('sky material', scene, { emitComments: true });
                    // skyMaterial.loadAsync("Models/Fireball/fireBall.json");
                    // skyMaterial.build(true);
                    // // skyMaterial.backFaceCulling = false;
                    // // let skybox = BABYLON.MeshBuilder.CreateSphere('skybox', { segments: 10.0, diameter: 200 }, this.scene);
                    // s.material = skyMaterial;
                }
                else {
                    s.material = new BABYLON.StandardMaterial("earthMat", scene);
                    s.material.diffuseTexture = new BABYLON.Texture("Models/Fireball/Sphere3.jpg", scene);

                }

                var global_rot = chassisMesh.rotationQuaternion.toEulerAngles();//q.getAngle();
                var global_pos = chassisMesh.position;
                s.position.y = 120;

                var sphererange = 50;
                s.position.z = Math.sign(global_pos.z) * ((Math.abs(global_pos.z) - sphererange) + (Math.random() * sphererange * 2));
                s.position.x = Math.sign(global_pos.x) * ((Math.abs(global_pos.x) - sphererange) + (Math.random() * sphererange * 2));
                s.scaling = new BABYLON.Vector3(3, 3, 3);

                s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 500 });
                shadowGenerator.addShadowCaster(s);

                var tuple = [s, new Date().getTime()]
                spheres.push(tuple);
                spheres.forEach(function ([sphere, sphere_time]) {
                    var difference = ((new Date().getTime()) - sphere_time) / 1000;
                    if (difference > numberOfspheres) {
                        sphere.dispose();
                        shadowGenerator.removeShadowCaster(sphere);

                    }
                });

                spheres = spheres.filter(s => !s[0].isDisposed());

            });


            var axis = new BABYLON.Vector3(0, 1, 0);
            var startquaternion = new BABYLON.Quaternion.RotationAxis(axis, BABYLON.Tools.ToRadians(225));//ZERO_QUATERNION

            createVehicle2(new BABYLON.Vector3(0, 0, 0), startquaternion, carTorso, scene);
        }

        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
        scene.onKeyboardObservable.add((kbInfo) => {

            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    if (activateP && (kbInfo.event.key == "p" || kbInfo.event.key == "P")) {
                        if (startPressed && startCountdownTimer) {
                            countdownTimer.addControl(textCountdown);

                            var handle = window.setInterval(() => {
                                textCountdown.text = new String(i);
                                if (i == 0) {
                                    window.clearInterval(handle);
                                    textCountdown.dispose();
                                    countdownTimer.dispose();
                                    startMotion = true;
                                    startCountdownTimer = false;
                                    activateTimer = true;
                                    startMotion2 = true;
                                    pauseActivated = true;
                                    gameStarted = true;

                                }
                                i--;
                            }, 1000);
                        }
                        local_pause = false;
                        if (pauseActivated) {
                            activateP = false;
                            makePause = false;
                            startMotion = false;
                            var tm = vehicle.getChassisWorldTransform(i);
                            var p = tm.getOrigin();
                            var q = tm.getRotation();
                            pause_car_Pos = new Ammo.btVector3(p.x(), p.y(), p.z());

                            pause_car_Rot = new Ammo.btQuaternion(q.x(), q.y(), q.z(), q.w());
                            local_pause = true;
                            menuData(scene, pauseActivated);
                        }
                    }
                    if (startMotion2) {
                        startMotion2 = false;
                        scene.registerAfterRender(function () {
                            for (let ibomb = 0; ibomb < numBombs; ibomb++) {
                                bombTorsos[ibomb].addRotation(0, Math.PI / 12, Math.PI / 12);
                                bombExplosion(carFrontier, carBackwardMesh, carTorso, bombTorsos[ibomb], bombPlanes[ibomb], explosion, positionExplosions[ibomb], intersectionBombs[ibomb]);
                            }
                            for (let icoin = 0; icoin < numCoins; icoin++) {
                                coinGather(carFrontier, carBackwardMesh, coinPlanes[icoin], coinTorsos[icoin], coinText, intersectionCoins[icoin]);
                                coinTorsos[icoin].addRotation(0, Math.PI / 12, Math.PI / 12);
                                coinPlanes.rotation = new BABYLON.Vector3(0, 0, 0);

                            }
                            for (let iplatform = 0; iplatform < numPlatforms; iplatform++) {
                                speedTheCar(carFrontier, chassisMesh, platformPlanes[iplatform]);//moveableObject, moveableObjectTorso, stayedObjectTorso)
                            }
                            checkRoots(carFrontier, checkRoot, checkRoot2);
                            finishLineChecker(carFrontier, lineChecker);
                            if (checkPos == 2 && finishedTruly) {
                                gameWinning = true;
                            }
                        });
                    }

                    if (activateTimer) {
                        activateTimer = false;

                        var handle2 = window.setInterval(() => {


                            if ((currentTime % 60 == 0) && startMotion) {
                                counterTimer -= 1;
                                printedTime = 0;
                            }
                            if (startMotion && makePause) {
                                currentTime--;
                            }
                            printedTime = currentTime - counterTimer * 60;

                            if (printedTime < 10) {
                                var timerText = "0" + counterTimer + ":0" + printedTime;
                            }
                            else {
                                var timerText = "0" + counterTimer + ":" + printedTime;
                            }
                            if (currentTime == 0) {
                                startMotion = false;
                                var timerText = "00:00";
                                gameOverTexture.addControl(gameOverPic);
                                activateP = false;
                            }
                            if (gameWinning) {
                                startMotion = false;
                                activateP = false;
                                if (printedTime < 10) {
                                    var timerText = "0" + counterTimer + ":" + "0" + printedTime;
                                }
                                else {
                                    var timerText = "0" + counterTimer + ":" + printedTime;
                                }
                                gameWinningTexture.addControl(gameWinningPic);
                            }
                            textTimer.text = timerText;
                        }, 1000);
                    }
                    break;
            }
        });
        var tbv30 = new Ammo.btVector3();

        function setBodyVelocity(body, x, y, z) {
            tbv30.setValue(x, y, z);
            body.setLinearVelocity(tbv30);
        }


        scene.registerBeforeRender(function () {

            if (clickSound == 0 || clickSound == 1) {
                soundText = "On";
                soundIcon = "off";
            }
            else {
                soundText = "Off";
                soundIcon = "on";
            }

            if (click == 0 || click == 1) {
                dayText = 'Night'
                dayIcon = 'sun'
            }
            else {
                dayText = 'Day'
                dayIcon = 'moon'
            }

            light.intensity = intensityValue;
            light2.intensity = intensityValue;
            canvas.height = heightRatio * canvas.width;
            numberOfspheres = Math.floor(difficultyRatio * 100);
            var dt = engine.getDeltaTime().toFixed() / 1000;
            if (vehicleReady) {

                var speed = vehicle.getCurrentSpeedKmHour();
                var maxSteerVal = 0.2;
                breakingForce = 0;
                engineForce = -1 * speedFlag * 1000;

                if (startMotion) {
                    if (actions.braking) {
                        if (speed < -1) {
                            breakingForce = maxBreakingForce;
                            direction = 1;
                        } else {
                            engineForce += maxEngineForce;
                        }

                    } else if (actions.acceleration) {
                        if (speed > 1) {
                            breakingForce = maxBreakingForce;
                            direction = -1;
                        } else {
                            engineForce += -maxEngineForce;
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
                        rightFrontAngle = 0;
                    }


                }

                tm = vehicle.getChassisWorldTransform();
                p = tm.getOrigin();
                q = tm.getRotation();
                var lolcal_physics_pos=p.y();
                var global_rot = chassisMesh.rotationQuaternion.toEulerAngles();//q.getAngle();
                var global_pos = chassisMesh.position;
                if (!startMotion) {
                    setBodyVelocity(vehicle.getRigidBody(), 0, 0, 0)
                    if (gameStarted) {
                        gameStarted = false;
                        var axis = new BABYLON.Vector3(0, 1, 0);
                        var yprquaternion = new BABYLON.Quaternion.RotationAxis(axis, BABYLON.Tools.ToRadians(200));//ZERO_QUATERNION
                        tm.setRotation(new Ammo.btQuaternion(yprquaternion.x, yprquaternion.y, yprquaternion.z, yprquaternion.w));
                        tm.setOrigin(new Ammo.btVector3(initial_car_pos.x, initial_car_pos.y - 3, initial_car_pos.z));
                        p = tm.getOrigin();
                        q = tm.getRotation();
                        numtries = 0;
                        gameover_on = false;

                    } else if (local_pause) {
                        tm.setRotation(new Ammo.btQuaternion(pause_car_Rot.x(), pause_car_Rot.y(), pause_car_Rot.z(), pause_car_Rot.w()));
                        tm.setOrigin(new Ammo.btVector3(pause_car_Pos.x(), pause_car_Pos.y(), pause_car_Pos.z()));
                        p = tm.getOrigin();
                        q = tm.getRotation();
                    }
                    else if(lolcal_physics_pos>20&&lolcal_physics_pos<75.5 )
                    {
                        if(begginingpause){
                            begginingpause=false;
                        pause_car_Pos = new Ammo.btVector3(p.x(), p.y(), p.z());

                        pause_car_Rot = new Ammo.btQuaternion(q.x(), q.y(), q.z(), q.w());
                        }
                        tm.setRotation(new Ammo.btQuaternion(pause_car_Rot.x(), pause_car_Rot.y(), pause_car_Rot.z(), pause_car_Rot.w()));
                        tm.setOrigin(new Ammo.btVector3(pause_car_Pos.x(), 75.5+0*pause_car_Pos.y(), pause_car_Pos.z()));
                        p = tm.getOrigin();
                        q = tm.getRotation();
                    }
                }
                else {
                    local_pause = false;
                }
                if (startMotion && global_pos.y < 60) {
                    falls_counter++
                    if (falls_counter > 3) {
                        gameover_on = true;
                        falls_counter = 0;
                    }
                    else {
                        var yprquaternion = BABYLON.Quaternion.RotationYawPitchRoll(global_rot.y, global_rot.x, 0 * global_rot.z);
                        tm.setRotation(new Ammo.btQuaternion(yprquaternion.x, yprquaternion.y, yprquaternion.z, yprquaternion.w));
                        tm.setOrigin(new Ammo.btVector3(global_pos.x, global_pos.y + 20, global_pos.z));
                        p = tm.getOrigin();
                        q = tm.getRotation();
                    }
                }
                else {
                    //local_pause = false;
                    if (gameStarted) {
                        gameStarted = false;
                        var axis = new BABYLON.Vector3(0, 1, 0);
                        var yprquaternion = new BABYLON.Quaternion.RotationAxis(axis, BABYLON.Tools.ToRadians(225));//ZERO_QUATERNION
                        tm.setRotation(new Ammo.btQuaternion(yprquaternion.x, yprquaternion.y, yprquaternion.z, yprquaternion.w));
                        tm.setOrigin(new Ammo.btVector3(initial_car_pos.x, initial_car_pos.y - 4, initial_car_pos.z));
                        p = tm.getOrigin();
                        q = tm.getRotation();
                        // chassisMesh.rotationQuaternion.set(q_x, q_y, q_z, q_w)
                        numtries = 0;
                        gameover_on = false;

                    }
                }
                if (startMotion == 1 && global_pos.y < 60) {
                    falls_counter++
                    if (falls_counter > 3) {
                        gameover_on = true;
                        falls_counter = 0;
                    }
                    else {
                        var yprquaternion = BABYLON.Quaternion.RotationYawPitchRoll(global_rot.y, global_rot.x, 0 * global_rot.z);
                        tm.setRotation(new Ammo.btQuaternion(yprquaternion.x, yprquaternion.y, yprquaternion.z, yprquaternion.w));
                        tm.setOrigin(new Ammo.btVector3(global_pos.x, global_pos.y + 20, global_pos.z));
                        p = tm.getOrigin();
                        q = tm.getRotation();
                        // chassisMesh.rotationQuaternion.set(q_x, q_y, q_z, q_w)
                        // numtries = 0; 
                    }
                    // currentTime = jinit0;
                    // counterTimer = Math.floor(currentTime / 60);
                }
                else {

                }
                if (gameover_on) {
                    startMotion = false;
                    gameOverTexture.addControl(gameOverPic);
                    var axis = new BABYLON.Vector3(0, 1, 0);
                    var yprquaternion = new BABYLON.Quaternion.RotationAxis(axis, BABYLON.Tools.ToRadians(200));//ZERO_QUATERNION
                    tm.setRotation(new Ammo.btQuaternion(yprquaternion.x, yprquaternion.y, yprquaternion.z, yprquaternion.w));
                    tm.setOrigin(new Ammo.btVector3(initial_car_pos.x, initial_car_pos.y, initial_car_pos.z));
                    p = tm.getOrigin();
                    q = tm.getRotation();
                    numtries = 0;
                    gameover_on = false;
                    numtries = 0;
                    gameover_on = false;
                    music.pause();
                    music2.pause();
                    music3.pause();
                    music4.pause();
                    music5.pause();
                    music6.pause();

                }
                if (Math.abs(speed) < 0.6 && startMotion) {

                    // falls_counter++
                    // //
                    if (Math.abs(global_rot.z) > 2.5 || numtries > 4) {
                        if (soundOn) {
                            music4.play();

                        }
                        var yprquaternion = BABYLON.Quaternion.RotationYawPitchRoll(global_rot.y, global_rot.x, 0 * global_rot.z);
                        tm.setRotation(new Ammo.btQuaternion(yprquaternion.x, yprquaternion.y, yprquaternion.z, yprquaternion.w));
                        tm.setOrigin(new Ammo.btVector3(global_pos.x, global_pos.y + 5, global_pos.z));
                        p = tm.getOrigin();
                        q = tm.getRotation();
                        numtries = 0;
                    }
                }
                else {
                    numtries = 0;
                }

                chassisMesh.position.set(p.x(), p.y() + offsetcar - suspensionRestLength, p.z());
                var q_x = q.x();
                var q_y = q.y();
                var q_z = q.z();
                var q_w = q.w();
                chassisMesh.rotationQuaternion.set(q_x, q_y, q_z, q_w);
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
        }

        var wheel_position_FRONT_LEFT = wheelMeshes[FRONT_LEFT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_FRONT_RIGHT = wheelMeshes[FRONT_RIGHT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_BACK_LEFT = wheelMeshes[BACK_LEFT].getBoundingInfo().boundingBox.centerWorld;
        var wheel_position_BACK_RIGHT = wheelMeshes[BACK_RIGHT].getBoundingInfo().boundingBox.centerWorld;


        offsetcar = - 1 * ps_carTorso.getBoundingInfo().boundingBox.extendSizeWorld.y / 1;
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
        var mesh = new BABYLON.MeshBuilder.CreateCylinder("Wheel", { diameter: radius * 2, height: width, tessellation: 24 }, scene);

        mesh.rotationQuaternion = new BABYLON.Quaternion();
        mesh.material = blackMaterial;
        mesh.isVisible = true;
        return mesh;
    }


    function keyup(e) {
        if (keysActions[e.code]) {
            actions[keysActions[e.code]] = false;
            numtries++;
        }
    }

    function keydown(e) {
        if (keysActions[e.code]) {
            actions[keysActions[e.code]] = true;
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

    engine.runRenderLoop(function () {
        if (sceneToRender) {
            sceneToRender.render();
        }
    });
});
