//Frogger (Yoshier) - Seung Lee - A01021720

//Basicas de la escena
var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null;

//Objeto que va a ser lo que se va a mover
var objLoader = null;
var ambientLight = null;

var duration = 10000; // ms
var currentTime = Date.now();

//Nuestro jugador (yoshi)
var yoshi = null;

//Variables del stage
//Calles
var roads = [];
//Rios
var rivers = [];

//Obstaculos del juego
//Troncos
var logsR = [];
var logsL = [];

//Cars
var carsR = [];
var carsL = [];

//Trees
var trees = [];

//Score que vamos a llevar todo el tiempo
var scoreboard = "";
var score = 0;

var yoshiOnLog = true;

//Funcion para loadear a yoshi
function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        '../models/yoshi.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('../models/34B9EA81_c.png');
            var normalMap = new THREE.TextureLoader().load('../models/34B9EA81_c.png');

            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                }
            } );
                    
            yoshi = object;
            yoshi.scale.set(0.55,0.55,0.55);
            yoshi.position.set(0,-3,140);
            yoshi.rotation.set(0, 9.5, 0);
            //Diferentes rotaciones para usar despues
            // yoshi.rotation.set(0, 0, 0); //Down side
            // yoshi.rotation.set(0, 4.75, 0); //Left Side
            // yoshi.rotation.set(0, 14.25, 0); //Right side 
            yoshi.castShadow = true;
            yoshi.receiveShadow = true;
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

function animate() {
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    //Lucia me ayudo con la velocidad de los coches
    var fract = deltat / duration;
    var angle = Math.PI * 50 * fract;

    //Cars movement
    for(let i = 0; i < carsR.length; i++){ 
        carsR[i].position.x += angle;
        if(carsR[i].position.x > 280){
            carsR[i].position.x = -200;
        }
    }
    for(let i = 0; i< carsL.length; i++) {
        carsL[i].position.x -= angle;
        if(carsL[i].position.x < -200){
            carsL[i].position.x = 280;
        }
    }
    //Logs movements
    for(let i = 0; i < logsR.length; i++){ 
        logsR[i].position.x += angle;
        if(logsR[i].position.x > 230){
            logsR[i].position.x = -110;
        }
    }
    for(let i = 0; i< logsL.length; i++) {
        logsL[i].position.x -= angle;
        if(logsL[i].position.x < -110){
            logsL[i].position.x = 230;
        }
    }
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
    collisions();
}

function onKeyDown ( event )
{
    yoshiOnLog = false;
    switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
            if(yoshi.position.z >= -90) {
                yoshi.position.z -= 10;
                camera.position.z -= 10;
                score ++;
                scoreBoard = "Score:\t" + score + " points";
                document.getElementById("scoreboard").innerHTML = scoreBoard;
            }
            yoshi.rotation.set(0, 9.5, 0);
            break;

        case 37: // left
        case 65: // a
        if(yoshi.position.x >= -250) {
            yoshi.position.x -= 10;
            camera.position.x -= 10;
        }
            yoshi.rotation.set(0, 4.75, 0); //Left Side
            break;

        case 40: // down
        case 83: // s
            if(yoshi.position.z <= 130) {
                yoshi.position.z += 10;
                camera.position.z += 10;
                score --;
                scoreBoard = "Score:\t" + score + " points";
                document.getElementById("scoreboard").innerHTML = scoreBoard;
            }
            yoshi.rotation.set(0, 0, 0); //Down side
            break;

        case 39: // right
        case 68: // d
        if(yoshi.position.x <= 250){
            yoshi.position.x += 10;
            camera.position.x += 10;
        }
            yoshi.rotation.set(0, 14.25, 0); //Right side
            break;
    }
}

