// var canvas = document.getElementById("renderCanvas");

// var engine = null;
// var scene = null;
// var sceneToRender = null;
// var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
// var createScene = function () {

//     // This creates a basic Babylon Scene object (non-mesh)
//     var scene = new BABYLON.Scene(engine);
//     // var bearscene = new BABYLON.Scene(engine);
//     // This creates and positions a free camera (non-mesh)
//     // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(10, 5, -10), scene);
//     var camera = new BABYLON.ArcRotateCamera("arcCam", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0), 10.0, BABYLON.Vector3.Zero(), scene);

//     // This targets the camera to scene origin
//     // camera.setTarget(BABYLON.Vector3.Zero());

//     // This attaches the camera to the canvas
//     camera.attachControl(canvas, true);

//     // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
//     var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

//     // Default intensity is 1. Let's dim the light a small amount
//     light.intensity = 0.7;


//     var car=BABYLON.SceneLoader.ImportMesh("","","Models/Classic_race_car.babylon",
//     scene,function(newMeshes) {
//         camera.target = newMeshes[0];
//         newMeshes[0].position = new BABYLON.Vector3(0,0,0);
//     });




//     var bearbird = BABYLON.SceneLoader.ImportMesh("","","Models/bearbird.babylon", scene,
//     function(newMeshes){
//         camera.target = newMeshes[0];
//         console.log(newMeshes[0]);
//         newMeshes[0].position = new BABYLON.Vector3(5,0.5,1);
//         });

//     var groundSize = 400;
//     var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
//     var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
//     groundMaterial.diffuseColor = new BABYLON.Color3(0.75, 1, 0.25);
//     ground.material = groundMaterial;
//     ground.position.y = -0.5;
//     console.log(ground);





//     return scene;


// };
// var engine;
// try {
//     engine = createDefaultEngine();
// } catch (e) {
//     console.log("the available createEngine function failed. Creating the default engine instead");
//     engine = createDefaultEngine();
// }
// if (!engine) throw 'engine should not be null.';
// scene = createScene();;
// sceneToRender = scene

// engine.runRenderLoop(function () {
//     if (sceneToRender) {
//         sceneToRender.render();
//     }
// });

// // Resize
// window.addEventListener("resize", function () {
//     engine.resize();
// });
"use strict";

var canvas;
var gl;
var program;
var engine;
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
                console.log(newMeshes[0]);
                newMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
            });
        var car = BABYLON.SceneLoader.ImportMesh("", "", "Models/Cars/Car1/B/Car1.babylon", scene0,
            function (newMeshes) {
                camera.target = newMeshes[0];
                newMeshes[0].position = new BABYLON.Vector3(2, 0, 0);
            });
        //  Models/Roads/Road10/B/
        //Models/Roads/Road11/B/
        return scene0;
    }
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.White();


        var camera = new BABYLON.ArcRotateCamera("arcCam",
            0,
            0,
            50.0, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // var light = new BABYLON.PointLight("PointLight",new BABYLON.Vector3(
        // 0,0,0),scene);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(100, 0, 0), scene);

        light.parent = camera;
        light.intensity = 1.5;


  
        // var road = BABYLON.SceneLoader.ImportMesh("", "", "Models/Roads/Road11/B/Road11.babylon", scene,
        //     function (newMeshes) {
        //         camera.target = newMeshes[0];
        //         console.log(newMeshes[0]);
        //         newMeshes[0].scaling = new BABYLON.Vector3(100, 100, 100);
        //         //  newMeshes[0].position = new BABYLON.Vector3(-14,-2.2,-40);
        //         newMeshes[0].position = new BABYLON.Vector3(70, -0.3, -45);
        //     });
        //Models/Environments/Env2/B/Env2.babylon
        var city = BABYLON.SceneLoader.ImportMesh("", "", "Models/Environments/Env7/B/Env7.babylon", scene,
            function (newMeshes) {
                camera.target = newMeshes[0];
                console.log(newMeshes[0]);
                newMeshes[0].scaling = new BABYLON.Vector3(4, 4,4);
                //  newMeshes[0].position = new BABYLON.Vector3(-14,-2.2,-40);
                newMeshes[0].position = new BABYLON.Vector3(-40, 0, 0);
            });
            var bearbird = BABYLON.SceneLoader.ImportMesh("", "", "Models/bearbird.babylon", scene,
            function (newMeshes) {
                camera.target = newMeshes[0];
                console.log(newMeshes[0]);
                newMeshes[0].position = new BABYLON.Vector3(0,228 +0*(171+90), 0);
            });
            //Models/Cars/Car4/B/
        var car = BABYLON.SceneLoader.ImportMesh("", "", "Models/Cars/Car4/B/Car4.babylon", scene,
            function (newMeshes) {
                camera.target = newMeshes[0];
                newMeshes[0].position = new BABYLON.Vector3(2,228+0*(171+90), -2);
            });
        var groundSize = 10000;
        //  car.position.y=1.5;

        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0,0,0);//0.75, 1, 0.25);
        ground.material = groundMaterial;
        ground.position.y = -0.3;

        // scene.activeCamera.useFramingBehavior = true;

        // var framingBehavior = scene.activeCamera.getBehaviorByName("Framing");
        // framingBehavior.framingTime = 0;
        // framingBehavior.elevationReturnTime = -1;

        // var worldExtends = scene.getWorldExtends();
        // scene.activeCamera.lowerRadiusLimit = null;
        // framingBehavior.zoomOnBoundingInfo(worldExtends.min, worldExtends.max);
        return scene;
    }

    var scene = createScene();
    var scene1 = createScene0();
    engine.runRenderLoop(function () {
        scene.render();
        //  scene1.render();
    });

});
