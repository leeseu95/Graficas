var camera, scene, renderer, controls;

var objects = [];
var bullets = [];
var keyboard = {};

var raycaster;

var blocker,  instructions;

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var objLoader = null;
var invaderLoader = null;
//Pistola con la que vamos a disparar
var gun = null;
var invader = null;
var invaders = [];
var invaderCollision;
var bulletCollision;
var collision;

var scorePoints = 0;

var prevTime = performance.now();
var velocity, direction;

var floorUrl = "moon_1024.jpg";
var cubeUrl = "Space_Invader-Render04.jpg";

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

function initPointerLock()
{
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) 
    {
        var element = document.body;

        var pointerlockchange = function ( event ) {

            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                controlsEnabled = true;
                controls.enabled = true;

                blocker.style.display = 'none';

            } else {

                controls.enabled = false;

                blocker.style.display = 'block';

                instructions.style.display = '';

            }

        };

        var pointerlockerror = function ( event ) {

            instructions.style.display = '';

        };

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) 
        {
            instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();

        }, false );

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
}

function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        '/models/cerberus/Cerberus.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('/models/cerberus/Cerberus_A.jpg');
            var normalMap = new THREE.TextureLoader().load('/models/cerberus/Cerberus_N.jpg');
            var specularMap = new THREE.TextureLoader().load('/models/cerberus/Cerberus_M.jpg');

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
            object.position.z = -7;
            object.position.y = -3;
            object.position.x = 3;
            object.scale.set(5,5,5);
            gun = object;
            camera.add(object);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}

function loadInvader(position_x, position_z)
{
    if(!invaderLoader)
        invaderLoader = new THREE.OBJLoader();
    
    invaderLoader.load(
        '/models/Space_Invader/Space_Invader.obj',

        function(object)
        {
            // var texture = new THREE.TextureLoader().load('/models/Space_Invader/Space_Invader-Render01.jpg');
            // var normalMap = new THREE.TextureLoader().load('/models/Space_Invader/Space_Invader-Render02.jpg');

            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // child.material.map = texture;
                    // child.material.normalMap = normalMap;
                }
            } );
            object.position.z = position_z;
            object.position.y = 0;
            object.position.x = position_x;
            object.scale.set(0.2,0.2,0.2);
            invader = object;

            invaderCollision = new THREE.Box3().setFromObject(object);
            invaders.push(invader);
            scene.add(object);

            setTimeout(function() {
                scene.remove(object);
            }, 5000);
        });
}

function onKeyDown ( event )
{
    switch ( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = true;
            break;

        case 37: // left
        case 65: // a
            moveLeft = true; break;

        case 40: // down
        case 83: // s
            moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            break;

        case 32: // space
            // shoot a bullet // spacebar key
                // creates a bullet as a Mesh object
                var bullet = new THREE.Mesh(
                    new THREE.SphereGeometry(1,8,8),
                    new THREE.MeshBasicMaterial({color:0x000000})
                );

                scene.updateMatrixWorld();
                // this is silly.
                // var bullet = models.pirateship.mesh.clone();
                
                // position the bullet to come from the player's weapon
                bullet.position.z = 3;

                // bullet.position.set(gun.position.z, gun.position.x, gun.position.y); 
                // set the velocity of the bullet
                bullet.velocity = new THREE.Vector3(
                    Math.sin(camera.rotation.y) * 5,
                    0,
                    -Math.cos(camera.rotation.y) * 5
                );
        
                //Funcion para setear cuanto va a estar el bullet en nuestra escena
                bullet.alive = true;
                setTimeout(function(){
                    bullet.alive = false;
                    scene.remove(bullet);
                }, 2000);
                
                // add to scene, array, and set the delay to 10 frames
                bulletCollision = new THREE.Box3().setFromObject(bullet)
                bullets.push(bullet);
                gun.add(bullet);
                // scene.add(bullet);
    }
}

function onKeyUp( event ) {

    switch( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = false;
            break;

        case 37: // left
        case 65: // a
            moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            break;

    }
}

