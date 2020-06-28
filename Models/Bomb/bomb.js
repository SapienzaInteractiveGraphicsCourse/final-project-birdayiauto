var canvas = document.getElementById("renderCanvas");

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
        var createScene = function () {
        
            // This creates a basic Babylon Scene object (non-mesh)
            var scene = new BABYLON.Scene(engine);
        
            // This creates and positions a free camera (non-mesh)
            var camera = new BABYLON.ArcRotateCamera("arcCam", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(0), 2.0, BABYLON.Vector3.Zero(), scene);
        
            // This targets the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());
        
            // This attaches the camera to the canvas
            camera.attachControl(canvas, true);
        
            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        
            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 0.7;
        
            var tail_Path = [
                new BABYLON.Vector3(0.05, 0, 0.0),
                new BABYLON.Vector3(0, 0.01, 0.01),
                new BABYLON.Vector3(-0.04, 0.06, 0.02)
            ];
        
        
            // Our built-in 'sphere' shape.
            var bomb = BABYLON.MeshBuilder.CreateSphere("bomb", { diameter: 0.2, segments: 32 }, scene);
            var bomb_head = BABYLON.MeshBuilder.CreateCylinder("bomb_head", { diameter: 0.07, height: 0.1 }, scene);
            bomb_head.parent = bomb;
            bomb_head.position.y = 0.07;
            var tail_Path = [
                new BABYLON.Vector3(bomb_head.position.x, 0.03, 0.0),
                new BABYLON.Vector3(0, 0.05, 0.05),
                new BABYLON.Vector3(-0.04, 0.08, 0.02),
                new BABYLON.Vector3(0.01, 0.11, 0.06)
                // new BABYLON.Vector3()
            ];
            var bomb_tail = BABYLON.MeshBuilder.CreateTube("bombTail", { path: tail_Path, radius: 0.005 }, scene);
            var shining1 = BABYLON.MeshBuilder.CreatePolyhedron("shining1", { type: 15, size: 0.02 }, scene);
            shining1.parent = bomb_tail;
            shining1.position.y = 0.12;
            shining1.position.z = 0.06;
            var shining2 = BABYLON.MeshBuilder.CreatePolyhedron("shining2", { type: 15, size: 0.02 }, scene);
            shining2.parent = bomb_tail;
            shining2.position.y = shining1.position.y;
            shining2.position.z = shining1.position.z;
            shining2.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 3);
            var shining3 = BABYLON.MeshBuilder.CreatePolyhedron("shining3", { type: 15, size: 0.02 }, scene);
            shining3.parent = bomb_tail;
        
            shining3.position.y = shining1.position.y;
            shining3.position.z = shining1.position.z;
        
            shining2.rotate(new BABYLON.Vector3(0, 1, 0), 2 * Math.PI / 3);
        
        
        
            bomb_tail.parent = bomb_head;
            // Move the sphere upward 1/2 its height
            bomb.position.y = 0;
        
        
            var bombMaterial = new BABYLON.StandardMaterial("bombMaterial", scene);
            bombMaterial.diffuseColor = new BABYLON.Color3.Black;
            var shiningMaterial = new BABYLON.StandardMaterial("shiningMaterial1", scene);
            shiningMaterial.diffuseColor = new BABYLON.Color3.Yellow;
            shiningMaterial.emissiveColor = new BABYLON.Color3.Red;
            bomb.material = bombMaterial;
            bomb_head.material = bombMaterial;
            shining1.material = shiningMaterial;
            shining2.material = shiningMaterial;
            shining3.material = shiningMaterial;
            // Our built-in 'ground' shape.
        
        

        
        
            return scene;
        
        };
        
        
       
        
var engine;
try {
    engine = createDefaultEngine();
} catch(e) {
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
