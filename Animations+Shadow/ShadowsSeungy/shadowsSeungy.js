//Seung Hoon Lee - A01021720
//Tarea 4 Shadows Animation

var renderer = null, 
scene = null, 
camera = null,
root = null,
monster = null,
group = null,
orbitControls = null;

var objLoader = null, jsonLoader = null;

var duration = 8; // segundos
var currentTime = Date.now();

var monsterAnimator = null;
var loopAnimation = true;

function loadJson()
{
    if(!jsonLoader)
    jsonLoader = new THREE.JSONLoader();
    
    jsonLoader.load(
        '../models/monster/monster.js',

        function(geometry, materials)
        {
            var material = materials[0];
            
            var object = new THREE.Mesh(geometry, material);
            object.castShadow = true;
            object. receiveShadow = true;
            object.scale.set(0.002, 0.002, 0.002);
            object.position.y = -1;
            object.position.x = 1.5;
            monster = object;
            group.add(object);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}

function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        '../models/cerberus/Cerberus.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('../models/cerberus/Cerberus_A.jpg');
            var normalMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_N.jpg');
            var specularMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_M.jpg');

            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                    child.material.specularMap = specularMap;
                }
            } );
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}

function initAnimations() {

        var radius = 4;
        var iters = 360;
        var positions = [];
        var rotations = [];
        var keyFrames = [];
        var angle = 0;
        var positionX = 3;
        var positionZ = 3;
        var temp = "";

        for (let i = 0; i < iters; i++) {
            if( i < 90 ) {
                positionX += 0.1;
                positionZ -= 0.1;
            } else if ( i >= 90 &&  i < 180) {
                positionX += -0.1;
                positionZ += -0.1;
            } else if ( i >= 180 && i < 270) {
                positionX -= 0.08;
                positionZ += 0.08;
            } else if ( i >= 270 && i < 360) {
                positionX += 0.08;
                positionZ += 0.08;
            }
            angle = ((2 * Math.PI)/iters) * i;
            temp = "{\"x\":" + (positionX) + ",\"y\":0,\"z\":" + (positionZ) + '}';
            positions.push(JSON.parse(temp))
            keyFrames.push(i/iters);
            temp = "{\"y\":" + angle + '}';
            rotations.push(JSON.parse(temp));
        }

        monsterAnimator = new KF.KeyFrameAnimator;
        monsterAnimator.init({
            interps:
                [
                    {
                        keys: keyFrames,
                        values: positions,
                        target:group.position
                    },
                    {
                        keys: keyFrames,
                        values: rotations,
                        target: group.rotation
                    }
                ],
            loop: loopAnimation,
            duration: duration * 1000,
            easing:TWEEN.Easing.Linear.None,
        });
}

function playAnimations() {
    monsterAnimator.start();
}

function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        KF.update();

        // Update the camera controller
        orbitControls.update();
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "../images/checker_large.gif";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-2, 10, 20);
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(.5, 0, 3);
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create the objects
    loadObj();

    loadJson();

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;

    // Add the mesh to our group
    scene.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    
    // group.add( monster );

    // Now add the group to our scene
    scene.add( root );
}