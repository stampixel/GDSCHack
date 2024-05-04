import * as THREE from "three";
import data from './public/x.json';


//     # coords = [{"frame": 1, "right": [[x, y, z], ... [z, y, x]], "left": []}, {"frame": 2, "right": [], "left": []}]


let animationRunning = false;


    
var container = document.getElementById("animationCanvas");

  // Get the translate button
  const translateButton = document.getElementById("startButton");
  
  // Add click event listener to the translate button
  translateButton.addEventListener("click", function() {
    // Call your Three.js animation function here
    if(!animationRunning){
      animate();
      animationRunning = true;
    }
  });const fov = 75;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 1000;
var frameNumber = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const renderer = new THREE.WebGLRenderer({ canvas: container });
renderer.setSize(container.clientWidth, container.clientHeight);

function renderSphere(x, y, z) {
  const geometry = new THREE.SphereGeometry(0.2, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xF7F700 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  scene.add(sphere);
}

function drawLine(x1, y1, z1, x2, y2, z2) {
  const point1 = new THREE.Vector3(x1, y1, z1);
  const point2 = new THREE.Vector3(x2, y2, z2);

  // Calculate the vector between the two points
  const vector = new THREE.Vector3().subVectors(point2, point1);

  // Create a cylinder geometry with a custom radius
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, vector.length(), 8);

  // Create a material with the specified color
  const material = new THREE.MeshBasicMaterial({ color: 0xF7F700 });

  // Create a mesh using the geometry and material
  const line = new THREE.Mesh(geometry, material);

  // Position the line at the midpoint between the two points
  line.position.copy(point1).add(vector.clone().multiplyScalar(0.5));

  // Orient the geometry to align with the vector
  line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.clone().normalize());

  // Add the line to the scene
  scene.add(line);
}


function redistributeElements(left, right) {
  const MAX_ELEMENTS = 21; // Maximum number of elements to keep in each array

  if (left.length > MAX_ELEMENTS) {
    const redistributedElements = left.splice(MAX_ELEMENTS);
    right.push(...redistributedElements);
  } else if (right.length > MAX_ELEMENTS) {
    const redistributedElements = right.splice(MAX_ELEMENTS);
    left.push(...redistributedElements);
  }
}


function connectParts(frameNumber) {
  const partList = [[0,1],[1,2], [2,3], [3,4], [0,5], [5,6], [6,7], [7,8], [5,9], [9,10], [10,11], [11,12], [9,13], [13,14], [14,15], [15,16], [13,17], [17,18], [18,19], [19,20], [0,17]];
  var left = data["about"][frameNumber]['left'];
  var right = data["about"][frameNumber]['right'];
  redistributeElements(left, right);

  partList.forEach(function(edge) {
    const a = edge[0];
    const b = edge[1];
    if (left[a] && left[b]) {
      const l1 = left[a];
      const l2 = left[b];
      drawLine(l1[0] * 50, l1[1] * -50, l1[2] * 50, l2[0] * 50, l2[1] * -50, l2[2] * 50);
    }
    if (right[a] && right[b]) {
      const r1 = right[a];      const r2 = right[b];
      drawLine(r1[0] * 50, r1[1] * -50, r1[2] * 50, r2[0] * 50, r2[1] * -50, r2[2] * 50);
    }
  });
}


let clock = new THREE.Clock();
let delta = 0;
let interval = 1 / 45;

camera.position.set(27.5, -30, 25);

function animate() {
  requestAnimationFrame(animate);
  scene.children.length = 0; // Clear the scene

  if(animationRunning){
  delta += clock.getDelta();

  if (delta > interval) {
    delta = delta % interval;
    var left = data["about"][frameNumber]['left'];
    var right = data["about"][frameNumber]['right'];

    left.forEach(function(joint) {
      renderSphere(joint[0] * 50, joint[1] * -50, joint[2] * 50);
    });
  
    right.forEach(function(joint) {
      renderSphere(joint[0] * 50, joint[1] * -50, joint[2] * 50);
    });
    connectParts(frameNumber);

    frameNumber++;
    if (frameNumber >= data["about"].length) {
      frameNumber = 0;
      animationRunning=false;
      scene.children.length = 0;

    }
  }



  renderer.render(scene, camera);

}
}