function createScene(canvas) {
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Create the objects
    loadObj();

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xccf9ff );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 30, 160);
    camera.rotation.set(-0.7, 0, 0);
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Agregar un ambient light para nuestra escena
    ambientLight = new THREE.AmbientLight ( 0xffffff );
    root.add(ambientLight);
    
    //Agregamos los controles para poder mover el objeto
    document.addEventListener( 'keydown', onKeyDown );

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    //Crear escena en donde se va a llevar el juego
    var stage = new THREE.Mesh(new THREE.PlaneGeometry(800, 300, 20, 20), new THREE.MeshPhongMaterial({color:0x33cc33, side:THREE.DoubleSide}));

    stage.rotation.x = -Math.PI / 2;
    stage.position.y = -4.02;
    // Add the mesh to our group
    group.add( stage );
    
    // Create obstacles and roads.
    createCars();
    createLogs();
    createRoads();
    createRivers();
    createTrees();

    scoreBoard = "Score:\t" + score + " points";
    document.getElementById("scoreboard").innerHTML = scoreBoard;

    // Now add the group to our scene
    scene.add( root );
}

//Funciones para crear obstaculos y otras cosas--------------------------------------------------------------------------------
//Funcion para crear los coches
function createCars() {
    //Tercera Calle
    posXRight = 200;
    posZRight = -40; // -40 ~ - 20 Z position
    for (let i = 0; i < 20; i++) {
        carsR[i] = new THREE.Mesh(new THREE.CubeGeometry(10,5,5), new THREE.MeshBasicMaterial({color:0x000000}));
        carsR[i].position.set(posXRight, 0, posZRight);

        posXRight -= Math.floor(Math.random() * 70) + 40;

        group.add(carsR[i]);

        if(i == 9) {
            posXRight = 200;
            posZRight = -20;
        }
    }

    //Segunda Calle
    posXRight = 200;
    posZRight = 20; // 20 ~ 40 Z position
    for (let i = 20; i < 40; i++) {
        carsR[i] = new THREE.Mesh(new THREE.CubeGeometry(10,5,5), new THREE.MeshBasicMaterial({color:0x000000}));
        carsR[i].position.set(posXRight, 0, posZRight);

        posXRight -= Math.floor(Math.random() * 70) + 40;

        group.add(carsR[i]);

        if(i == 29) {
            posXRight = 200;
            posZRight = 40;
        }
    }

    //Primera Calle
    posXRight = 200;
    posZRight = 100; // 100 ~ 120 Z position
    for (let i = 40; i < 60; i++) {
        carsR[i] = new THREE.Mesh(new THREE.CubeGeometry(10,5,5), new THREE.MeshBasicMaterial({color:0x000000}));
        carsR[i].position.set(posXRight, 0, posZRight);

        posXRight -= Math.floor(Math.random() * 70) + 40;

        group.add(carsR[i]);

        if(i == 49) {
            posXRight = 200;
            posZRight = 120;
        }
    }

    //Tercera Calle
    posXLeft = 200;
    posZLeft = -30; // 30 Z position
    for (let i = 0; i < 10; i++) {
        carsL[i] = new THREE.Mesh(new THREE.CubeGeometry(10,5,5), new THREE.MeshBasicMaterial({color:0x000000}));
        carsL[i].position.set(posXLeft, 0, posZLeft);

        posXLeft -= Math.floor(Math.random() * 60);

        group.add(carsL[i]);
    }

    //Segunda Calle
    posXLeft = 200;
    posZLeft = 30; // 30 Z position
    for (let i = 10; i < 20; i++) {
        carsL[i] = new THREE.Mesh(new THREE.CubeGeometry(10,5,5), new THREE.MeshBasicMaterial({color:0x000000}));
        carsL[i].position.set(posXLeft, 0, posZLeft);

        posXLeft -= Math.floor(Math.random() * 60);

        group.add(carsL[i]);
    }

    //Primera Calle
    posXLeft = 200;
    posZLeft = 110; // 110 Z position
    for (let i = 20; i < 30; i++) {
        carsL[i] = new THREE.Mesh(new THREE.CubeGeometry(10,5,5), new THREE.MeshBasicMaterial({color:0x000000}));
        carsL[i].position.set(posXLeft, 0, posZLeft);

        posXLeft -= Math.floor(Math.random() * 60);

        group.add(carsL[i]);
    }
}

