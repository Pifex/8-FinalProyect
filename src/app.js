import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

//Hexadecimal color (recommended)
var keyboard = {};
var player = { height:1.8, speed:0.08, turnSpeed:Math.PI*0.01 };
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

let speed = 0.01;
let spotLight;
let objects = [];

document.body.onload = () => {
  main();
  const speedUpBtn = document.querySelector('#speedUp');
  const speedDownBtn = document.querySelector('#speedDown');

  speedUpBtn.onclick = () => {
    speedUp();
  };
  speedDownBtn.onclick = () => {
    speedDown();
  };
};

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

function main() {
  // Configurracion inicial
  renderer.setSize(1920, 1080);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Controls
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

  loadGUI();

  // Lights
  setupLights();
  

  let el = drawCube(0xF0F8FF, false);
  el.position.z = 0;
  el.position.y = 1;
  el.position.x = 3;
  scene.add(el);
  objects.push(el);

  

  let plane = drawPlane(15, 15, 10, 10, 0x0000ff, true);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  animate();
}

function drawPlane(w, h, sh, sw, color, ds = false) {
  const geometry = new THREE.PlaneGeometry(w, h, sw, sh);
  const material = new THREE.MeshPhongMaterial({
    color,
    side: ds ? THREE.DoubleSide : undefined,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.receiveShadow = true;
  return plane;
}

function drawSphere(color, wireframe = false) {
const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshPhongMaterial({color : color, wireframe, wireframe})
const sphere = new THREE.Mesh( geometry, material );
sphere.castShadow = true;
return sphere;
}

function drawCube(color, wireframe = false) {
  const geometry = new THREE.BoxGeometry(2,2,2);
  const material = new THREE.MeshPhongMaterial({color : color, wireframe: wireframe,});
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  return cube;
}

function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = true;
  scene.add(spotLight);

  /* lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper); */
}


function loadGUI() {
  const gui = new dat.GUI();

const morph = gui.addFolder('Controles');
morph.open();



}


function speedUp() {
  speed += 0.001;
}

function speedDown() {
  speed -= 0.001;
}

   function animate() {
    requestAnimationFrame(animate);
    if(keyboard[87]){ // W key
      camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
      camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[83]){ // S key
      camera.position.x += Math.sin(camera.rotation.y) * player.speed;
      camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if(keyboard[65]){ // A key
      camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
      camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
    }
    if(keyboard[68  ]){ // D key
      camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
      camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }
    
    if(keyboard[37]){ // left arrow key
      camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){ // right arrow key
      camera.rotation.y += player.turnSpeed;
    }
    //updateElements();
    renderer.render(scene, camera);
  
    /*objects[0].rotation.x += speed;*/
    objects[0].rotation.y += speed;
  
    const speedLabel = document.querySelector('#speed');
    speedLabel.innerHTML = speed;
  }
  function keyDown(event){
    keyboard[event.keyCode] = true;
  }
  
  function keyUp(event){
    keyboard[event.keyCode] = false;
  }
  
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);