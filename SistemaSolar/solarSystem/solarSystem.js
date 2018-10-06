//Seung Hoon Lee Kim
//A01021720
//Tarea 3 - Sistema solar

//Global variables
var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null;

var map = null;
var normalMap = null;
var specularMap = null;

//Planets to do
var mercury = null,
earth = null,
venus = null,
mars = null,
jupiter = null,
saturn = null,
uranus = null,
neptune = null,
pluto = null;

//Stars to do
var sun = null;

//Moons to do
var moon = null;

//Asteroids
var asteroidNum = 15; //Amount of asteroids that will exist in our solar system
var asteroids = [];
var asteroidsOrbit = [];

//Textures of the planets
var materials = {};
var earthUrl = "../images/earth_normal_2048.jpg";
var materialEarth = {};
var mercuryUrl = "../images/mercurymap.jpg";
var materialMercury = {};
var venusUrl = "../images/venusmap.jpg";
var materialVenus = {};
var marsUrl = "../images/marsmap.jpg";
var materialMars = {};
var jupiterUrl = "../images/jupitermap.jpg";
var materialJupiter = {};
var saturnUrl = "../images/saturnmap.jpg";
var materialSaturn = {};
var uranusUrl = "../images/uranusmap.jpg";
var materialUranus = {};
var neptuneUrl = "../images/neptunemap.jpg";
var materialNeptune = {};
var plutoUrl = "../images/plutomap.jpg";
var materialPluto = {};

//Texture of asteroids
var asteroidsUrl = "../images/asteroidmap.jpg";
var materialAsteroids = {};

//TExture of moon
var moonUrl = "../images/moon_1024.jpg";
var materialMoon = {};
var marsMoonUrl = "../images/marsmoon.jpg";
var materialMarsMoon = {};
var marsMoon2Url = "../images/marsmoon2.jpg";
var materialMarsMoon2 = {};

//Rings of planets
var saturnRingUrl = "../images/saturnring.jpg";
var materialSaturnRing = {};
var uranusRingUrl = "../images/uranusring.jpg";
var materialUranusRing = {};

//Texture of stars
var sunUrl = "../images/sunmap.jpg";
var materialSun = {};


var duration = 10000; // ms
var currentTime = Date.now();
function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;

    // Rotate the sphere group about its Y axis
    group.rotation.y += angle;

    //Sun rotation
    sun.rotation.y += angle;

    //Planet rotations
    mercury.rotation.y += angle;
    venus.rotation.y += angle;
    earth.rotation.y += angle;  
    moon.rotation.y += angle;
    mars.rotation.y += angle;
    jupiter.rotation.y += angle;
    saturn.rotation.y += angle;
    uranus.rotation.y += angle;
    neptune.rotation.y += angle;
    pluto.rotation.y += angle;

    //Planet orbits
    mercuryOrbit.rotation.y += (Math.PI*3) * fract;
    venusOrbit.rotation.y += (Math.PI*2) * fract;
    earthOrbit.rotation.y += (Math.PI) * fract;
    marsOrbit.rotation.y += (Math.PI/2) * fract;
    jupiterOrbit.rotation.y += (Math.PI/3) * fract ;
    saturnOrbit.rotation.y += (Math.PI/5) * fract;
    uranusOrbit.rotation.y -= (Math.PI/4) * fract;
    neptuneOrbit.rotation.y -= (Math.PI/3) * fract ;
    plutoOrbit.rotation.y -= (Math.PI/6) * fract;

    // //Moon orbits
    moonOrbit.rotation.y += angle * 5;
    moonOrbit.rotation.x += angle;
    marsMoonOrbit.rotation.y += angle * 4;
    marsMoonOrbit.rotation.x += angle
    marsMoon2Orbit.rotation.y += angle * 6;
    marsMoon2Orbit.rotation.x += angle

    //Ring orbits
    saturnRingOrbit.rotation.y += angle * 0.2;
    saturnRingOrbit.rotation.x += angle * 0.5;
    uranusRingOrbit.rotation.y += angle * 5;
    uranusRingOrbit.rotation.x += angle * 2;

    //Asteroids movements
    for (i = 0; i < asteroidNum; i++){
        f = (Math.random() * 2);
        asteroidsOrbit[i].rotation.y += (Math.PI*f) * fract;
    }
}

