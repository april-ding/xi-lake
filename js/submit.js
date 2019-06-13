// ======================================================================
// JQuery
// ======================================================================
var aboutVisible = false;
$("#about").click(function() {

  if (!aboutVisible) {
    $("#about-text").css("visibility", "visible");
    aboutVisible = true;
  } else if (aboutVisible) {
    $("#about-text").css("visibility", "hidden");
    aboutVisible = false;
  }

});

var cyoVisible = false;
$("#create").click(function() {

  if (!cyoVisible) {
    for (var i = 0; i < cubeNum; i++) {
      console.log("hid " + i);

      frameObject[i].children[0].material.visible = true;
      roomObject[i].children[0].material.visible = true;
      personObject[i].children[0].material.visible = true;
      boundaryBoxObject[i].children[0].material.visible = true;
    }
    $(".form").css("visibility", "visible");
    cyoVisible = true;
  } else if (cyoVisible) {
    $(".form").css("visibility", "hidden");
    cyoVisible = false;
  }
});

var exitCamera = false;
$("#back").click(function() {
  exitCamera = true;
});


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
var FAR = 800;
var activeCamera, camera1, camera2, scene, renderer;
var camera1Controls, camera2Controls;
//lights
var hemisphereLight, shadowLight;
//for animations
var clock = new THREE.Clock();
var mixer = [];

var cubeNum = 1;

//cubes
var cube = [];
var frameObject = [],
  roomObject = [],
  personObject = [],
  boundaryBoxObject = [];

var texture = THREE.ImageUtils.loadTexture('img/texture3.jpg');
//import paths
var framePath = 'img/frame1.fbx';
var roomPath = 'img/room1.fbx';
var personPath = 'img/person-3.fbx';
var boundaryBoxPath = 'img/boundary-box.fbx';
//raycasting
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var raycaster2 = new THREE.Raycaster();
var mouse2 = new THREE.Vector2();



// ======================================================================
// classes
// ======================================================================
//cube class
class Cube {

  constructor(framePath, roomPath, personPath, boundaryBoxPath, i) {
    //make frame
    this.frame = new Frame(framePath);
    //make room Scene
    this.room = new Room(roomPath);
    //make animated person
    this.person = new Person(personPath);
    //make boundaryBox
    this.boundaryBox = new BoundaryBox(boundaryBoxPath);
    //index
    this.i = i;
  }


  //getter functions

  //setter functions

  //methods
  loadAll() {

    this.frame.load(this.i);
    this.room.load(this.i);
    this.person.load(this.i);
    this.boundaryBox.load(this.i);
  }
  loadFrame(){
    this.frame.load(this.i);
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
  load(i) {

    var self = this;
    this.frame.load(this.model, function(object) {
      frameObject.push(object);

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


      scene.add(frameObject[i]);
    });
  }


}

//room class
class Room {
  constructor(model) {
    this.model = model;
    this.room = new THREE.FBXLoader();
    this.material = new THREE.MeshToonMaterial({
      //color: 0xb3c4aa,
      color: Math.random() * 0xffffff,
      skinning: true
    });

  }

  //getter functions

  //setter functions

  //methods
  load(i) {
    var self = this;
    this.room.load(this.model, function(object) {
      roomObject.push(object);
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
      scene.add(roomObject[i]);
    });
  }
}

//room class
class Person {
  constructor(model) {
    this.model = model;
    this.person = new THREE.FBXLoader();
    this.material = new THREE.MeshToonMaterial({
      //color: 0xf9b9a7,
      color: Math.random() * 0xffffff,
      skinning: true,
      //map: texture,
      //wireframe: true
    });
  }

  //getter functions

  //setter functions

  //methods
  load(i) {
    var self = this;
    this.person.load(this.model, function(object) {
      personObject.push(object);
      // object.scale.x *= 0.3;
      // object.scale.y *= 0.3;
      // object.scale.z *= 0.3;
      object.scale.x *= 3;
      object.scale.y *= 3;
      object.scale.z *= 3;
      mixer.push(new THREE.AnimationMixer(object));
      var action = mixer[i].clipAction(object.animations[0]);
      action.play();
      //action.timeScale =  0.2; //controls the speed of the animation
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = self.material;
        }
      });
      scene.add(personObject[i]);
    });
  }
}
//room class
class BoundaryBox {
  constructor(model) {
    this.model = model;
    this.boundaryBox = new THREE.FBXLoader();
    this.material = new THREE.MeshToonMaterial({
      transparent: true,
      opacity: 0.5
    });

  }

  //getter functions

  //setter functions;

