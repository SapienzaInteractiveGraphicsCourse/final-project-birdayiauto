var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // var bearscene = new BABYLON.Scene(engine);
    // This creates and positions a free camera (non-mesh)
    // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(10, 5, -10), scene);
    var camera = new BABYLON.ArcRotateCamera("arcCam", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0), 10.0, BABYLON.Vector3.Zero(), scene);

    // This targets the camera to scene origin
    // camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    
    var car=BABYLON.SceneLoader.ImportMesh("","","Models/Classic_race_car.babylon",
    scene,function(newMeshes) {
        camera.target = newMeshes[0];
        newMeshes[0].position = new BABYLON.Vector3(0,0,0);
    });




    var bearbird = BABYLON.SceneLoader.ImportMesh("","","Models/bearbird.babylon", scene,
    function(newMeshes){
        camera.target = newMeshes[0];
        console.log(newMeshes[0]);
        newMeshes[0].position = new BABYLON.Vector3(5,0.5,1);
        });
    
    var groundSize = 400;
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.75, 1, 0.25);
    ground.material = groundMaterial;
    ground.position.y = -0.5;
    console.log(ground);





    return scene;


};
var engine;
try {
    engine = createDefaultEngine();
} catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    engine = createDefaultEngine();
}
if (!engine) throw 'engine should not be null.';
scene = createScene();;
sceneToRender = scene

engine.runRenderLoop(function () {
    if (sceneToRender) {
        sceneToRender.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});