function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        animate();
}

function createMaterials()
{
    // Create a textre phong material for the cube
    // First, create the texture map
    sun = new THREE.TextureLoader().load(sunUrl);
    earth = new THREE.TextureLoader().load(earthUrl);
    mercury = new THREE.TextureLoader().load(mercuryUrl);
    venus = new THREE.TextureLoader().load(venusUrl);
    mars = new THREE.TextureLoader().load(marsUrl);
    jupiter = new THREE.TextureLoader().load(jupiterUrl);
    saturn = new THREE.TextureLoader().load(saturnUrl);
    uranus = new THREE.TextureLoader().load(uranusUrl);
    neptune = new THREE.TextureLoader().load(neptuneUrl);
    pluto = new THREE.TextureLoader().load(plutoUrl);

    //Loading del moon
    moon = new THREE.TextureLoader().load(moonUrl);
    marsMoon = new THREE.TextureLoader().load(marsMoonUrl);
    marsMoon2 = new THREE.TextureLoader().load(marsMoon2Url);

    //Loading del ring
    saturnRing = new THREE.TextureLoader().load(saturnRingUrl);
    uranusRing= new THREE.TextureLoader().load(uranusRingUrl);

    //Loading del asteroide
    asteroids = new THREE.TextureLoader().load(asteroidsUrl);

    //Loading de los planetas
    materialSun["phong-normal"] = new THREE.MeshBasicMaterial({ map: sun});
    materialEarth["phong-normal"] = new THREE.MeshPhongMaterial({map: earth});
    materialMercury["phong-normal"] = new THREE.MeshPhongMaterial({map: mercury});
    materialVenus["phong-normal"] = new THREE.MeshPhongMaterial({map: venus});
    materialMars["phong-normal"] = new THREE.MeshPhongMaterial({map: mars});
    materialJupiter["phong-normal"] = new THREE.MeshPhongMaterial({map: jupiter});
    materialSaturn["phong-normal"] = new THREE.MeshPhongMaterial({map: saturn});
    materialUranus["phong-normal"] = new THREE.MeshPhongMaterial({map: uranus});
    materialNeptune["phong-normal"] = new THREE.MeshPhongMaterial({map: neptune});
    materialPluto["phong-normal"] = new THREE.MeshPhongMaterial({map: pluto});

    //Loading de las lunas
    materialMoon["phong-normal"] = new THREE.MeshPhongMaterial({map: moon});
    materialMarsMoon["phong-normal"] = new THREE.MeshPhongMaterial({map: marsMoon});
    materialMarsMoon2["phong-normal"] = new THREE.MeshPhongMaterial({map: marsMoon2});

    //Loading de los rings
    materialSaturnRing["phong-normal"] = new THREE.MeshPhongMaterial({map: saturnRing});
    materialUranusRing["phong-normal"] = new THREE.MeshPhongMaterial({map: uranusRing});

    //Loading de asteroide
    materialAsteroids["phong-normal"] = new THREE.MeshPhongMaterial({map: asteroids});

    //Ejemplo en clase
    materials["phong"] = new THREE.MeshPhongMaterial({ map: map });
}