  //methods
  load(i) {
    var self = this;
    this.boundaryBox.load(this.model, function(object) {
      boundaryBoxObject.push(object);
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
      scene.add(boundaryBoxObject[i]);
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


  activeCamera = camera1;

  window.addEventListener('resize', onWindowResize, false);
//  document.addEventListener('mousemove', onDocumentMouseMove, false);
  //document.addEventListener('mousedown', onDocumentMouseDown, false);

}

//normal functions

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
  // camera1
  camera1 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera1.position.set(75, 75, 200);
  camera1Controls = new THREE.OrbitControls(camera1, renderer.domElement);
  camera1Controls.target.set(0, 30, 0);
  camera1Controls.maxDistance = 800;
  camera1Controls.minDistance = 10;
  camera1Controls.enableZoom = false;
  camera1Controls.enableRotate = false;
  camera1Controls.update();
  //camera2
  camera2 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera2.position.set(30, 50, 0);
  camera2Controls = new THREE.OrbitControls(camera2, renderer.domElement);
  camera2Controls.target.set(0, 30, 0);
  camera2Controls.maxDistance = 800;
  camera2Controls.minDistance = 10;
  camera2Controls.enableZoom = false;
  camera2Controls.update();
}

function createLights() {
  // //light version 1
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
  for (var i = 0; i < cubeNum; i++) {
    cube.push(new Cube(framePath, roomPath, personPath, boundaryBoxPath, i));
  }
  // for (var i = 0; i < cubeNum; i++) {
  //   cube[i].loadAll();
  // }
  cube[0].loadFrame();

}



function checkCamera() {

  if (activeCamera === camera1) {
    $('#back').css({
      "visibility": "hidden"
    });
  } else {
    $('#back').css({
      "visibility": "visible"
    });
  }

  if (activeCamera === camera2) {
    if (exitCamera) {
      activeCamera = camera1;
      exitCamera = false;
    }
  }
}


function cubeOffsets() {
  //reset all cubes' visibility
  if (activeCamera === camera1) {
    for (var i = 0; i < cubeNum; i++) {

      frameObject[i].children[0].material.visible = true;
      // roomObject[i].children[0].material.visible = true;
      // personObject[i].children[0].material.visible = true;
      // boundaryBoxObject[i].children[0].material.visible = true;
    }

    //offset cube1
    // frameObject[1].position.x = 100;
    // roomObject[1].position.x = 100;
    // personObject[1].position.x = 100;
    // boundaryBoxObject[1].position.x = 100;
    //
    // frameObject[1].position.z = -200;
    // roomObject[1].position.z = -200;
    // personObject[1].position.z = -200;
    // boundaryBoxObject[1].position.z = -200;
    //
    // frameObject[1].position.y = -50;
    // roomObject[1].position.y = -50;
    // personObject[1].position.y = -50;
    // boundaryBoxObject[1].position.y = -50;


    //offset cube2
    // frameObject[2].position.x = -200;
    // roomObject[2].position.x = -200;
    // personObject[2].position.x = -200;
    // boundaryBoxObject[2].position.x = -200;
    //
    // frameObject[2].position.z = -50;
    // roomObject[2].position.z = -50;
    // personObject[2].position.z = -50;
    // boundaryBoxObject[2].position.z = -50;
    //
    // //offset cube3
    // frameObject[3].position.x = -300;
    // roomObject[3].position.x = -300;
    // personObject[3].position.x = -300;
    // boundaryBoxObject[3].position.x = -300;
    //
    // frameObject[3].position.y = -150;
    // roomObject[3].position.y = -150;
    // personObject[3].position.y = -150;
    // boundaryBoxObject[3].position.y = -150;
    //
    // frameObject[3].position.z = -200;
    // roomObject[3].position.z = -200;
    // personObject[3].position.z = -200;
    // boundaryBoxObject[3].position.z = -200;

  }

  //make cubes rotate
  for (var i = 0; i < cubeNum; i++) {
    frameObject[i].rotation.y += 0.001;
    // roomObject[i].rotation.y += 0.001;
    // personObject[i].rotation.y += 0.001;
    // boundaryBoxObject[i].rotation.y += 0.001;
  }
}

function spinOnHover() {
  raycaster.setFromCamera(mouse, activeCamera);
  var intersects;
  for (var i = 0; i < cubeNum; i++) {
    intersects = raycaster.intersectObject(boundaryBoxObject[i], true);
    if (intersects.length > 0) {
      frameObject[i].rotation.y += 0.1;
      roomObject[i].rotation.y += 0.1;
      personObject[i].rotation.y += 0.1;
      boundaryBoxObject[i].rotation.y += 0.1;

    }
  }
}


// ======================================================================
// animation & render
// ======================================================================

function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();
  for (var i = 0; i < cubeNum; i++) {
    if (mixer[i]) {
      mixer[i].update(delta);
    }
  }
  cubeOffsets();
  //spinOnHover();

  checkCamera();
  renderer.render(scene, activeCamera);
}



// ======================================================================
// event listener definitions
// ======================================================================
function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse2.x = ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1;
  mouse2.y = -((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;

  raycaster2.setFromCamera(mouse2, activeCamera);
  var intersects2;
  for (var i = 0; i < cubeNum; i++) {
    intersects2 = raycaster2.intersectObject(boundaryBoxObject[i], true);

    if (intersects2.length > 0) {
      personObject[i].children[0].material.visible = false; //disable that person

      if(i != 0){  //disable central cubes if other cubes are clicked
        frameObject[0].children[0].material.visible = false;
        roomObject[0].children[0].material.visible = false;
        personObject[0].children[0].material.visible = false;
        boundaryBoxObject[0].children[0].material.visible = false;

        //move the selected cube to middle
        frameObject[i].position.x = 0;
        roomObject[i].position.x = 0;
        boundaryBoxObject[i].position.x = 0;
        frameObject[i].position.y = 0;
        roomObject[i].position.y = 0;
        boundaryBoxObject[i].position.y = 0;
        frameObject[i].position.z = 0;
        roomObject[i].position.z = 0;
        boundaryBoxObject[i].position.z = 0;

      }

      activeCamera = camera2;
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