//Funcion para crear las cosas de madera
function createLogs() {
    //Segundo Rio
    posXRight = 200;
    posZRight = -80; //-80 ~ - 60 Z position
    for (let i = 0; i < 20; i++) {
        logsR[i] = new THREE.Mesh(new THREE.CubeGeometry(15,1,5), new THREE.MeshBasicMaterial({color:0xCD853F}));
        logsR[i].position.set(posXRight, 0, posZRight);

        posXRight -= Math.floor(Math.random() * 70) + 40;

        group.add(logsR[i]);

        if(i == 9) {
            posXRight = 200;
            posZRight = -60;
        }
    }

    //Primer rio
    posXRight = 200;
    posZRight = 60; //60 ~ 80 Z position
    for (let i = 20; i < 40; i++) {
        logsR[i] = new THREE.Mesh(new THREE.CubeGeometry(15,1,5), new THREE.MeshBasicMaterial({color:0xCD853F}));
        logsR[i].position.set(posXRight, 0, posZRight);

        posXRight -= Math.floor(Math.random() * 70) + 40;

        group.add(logsR[i]);

        if(i == 29) {
            posXRight = 200;
            posZRight = 80;
        }
    }

    //Segundo Rio
    posXLeft = 200;
    posZLeft = -70; //-70 Z position
    for (let i = 0; i < 10; i++) {
        logsL[i] = new THREE.Mesh(new THREE.CubeGeometry(15,1,5), new THREE.MeshBasicMaterial({color:0xCD853F}));
        logsL[i].position.set(posXLeft, 0, posZLeft);

        posXLeft -= Math.floor(Math.random() * 70) + 40;

        group.add(logsL[i]);
    }

    //Primer rio
    posXLeft = 200;
    posZLeft = 70; //70 Z position
    for (let i = 10; i < 20; i++) {
        logsL[i] = new THREE.Mesh(new THREE.CubeGeometry(15,1,5), new THREE.MeshBasicMaterial({color:0xCD853F}));
        logsL[i].position.set(posXLeft, 0, posZLeft);

        posXLeft -= Math.floor(Math.random() * 70) + 40;

        group.add(logsL[i]);
    }
}

//Funcion para crear calles
function createRoads() {
    var posZ = 29;
    for(let i = 0; i < 3; i ++) {
        roads[i] = new THREE.Mesh(new THREE.PlaneGeometry(800,30), new THREE.MeshPhongMaterial({color:0xC0C0C0, side:THREE.DoubleSide}));

        roads[i].rotation.x = -Math.PI / 2;
        roads[i].position.y = -4;

        roads[i].position.z = posZ;

        if( i == 0 )
            posZ = -31;
        if( i == 1 )
            posZ = 109;
        
        group.add( roads[i] );
    }
}

function createRivers() {
    var posZ = 68;
    for(let i = 0; i < 2; i++) {
        rivers[i] = new THREE.Mesh(new THREE.PlaneGeometry(800,30), new THREE.MeshPhongMaterial({color:0x3232ff, side:THREE.DoubleSide}));

        rivers[i].rotation.x = -Math.PI / 2;
        rivers[i].position.y = -4;

        rivers[i].position.z = posZ;

        if( i == 0 )
            posZ = -72;
        
        group.add( rivers[i] );
    }
}

function createTrees() {
    posX = 200;
    posZ = 90;
    for(let i = 0; i < 7; i++) {
        trees[i] = new THREE.Mesh(new THREE.CubeGeometry(7,20,7), new THREE.MeshPhongMaterial({color:0x004c00}));
        trees[i].position.set(posX, -3, posZ);

        posX -= Math.floor(Math.random() * 100) + 10; 
        group.add(trees[i]);
    }

    posX = 200;
    posZ = 10;
    for(let i = 7; i < 17; i++) {
        trees[i] = new THREE.Mesh(new THREE.CubeGeometry(7,20,7), new THREE.MeshPhongMaterial({color:0x004c00}));
        trees[i].position.set(posX, -3, posZ);

        posX -= Math.floor(Math.random() * 100) + 10; 
        group.add(trees[i]);
    }

    posX = 200;
    posZ = -10;
    for(let i = 17; i < 27; i++) {
        trees[i] = new THREE.Mesh(new THREE.CubeGeometry(7,20,7), new THREE.MeshPhongMaterial({color:0x004c00}));
        trees[i].position.set(posX, -3, posZ);

        posX -= Math.floor(Math.random() * 100) + 10; 
        group.add(trees[i]);
    }
}