function setMaterialColor(r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    //Material of the sun
    materialSun["phong-normal"].color.setRGB(r, g, b);

    //Material of asteroids
    materialAsteroids["phong-normal"].color.setRGB(r, g, b);

    //Material of moon
    materialMoon["phong-normal"].color.setRGB(r, g, b);
    materialMarsMoon["phong-normal"].color.setRGB(r, g, b);
    materialMarsMoon2["phong-normal"].color.setRGB(r, g, b);

    //Material of Rings
    materialSaturnRing["phong-normal"].color.setRGB(r, g, b);
    materialUranusRing["phong-normal"].color.setRGB(r, g, b);

    //Material of planets
    materialEarth["phong-normal"].color.setRGB(r, g, b);
    materialMercury["phong-normal"].color.setRGB(r, g, b);
    materialVenus["phong-normal"].color.setRGB(r, g, b);
    materialMoon["phong-normal"].color.setRGB(r, g, b);
    materialMars["phong-normal"].color.setRGB(r, g, b);
    materialJupiter["phong-normal"].color.setRGB(r, g, b);
    materialSaturn["phong-normal"].color.setRGB(r, g, b);
    materialUranus["phong-normal"].color.setRGB(r, g, b);
    materialNeptune["phong-normal"].color.setRGB(r, g, b);
    materialPluto["phong-normal"].color.setRGB(r, g, b);
    materials["phong"].color.setRGB(r, g, b);
    materials["phong-normal"].color.setRGB(r, g, b);
}

function setMaterialSpecular(r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    materials["phong"].specular.setRGB(r, g, b);
    materials["phong-normal"].specular.setRGB(r, g, b);
}

//Function to set the material for the planets
var materialName = "phong-normal";	
function setMaterialPlanet(name) {
    sun.material = materialSun[name];
    mercury.material = materialMercury[name];
    venus.materialEarth = materialVenus[name];
    earth.material = materialEarth[name];
    mars.material = materialMars[name];
    jupiter.material = materialJupiter[name];
    saturn.material = materialSaturn[name];
    uranus.material = materialUranus[name];
    neptune.material = materialNeptune[name];
    pluto.material = materialPluto[name];
    moon.material = materialMoon[name];
}

function setMaterialMoons(name) {
    moon.material = materialMoon[name];
    marsMoon.material = materialMarsMoon[name];
    marsMoon2.material = materialMarsMoon2[name];
    saturnRing.material = materialSaturnRing[name];
    uranusRing.material = materialUranusRing[name];
}

//Function to set the materials for the asteroids
function setMaterialAsteroid(name) {
    for (let i = 0; i < asteroidNum; i++)
        asteroids.material = materialAsteroids[name];
}

