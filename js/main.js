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
var sphereGroup, smallSphere;

var meshLoad;

var clock = new THREE.Clock();
			var mixer;

init();
animate();

function init() {
    var container = document.getElementById('container');
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
    camera.position.set(0, 75, 160);
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 40, 0);
    cameraControls.maxDistance = 800;
    cameraControls.minDistance = 10;
    cameraControls.update();
    //
    var planeGeo = new THREE.PlaneBufferGeometry(100.1, 100.1);
    // reflectors/mirrors
    var geometry = new THREE.CircleBufferGeometry(400, 640);
    var groundMirror = new THREE.Reflector(geometry, {
        clipBias: 0.003,
        textureWidth: WIDTH * window.devicePixelRatio,
        textureHeight: HEIGHT * window.devicePixelRatio,
        color: 0x777777,
        recursion: 1
    });
    groundMirror.position.y = 10;
    groundMirror.rotateX(-Math.PI / 2);
    //scene.add(groundMirror);

    // var geometry = new THREE.PlaneBufferGeometry(100, 100);
    // var verticalMirror = new THREE.Reflector(geometry, {
    //     clipBias: 0.003,
    //     textureWidth: WIDTH * window.devicePixelRatio,
    //     textureHeight: HEIGHT * window.devicePixelRatio,
    //     color: 0x889999,
    //     recursion: 1
    // });
    // verticalMirror.position.y = 50;
    // verticalMirror.position.z = -100;
    // scene.add(verticalMirror);
    // //----
    // var geometry2 = new THREE.PlaneBufferGeometry(100, 100);
    // var verticalMirror2 = new THREE.Reflector(geometry2, {
    //     clipBias: 0.003,
    //     textureWidth: WIDTH * window.devicePixelRatio,
    //     textureHeight: HEIGHT * window.devicePixelRatio,
    //     color: 0x889999,
    //     recursion: 1
    // });
    // verticalMirror2.position.y = 50;
    // verticalMirror2.position.x = -100;
    // verticalMirror2.rotateY(Math.PI / 2);
    //
    // scene.add(verticalMirror2);
    // //----
    // var geometry3 = new THREE.PlaneBufferGeometry(100, 100);
    // var verticalMirror3 = new THREE.Reflector(geometry3, {
    //     clipBias: 0.003,
    //     textureWidth: WIDTH * window.devicePixelRatio,
    //     textureHeight: HEIGHT * window.devicePixelRatio,
    //     color: 0x889999,
    //     recursion: 1
    // });
    // verticalMirror3.position.y = 50;
    // verticalMirror3.position.x = 100;
    // verticalMirror3.position.z = 0;
    // verticalMirror3.rotateY(-Math.PI / 2);
    //
    // scene.add(verticalMirror3);


    /******* Model *********/
    var loader = new THREE.FBXLoader();
    var roomMat = new THREE.MeshToonMaterial({
        color: 0xb3c4aa,

    });


    loader.load('img/room1.fbx', function(object) {
        object.scale.x += 5;
        object.scale.y += 5;
        object.scale.z += 5;
        //mixer = new THREE.AnimationMixer(object);
        //var action = mixer.clipAction(object.animations[0]);
        //action.play();
        //action.timeScale =  0.2;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = roomMat;
            }
            // if ( child instanceof THREE.Mesh ) {
            //     child.material = material;
            // }
        });

        meshLoad = object;
        scene.add(object);
    });

    var frame = new THREE.FBXLoader();
    var flatMat = new THREE.MeshToonMaterial({
        color: 0xf4f8ff,
        transparent: true,
        opacity: 0.6

    });

    frame.load('img/frame1.fbx', function(object) {
        object.scale.x += 5;
        object.scale.y += 5;
        object.scale.z += 5;
        //mixer = new THREE.AnimationMixer(object);
        //var action = mixer.clipAction(object.animations[0]);
        //action.play();
        //action.timeScale =  0.2;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = flatMat;
            }
            // if ( child instanceof THREE.Mesh ) {
            //     child.material = material;
            // }
        });

        scene.add(object);
    });

    var person = new THREE.FBXLoader();
    var personMat = new THREE.MeshToonMaterial({
        color: 0xf9b9a7,
        skinning: true,

    });

    frame.load('img/on-phone-2.fbx', function(object) {
        object.scale.x *= 0.3;
        object.scale.y *= 0.3;
        object.scale.z *= 0.3;
        mixer = new THREE.AnimationMixer(object);
        var action = mixer.clipAction(object.animations[0]);
        action.play();
        //action.timeScale =  0.2;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = personMat;
            }
        });

        scene.add(object);
    });






    // sphereGroup = new THREE.Object3D();
    // scene.add(sphereGroup);
    // var geometry = new THREE.CylinderBufferGeometry(0.1, 15 * Math.cos(Math.PI / 180 * 30), 0.1, 24, 1);
    // var material = new THREE.MeshToonMaterial({
    //     color: 0xa9c5f9,
    //     //emissive: 0xa9c5f9,
    //     flatShading: true
    // });
    // var sphereCap = new THREE.Mesh(geometry, material);
    // sphereCap.position.y = -15 * Math.sin(Math.PI / 180 * 30) - 0.05;
    // sphereCap.rotateX(-Math.PI);
    // var geometry = new THREE.SphereBufferGeometry(15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120);
    // var halfSphere = new THREE.Mesh(geometry, material);
    // halfSphere.add(sphereCap);
    // halfSphere.rotateX(-Math.PI / 180 * 135);
    // halfSphere.rotateZ(-Math.PI / 180 * 20);
    // halfSphere.position.y = 7.5 + 15 * Math.sin(Math.PI / 180 * 30);
    // sphereGroup.add(halfSphere);
    // var geometry = new THREE.IcosahedronBufferGeometry(5, 0);
    // var material = new THREE.MeshToonMaterial({
    //     color: 0xfffdc6,
    //     //emissive: 0xfffdc6,
    //     flatShading: true
    // });
    // smallSphere = new THREE.Mesh(geometry, material);
    // scene.add(smallSphere);


    // walls
    // var planeTop = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({
    //     color: 0xffffff
    // }));
    // planeTop.position.y = 100;
    // planeTop.rotateX(Math.PI / 2);
    // scene.add(planeTop);

    // var planeBottom = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({
    //     color: 0xffffff
    // }));
    // planeBottom.rotateX(-Math.PI / 2);
    // scene.add(planeBottom);
    // var planeFront = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({
    //     color: 0x7f7fff
    // }));
    // planeFront.position.z = 50;
    // planeFront.position.y = 50;
    // planeFront.rotateY(Math.PI);
    // scene.add(planeFront);
    // var planeRight = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({
    //     color: 0x00ff00
    // }));
    // planeRight.position.x = 50;
    // planeRight.position.y = 50;
    // planeRight.rotateY(-Math.PI / 2);
    // scene.add(planeRight);
    // var planeLeft = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({
    //     color: 0xff0000
    // }));
    // planeLeft.position.x = -50;
    // planeLeft.position.y = 50;
    // planeLeft.rotateY(Math.PI / 2);
    // scene.add(planeLeft);


    // lights

    var mainLight = new THREE.PointLight(0xcccccc, 1.5, 250);
    mainLight.position.y = 60;
    scene.add(mainLight);
    var greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
    greenLight.position.set(550, 50, 0);
    scene.add(greenLight);
    var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
    redLight.position.set(-550, 50, 0);
    scene.add(redLight);
    var blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
    blueLight.position.set(0, 50, 550);
    scene.add(blueLight);


    // var hemisphereLight, shadowLight;
    //
    // function createLights() {
    //     // A hemisphere light is a gradient colored light;
    //     // the first parameter is the sky color, the second parameter is the ground color,
    //     // the third parameter is the intensity of the light
    //     hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
    //
    //     // A directional light shines from a specific direction.
    //     // It acts like the sun, that means that all the rays produced are parallel.
    //     shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    //
    //     // Set the direction of the light
    //     shadowLight.position.set(150, 350, 350);
    //
    //     // Allow shadow casting
    //     shadowLight.castShadow = true;
    //
    //     // define the visible area of the projected shadow
    //     shadowLight.shadow.camera.left = -400;
    //     shadowLight.shadow.camera.right = 400;
    //     shadowLight.shadow.camera.top = 400;
    //     shadowLight.shadow.camera.bottom = -400;
    //     shadowLight.shadow.camera.near = 1;
    //     shadowLight.shadow.camera.far = 1000;
    //
    //     // define the resolution of the shadow; the higher the better,
    //     // but also the more expensive and less performant
    //     shadowLight.shadow.mapSize.width = 2048;
    //     shadowLight.shadow.mapSize.height = 2048;
    //
    //     // to activate the lights, just add them to the scene
    //     scene.add(hemisphereLight);
    //     scene.add(shadowLight);
    // }
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
	if ( mixer ) mixer.update( delta );
    renderer.render(scene, camera);
}
