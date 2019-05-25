if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var container, stats, controls;
var camera, scene, renderer, light, meshLoad, material;
var clock = new THREE.Clock();
var mixer;
init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100,-300,300);
    camera.lookAt(new THREE.Vector3(0,0,0));
    controls = new THREE.OrbitControls(camera);
    controls.target.set(0, 100, 0);
    controls.update();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200,0);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add(light);

    material = new THREE.MeshNormalMaterial({metalness: 0.8, light: true, skinning: true, wireframe: true});
    // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

    /******* Ground *********/
    // var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
    //     color: 0x999999,
    //     depthWrite: false
    // }));
    // mesh.rotation.x = -Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add(mesh);

    /******* Grid *********/
    // var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // scene.add(grid);

    /******* Model *********/
    var loader = new THREE.FBXLoader();
    loader.load('img/hand4.fbx', function(object) {
        object.scale.x += 10;
        object.scale.y += 10;
        object.scale.z += 10;
        mixer = new THREE.AnimationMixer(object);
        var action = mixer.clipAction(object.animations[0]);
        action.play();
        action.timeScale =  0.2;
        object.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = material;
            }
            // if ( child instanceof THREE.Mesh ) {
            //     child.material = material;
            // }
        });
        meshLoad = object;
        scene.add(object);
    });

    /******* Renderer *********/
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    // stats
    stats = new Stats();
    container.appendChild(stats.dom);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//
function animate() {
    requestAnimationFrame(animate);
    // meshLoad.rotation.x += 0.01;
    // meshLoad.rotation.y += 0.01;


    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
    stats.update();
}