function createSystem() {
    var material = new THREE.MeshBasicMaterial( {color: 0xB5987A , side: THREE.DoubleSide } );


    //Put geometry sizes with materials to the planets
    sun = new THREE.Mesh(new THREE.SphereGeometry(3.5, 20, 20), materialSun["phong-normal"]);
    mercury = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 20), materialMercury["phong-normal"]);
    venus = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), materialVenus["phong-normal"]);
    earth = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), materialEarth["phong-normal"]);
    mars = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), materialMars["phong-normal"]);
    jupiter = new THREE.Mesh(new THREE.SphereGeometry(2.5, 20, 20), materialJupiter["phong-normal"]);
    saturn = new THREE.Mesh(new THREE.SphereGeometry(1.5, 20, 20), materialSaturn["phong-normal"]);
    uranus = new THREE.Mesh(new THREE.SphereGeometry(1.5, 20, 20), materialUranus["phong-normal"]);
    neptune = new THREE.Mesh(new THREE.SphereGeometry(1.5, 20, 20), materialNeptune["phong-normal"]);
    pluto = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), materialPluto["phong-normal"]);

    //Orbit positions
    //Some positions were relatively set
    mercury.position.set(2.5, 0, 0);
    venus.position.set(5,0,0);
    earth.position.set(7.5,0,0);
    mars.position.set(10,0,0);
    jupiter.position.set(15,0,0);
    saturn.position.set(20,0,0);
    uranus.position.set(25,0,0);
    neptune.position.set(27.5,0,0);
    pluto.position.set(30,0,0);

    setMaterialPlanet("phong-normal");

    //Orbit movement
    mercuryOrbit = new THREE.Group();
    venusOrbit = new THREE.Group();
    earthOrbit = new THREE.Group();
    marsOrbit = new THREE.Group();
    jupiterOrbit = new THREE.Group();
    saturnOrbit = new THREE.Group();
    uranusOrbit = new THREE.Group();
    neptuneOrbit = new THREE.Group();
    plutoOrbit = new THREE.Group();

    //Create the light and its position
    var light = new THREE.PointLight( 0xffffff, 3, 0, 10);
    light.position.set( 0, 0, 0 );
    light.add(sun)
    root.add( light );

    //Orbit rings
    var ringMercury = new THREE.Mesh( new THREE.RingGeometry( 2.55, 2.55, 32 ), material );
    var ringVenus = new THREE.Mesh( new THREE.RingGeometry( 5.05, 5.07, 32 ), material );
    var ringEarth = new THREE.Mesh( new THREE.RingGeometry( 7.55, 7.57, 32 ), material );
    var ringMars = new THREE.Mesh( new THREE.RingGeometry( 10.05, 10.07, 32 ), material );
    var ringJupiter = new THREE.Mesh( new THREE.RingGeometry( 15, 15.02, 32 ), material );
    var ringSaturn = new THREE.Mesh( new THREE.RingGeometry( 20, 20.02, 32 ), material );
    var ringSaturn_planet = new THREE.Mesh( new THREE.RingGeometry( 0.70, 1, 32 ), material );
    var ringUranus = new THREE.Mesh( new THREE.RingGeometry( 25, 25.02, 32 ), material );
    var ringNeptune = new THREE.Mesh( new THREE.RingGeometry( 27.5, 27.52, 32 ), material );
    var ringPluto = new THREE.Mesh( new THREE.RingGeometry( 30, 30.02, 32 ), material );

    //Set the rotation of our rings
    let rotationRing = 55
    ringMercury.rotation.x = rotationRing;
    ringVenus.rotation.x = rotationRing;
    ringEarth.rotation.x = rotationRing;
    ringMars.rotation.x = rotationRing;
    ringJupiter.rotation.x = rotationRing;
    ringSaturn.rotation.x = rotationRing;
    ringSaturn_planet.rotation.x = rotationRing;
    ringUranus.rotation.x = rotationRing;
    ringNeptune.rotation.x = rotationRing;
    ringPluto.rotation.x = rotationRing;

    //Add the sun to our group
    group.add(sun);

    //Add all the plaents to our sun
    sun.add(mercuryOrbit);
    sun.add(venusOrbit);
    sun.add(earthOrbit);
    sun.add(marsOrbit);
    sun.add(jupiterOrbit);
    sun.add(saturnOrbit);
    sun.add(uranusOrbit);
    sun.add(neptuneOrbit);
    sun.add(plutoOrbit);

    //Add the rings of the planets into our sun too
    sun.add( ringMercury );
    sun.add( ringVenus );
    sun.add( ringMars );
    sun.add( ringEarth );
    sun.add( ringJupiter );
    sun.add( ringSaturn );
    saturn.add( ringSaturn_planet );
    sun.add( ringUranus );
    sun.add( ringNeptune );
    sun.add( ringPluto );

    //Add the orbit to 
    mercuryOrbit.add(mercury);
    venusOrbit.add(venus);
    earthOrbit.add(earth);
    marsOrbit.add(mars);
    jupiterOrbit.add(jupiter);
    saturnOrbit.add(saturn);
    uranusOrbit.add(uranus);
    neptuneOrbit.add(neptune);
    plutoOrbit.add(pluto);
}

