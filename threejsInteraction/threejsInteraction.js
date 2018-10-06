var container;
var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var sequenceCubes = [];
var gameCubes = [];

var startCube = null;

var indexPoint = 0;
var index = 0;
var scorePoints = 0;

var animator = null,
duration = 1, // sec
loopAnimation = false;
var timeoutAmount = 1000;

var x = 0;

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    
    var geometry = new THREE.BoxBufferGeometry( 40, 40, 0 );

    startCube = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    startCube.position.x = 240;
    startCube.position.y = 0;
    startCube.position.z = -200;

    // scene.add( startCube );

    geometry = new THREE.BoxBufferGeometry( 40, 40, 20 );

    var xAmount = 140;
    var yAmount = -200;
    for ( var i = 0; i < 15; i ++ ) 
    {
        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        
        xAmount -= 80;
        if (i % 5 == 0) {
            yAmount += 100;
            xAmount = 140;
        }
        object.position.x = xAmount;
        object.position.y = yAmount;
        object.position.z = -200;
        
        sequenceCubes.push(object);
        scene.add( object );
    }
    
    scene.add( startCube );
    raycaster = new THREE.Raycaster();
    
    renderer.setPixelRatio( window.devicePixelRatio );
    
    document.addEventListener( 'mousemove', onDocumentMouseMove );
    document.
    addEventListener('mousedown', onDocumentMouseDown);
    
    window.addEventListener( 'resize', onWindowResize);
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
}

function onDocumentMouseMove( event ) 
{
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) 
    {
        if ( INTERSECTED != intersects[ 0 ].object ) 
        {
            if ( INTERSECTED )
                INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
    } 
    else 
    {
        if ( INTERSECTED ) 
            INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;
    }
}

function onDocumentMouseDown(event)
{
    event.preventDefault();

    if ( INTERSECTED != null ) {
        // console.log("Click");
        // console.log(sequenceCubes.length);
        spinCube(INTERSECTED);

        if (INTERSECTED == startCube) { //Si hace click en el cubo 
            indexPoint = 0;
            index = 0;
            document.getElementById("gameStart").innerHTML = "";
            document.getElementById("scoreboard").innerHTML = "Score " + scorePoints;
            animateSequence(); //Empezamos la animacion del cubo
            rotateAll();
            
            console.log("Start Game");
            // console.log(sequenceCubes); //Debugging
            // console.log(gameCubes);

            spinSequence();
        }
        // console.log(indexPoint); //Debugging
        // console.log(gameCubes[indexPoint]);
        else if ( INTERSECTED == sequenceCubes[gameCubes[indexPoint]]) { //Si hace click en uno correcto 
            indexPoint += 1;
            scorePoints += 1;
            console.log ("Total score: " + scorePoints);
            // console.log(sequenceCubes[gameCubes[indexPoint]]);
            document.getElementById("scoreboard").innerHTML = "Score " + scorePoints;

            if (indexPoint > index) {
                indexPoint = 0;
                index += 1;
                animateSequence();
                spinSequence();
            }
        }
        else { //Si clickea uno que no es, se termina el juego
            window.alert("You have clicked the wrong cube!\nTotal Score: " + scorePoints +"\nRestarting the Game"); //Le despliegamos su score al usuario
            location.reload();
        }
    }
}

function rotateAll() {
    for(let i = 0; i < 15; i++){
        spinCube(sequenceCubes[i]);
    }
}

function animateSequence() {
    gameCubes.push(Math.floor(Math.random() * Math.floor(15)));
    // console.log(gameCubes);
}

function run() 
{
    requestAnimationFrame( run );
    render();

    KF.update();
}

function render() 
{
    renderer.render( scene, camera );
}

function spinAnimation(specCube) { //Animacion basica de THREEJS del cubo que ya habiamos utilizado
    animator = new KF.KeyFrameAnimator;
    animator.init({ 
        interps:
            [
                { 
                    keys:[0, .5, 1], 
                    values:[
                            { y : 0 , x : 0},
                            { y : Math.PI  , x : Math.PI},
                            { y : Math.PI * 2, x : Math.PI * 2 },
                            ],
                    target:specCube.rotation
                },
            ],
        loop: false,
        duration:duration * 800,
        easing:TWEEN.Easing.Linear.None,
    });
}

function playAnimations(){
    animator.start();
}

//Girar Cubo especificado
function spinCube(specCube){
    spinAnimation(specCube);
    playAnimations(specCube);
}

//Funcion de alonso para girar el cubo en secuencia
//recorre gameArray, girando cada cubo para que el usuario vea la secuencia
function spinSequence() {
    var interval = setInterval(function () {
        
        // girar cubo específico
        spinCube(sequenceCubes[gameCubes[x]]);
        
        if (++x === index+1) { 
            window.clearInterval(interval); // detener iteración
            x = 0; // resetear
        }
    }, timeoutAmount + (x*timeoutAmount)); // incrementar el timeout amount para que no se overlapeen las animaciones
}