// ======================================================================
// global variables
// ======================================================================
// scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
// camera
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;
var camera, scene, renderer;
var cameraControls;
//lights
var hemisphereLight, shadowLight;
//for animations
var clock = new THREE.Clock();
var mixer;

// ======================================================================
// classes
// ======================================================================
//cube class
class Cube {
    constructor() {
        //make frame
        this.frame = new Frame('img/frame1.fbx');
        //make room Scene
        this.room = new Room('img/room1.fbx');
        //make animated person
        this.person = new Person('img/on-phone-2.fbx');
    }

    //getter functions

    //setter functions

    //methods
    loadAll() {
        this.frame.load();
        this.room.load();
        this.person.load();
    }
}

//frame class
class Frame {
    constructor(model) {
        this.model = model;
        this.frame = new THREE.FBXLoader();
        this.material = new THREE.MeshToonMaterial({
            color: 0xf4f8ff,
            transparent: true,
            opacity: 0.6,
            skinning: true

        });
    }

    //getter functions

    //setter functions

    //methods
    load() {
        var self = this;
        this.frame.load(this.model, function(object) {
            object.scale.x += 5;
            object.scale.y += 5;
            object.scale.z += 5;
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = self.material;
                }
            });
            scene.add(object);
        });
    }
}

//room class
class Room {
    constructor(model) {
        this.model = model;
        this.room = new THREE.FBXLoader();
        this.material = new THREE.MeshToonMaterial({
            color: 0xb3c4aa,
            skinning: true
        });

    }

    //getter functions

    //setter functions

    //methods
    load() {
        var self = this;
        this.room.load(this.model, function(object) {
            object.scale.x += 5;
            object.scale.y += 5;
            object.scale.z += 5;
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = self.material;
                }
            });
            scene.add(object);
        });
    }
}

//room class
class Person {
    constructor(model) {
        this.model = model;
        this.person = new THREE.FBXLoader();
        this.material = new THREE.MeshToonMaterial({
            color: 0xf9b9a7,
            skinning: true
        });
    }

    //getter functions

    //setter functions

    //methods
    load() {
        var self = this;
        this.person.load(this.model, function(object) {
            object.scale.x *= 0.3;
            object.scale.y *= 0.3;
            object.scale.z *= 0.3;
            mixer = new THREE.AnimationMixer(object);
            var action = mixer.clipAction(object.animations[0]);
            action.play();
            //action.timeScale =  0.2; //controls the speed of the animation
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = self.material;
                }
            });
            scene.add(object);
        });
    }
}

// ======================================================================
// call functions
// ======================================================================
init();
animate();



// ======================================================================
// define functions
// ======================================================================
function init() {
    if (WEBGL.isWebGLAvailable() === false) {
        document.body.appendChild(WEBGL.getWebGLErrorMessage());
    }
    var container = document.getElementById('container');

    createScene();
    createLights();
    createCubes();
    //make cube rotate
    //make many instances of cubes


}

function createScene() {
    // renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        //antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    container.appendChild(renderer.domElement);
    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(75, 75, 200);
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 30, 0);
    cameraControls.maxDistance = 800;
    cameraControls.minDistance = 10;
    cameraControls.update();
}

function createLights() {

    // var mainLight = new THREE.PointLight(0xcccccc, 1.5, 250);
    // mainLight.position.y = 60;
    // scene.add(mainLight);
    // var greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
    // greenLight.position.set(550, 50, 0);
    // scene.add(greenLight);
    // var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
    // redLight.position.set(-550, 50, 0);
    // scene.add(redLight);
    // var blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
    // blueLight.position.set(0, 50, 550);
    // scene.add(blueLight);

    //lights version 2
    // A hemisphere light is a gradient colored light;
    // the first parameter is the sky color, the second parameter is the ground color,
    // the third parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .5)

    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    shadowLight = new THREE.DirectionalLight(0xffffff, .8);

    // Set the direction of the light
    shadowLight.position.set(150, 350, 350);

    // Allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createCubes() {

    var cube1 = new Cube();
    cube1.loadAll();

}



function animate() {
    requestAnimationFrame(animate);
    //var timer = Date.now() * 0.01;

    // meshLoad.position.set(
    //     Math.cos(timer * 0.1) * 30,
    //     Math.abs(Math.cos(timer * 0.2)) * 20 + 5,
    //     Math.sin(timer * 0.1) * 30
    // );
    // meshLoad.rotation.y = (Math.PI / 2) - timer * 0.1;
    //meshLoad.rotation.z = timer * 0.8;

    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);


    renderer.render(scene, camera);
}