//Left off here-------------------------------------------------2/17/2018
function createMoons() {
    //Earth moon
    moon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), materialMoon["phong-normal"]);
    moon.position.set(1.2, 0, 0);
    moonOrbit = new THREE.Group();

    //Set materials
    setMaterialMoons("phong-normal");

    // Add the moon the planet
    earth.add(moonOrbit)
    moonOrbit.add(moon);


    //Mars moon Phobos
    marsMoon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), materialMarsMoon["phong-normal"]);
    marsMoon.position.set(1.2, 0, 0);
    marsMoonOrbit = new THREE.Group();

    //Set materials for mars moon
    setMaterialMoons("phong-normal");

    //Add the moon to the planet
    mars.add(marsMoonOrbit);
    marsMoonOrbit.add(marsMoon);

    //Mars moon Deibos
    marsMoon2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), materialMarsMoon2["phong-normal"]);
    marsMoon2.position.set(-1.2, 0, 0);
    marsMoon2Orbit = new THREE.Group();

    //Set materials for mars moon
    setMaterialMoons("phong-normal");

    //Add the moon to the planet
    mars.add(marsMoon2Orbit);
    marsMoon2Orbit.add(marsMoon2);

    // var ringJupiter = new THREE.Mesh( new THREE.RingGeometry( 1.5, 20, 20 ), material );
    //SaturnRing
    saturnRing = new THREE.Mesh( new THREE.RingGeometry( 2, 1, 20 ), materialSaturnRing["phong-normal"]);
    saturnRing.position.set(0.3,0,0);
    saturnRingOrbit = new THREE.Group();

    //Set materials for saturn
    setMaterialMoons("phong-normal");

    //Add the moon to the planet
    saturn.add(saturnRingOrbit);
    saturnRingOrbit.add(saturnRing);

    //Add uranus Ring
    uranusRing = new THREE.Mesh( new THREE.RingGeometry( 2, 1, 20 ), materialSaturnRing["phong-normal"]);
    uranusRing.position.set(0.5,0,0);
    uranusRingOrbit = new THREE.Group();

    //Set materials for saturn
    setMaterialMoons("phong-normal");

    //Add the moon to the planet
    uranus.add(uranusRingOrbit);
    uranusRingOrbit.add(uranusRing);
}

function createAsteroids() {
    asteroidIndex = 0
    counter = 10
    asteroidPos = 0
    for (i = 0; i < asteroidNum; i++) {
        if (asteroidIndex < counter){
            asteroids[i] = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), materialAsteroids["phong-normal"]);
            asteroids[i].position.set(2+asteroidPos, 0, 0 );
        }
        asteroidIndex ++;
        counter += 10;
        asteroidPos += 0.5
    }

    setMaterialAsteroid("phong-normal");

    for (i = 0; i < asteroidNum/5; i++) {
        asteroidsOrbit[i] = new THREE.Group();
        mercury.add(asteroidsOrbit[i]);
        asteroidsOrbit[i].add(asteroids[i]);  
    }
    for (i = asteroidNum/5; i < asteroidNum*2/5; i++) {
        asteroidsOrbit[i] = new THREE.Group();
        venus.add(asteroidsOrbit[i]);
        asteroidsOrbit[i].add(asteroids[i]);  
    }
    for (i = asteroidNum*2/5; i < asteroidNum*3/5; i++) {
        asteroidsOrbit[i] = new THREE.Group();
        jupiter.add(asteroidsOrbit[i]);
        asteroidsOrbit[i].add(asteroids[i]);  
    }
    for (i = asteroidNum*3/5; i < asteroidNum*4/5; i++) {
        asteroidsOrbit[i] = new THREE.Group();
        saturn.add(asteroidsOrbit[i]);
        asteroidsOrbit[i].add(asteroids[i]);  
    }
    for (i = asteroidNum*4/5; i < asteroidNum; i++) {
        asteroidsOrbit[i] = new THREE.Group();
        uranus.add(asteroidsOrbit[i]);
        asteroidsOrbit[i].add(asteroids[i]);  
    }


}

function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Create the background
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );
    var galaxyUrl = "../images/Galaxy.jpg";
    galaxy = new THREE.TextureLoader().load(galaxyUrl);
    scene.background = galaxy;

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 70;
    camera.position.y = 3;
    camera.rotation.z = -0.3;
    camera.rotation.x = -0.2;
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    //Ambient light
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create all the materials
    createMaterials();
        
    // Group position
    group.position.set(0,0,0);

    //Create our solar system with our planets
    createSystem();

    //Create our moons and rings for saturn and uranus
    createMoons();

    //Create the asteroids surrounding it
    createAsteroids();

    // Now add the group to our scene
    scene.add( root );
}

function rotateScene(deltax)
{
    root.rotation.x += deltax / 100;
    $("#rotation").html("rotation: 0," + root.rotation.x.toFixed(2) + ",0");
}

function scaleScene(scale)
{
    root.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}