function createScene(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    window.addEventListener( 'resize', onWindowResize, false );

    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();

    blocker = document.getElementById( 'blocker' );
    instructions = document.getElementById( 'instructions' );
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 550 );

    document.getElementById("scoreboard").innerHTML = "Score:\t" + scorePoints + " points"; 

    // A light source positioned directly above the scene, with color fading from the sky color to the ground color. 
    // HemisphereLight( skyColor, groundColor, intensity )
    // skyColor - (optional) hexadecimal color of the sky. Default is 0xffffff.
    // groundColor - (optional) hexadecimal color of the ground. Default is 0xffffff.
    // intensity - (optional) numeric value of the light's strength/intensity. Default is 1.

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    loadObj();
    loadInvadersRandom();
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    // Raycaster( origin, direction, near, far )
    // origin — The origin vector where the ray casts from.
    // direction — The direction vector that gives direction to the ray. Should be normalized.
    // near — All results returned are further away than near. Near can't be negative. Default value is 0.
    // far — All results returned are closer then far. Far can't be lower then near . Default value is Infinity.
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // floor

    var map = new THREE.TextureLoader().load(floorUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    var floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;
    scene.add( floor );

    // objects

    // var boxGeometry = new THREE.BoxGeometry( 20, 20, 20 );
    // var cubeMap = new THREE.TextureLoader().load(cubeUrl);

    // for ( var i = 0; i < 500; i ++ ) 
    // {
    //     var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, map:cubeMap } );

    //     var box = new THREE.Mesh( boxGeometry, boxMaterial );
    //     box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
    //     box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
    //     box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

    //     scene.add( box );
    //     objects.push( box );
    // }
}

function loadInvadersRandom() {
    setInterval(function() {
        position_x = Math.floor(Math.random() * 200) - 200;
        position_z = Math.floor(Math.random() * 200) - 200;
        loadInvader(position_x, position_z);
    }, 1000);
}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function run() 
{
    requestAnimationFrame( run );

    if ( controlsEnabled === true ) 
    {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );

        var onObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveLeft ) - Number( moveRight );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) 
        {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
        }

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        for(var index=0; index<bullets.length; index+=1){
            if( bullets[index] === undefined ) continue;
            // if( bullets[index].alive == false ){
            //     bullets.splice(index,1);
            //     continue;
            // }
            
            bullets[index].position.add(bullets[index].velocity);
            // console.log(bullets[index].position);
            for(let aliensCounter = 0; aliensCounter < invaders.length; aliensCounter++ ){
                // console.log(invaders[aliensCounter].position);
                if (bullets[index].position.z < invaders[aliensCounter].position.z + 130 && bullets[index].position.z > invaders[aliensCounter].position.z - 130){
                    if (bullets[index].position.x < invaders[aliensCounter].position.x + 130 && bullets[index].position.x > invaders[aliensCounter].position.x - 130) {
                        console.log("Score!");
                        scorePoints ++;
                        scene.remove(invaders[aliensCounter]);
                        invaders.splice(aliensCounter, 1);
                        document.getElementById("scoreboard").innerHTML = "Score:\t" + scorePoints + " points";
                    }
                } 
            }
            // console.log("Debug");
        }

        // var aliensCounter = 0;
        // for(var i = 0; i < bullets.length; i ++) {
        //     if ( bullets[i] === undefined) continue;
        //     if( bullets[index].alive == false ){
        //         bullets.splice(index,1);
        //         continue;
        //     }

        //     for(aliensCounter = 0; aliensCounter < invaders.length; aliensCounter++ ){
        //         if (bullets[i].position == invaders[i].position) {
        //             console.log("Score!");
        //             scene.remove(invaders[i]);
        //         } 
        //     }
        // }
        // var intersects = raycaster.intersectObjects( invaders );
        // for ( var i =col 0; i < intersects.length; i++ ) {

        //     console.log("Intersected");
        //     intersects[ i ].object.material.color.set( 0xff0000 );
    
        // }


        // var scorePoint = 0;
        // collision = invaderCollision.intersectsBox(bulletCollision);
        // if (collision) {
        //     scorePoint += 1;
        //     console.log("Score " + scorePoint );
        // }

        prevTime = time;

    }

    renderer.render( scene, camera );

}