//Funcion de colisiones --------------------------------------------------------------------------
function collisions() {
    //Funcion de colision de CarsL
    for(let i = 0; i < carsL.length; i++) {
        if(yoshi.position.z <= carsL[i].position.z + 3 && yoshi.position.z >= carsL[i].position.z -3) {
            if(yoshi.position.x <= carsL[i].position.x + 5 && yoshi.position.x >= carsL[i].position.x - 5) {
                restart();   
            }
        }
    }
    for(let i = 0; i < carsR.length; i++) {
        if(yoshi.position.z <= carsR[i].position.z + 3 && yoshi.position.z >= carsR[i].position.z -3) {
            if(yoshi.position.x <= carsR[i].position.x + 5 && yoshi.position.x >= carsR[i].position.x - 5) {
                restart();   
            }
        }
    }
    //Funcion de colision de troncos
    for(let i = 0; i < logsR.length; i++) {
        if((yoshi.position.z <= rivers[0].position.z + 20 && yoshi.position.z >= rivers[0].position.z - 10) || 
        (yoshi.position.z <= rivers[1].position.z + 20 && yoshi.position.z >= rivers[1].position.z - 10)) {
            if(yoshi.position.z <= logsR[i].position.z + 3 && yoshi.position.z >= logsR[i].position.z -3) {
                if(yoshi.position.x <= logsR[i].position.x + 8 && yoshi.position.x >= logsR[i].position.x - 8) {
                    yoshi.position.z = logsR[i].position.z;
                    yoshi.position.x = logsR[i].position.x;
                    camera.position.x = logsR[i].position.x;
                    yoshi.position.y = 2;
                    yoshiOnLog = true;
                }
            } else {
                yoshi.position.y -= 0.1;
                yoshiOnLog = false;
                if(yoshiOnLog == false && yoshi.position.y <= -25) {
                    restart();
                }
            }
        }
    }
    for(let i = 0; i < logsL.length; i++) {
        if((yoshi.position.z <= rivers[0].position.z + 20 && yoshi.position.z >= rivers[0].position.z - 10) || 
        (yoshi.position.z <= rivers[1].position.z + 20 && yoshi.position.z >= rivers[1].position.z - 10)) {
            if(yoshi.position.z <= logsL[i].position.z + 3 && yoshi.position.z >= logsL[i].position.z -3) {
                if(yoshi.position.x <= logsL[i].position.x + 8 && yoshi.position.x >= logsL[i].position.x - 8) {
                    yoshi.position.z = logsL[i].position.z;
                    yoshi.position.x = logsL[i].position.x;
                    camera.position.x = logsL[i].position.x;
                    yoshi.position.y = 1;
                    yoshiOnLog = true;
                }
            } else {
                yoshi.position.y -= 0.1;
                yoshiOnLog = false;
                if(yoshiOnLog == false && yoshi.position.y <= -25) {
                    restart();
                }
            }
        }
    }
    //Funcion de colision con el agua
    // for(let i = 0; i < rivers.length; i++) {
    //     if(yoshiOnLog == false) {
    //         if (yoshi.position.z <= rivers[i].position.z + 20) {
    //             restart();
    //         }
    //     }
    // }
    //Funcion de colision con los arboles (si choca contra un arbol)
    for(let i = 0; i < trees.length; i++) {
        if(yoshi.position.z <= trees[i].position.z + 3 && yoshi.position.z >= trees[i].position.z -3) {
            if(yoshi.position.x <= trees[i].position.x + 5 && yoshi.position.x >= trees[i].position.x - 5) {
                restart();   
            }
        }
    }
    if(yoshi.position.z <= -100)
        wonGame();
}

function restart() {
    camera.position.set(0, 130, 170);
    camera.rotation.set(-1, 0, 0);
    yoshi.position.set(0,-3,140);
    yoshi.rotation.set(0, 9.5, 0);
    scoreBoard = "You have lost the game! The game will restart in 3 seconds";
    document.getElementById("scoreboard").innerHTML = scoreBoard;
    var interval = setInterval(function () {
        location.reload();
    }, 2500);
}

function wonGame() {
    scoreBoard = "You have WON YOSHIER! CONGRATULATIONS! The game will restart in 3 seconds";
    document.getElementById("scoreboard").innerHTML = scoreBoard;
    var interval = setInterval(function () {
        location.reload();
    }, 3000);
}