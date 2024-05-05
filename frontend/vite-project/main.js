import * as THREE from "three";
import a from "../../backend/dictionary/a.json";
import b from "../../backend/dictionary/b.json";
import c from "../../backend/dictionary/c.json";
import d from "../../backend/dictionary/d.json";
import e from "../../backend/dictionary/e.json";
import f from "../../backend/dictionary/f.json";
import g from "../../backend/dictionary/g.json";
import h from "../../backend/dictionary/h.json";
import i from "../../backend/dictionary/i.json";
import j from "../../backend/dictionary/j.json";
import k from "../../backend/dictionary/k.json";
import l from "../../backend/dictionary/l.json";
import m from "../../backend/dictionary/m.json";
import n from "../../backend/dictionary/n.json";
import o from "../../backend/dictionary/o.json";
import p from "../../backend/dictionary/p.json";
import q from "../../backend/dictionary/q.json";
import r from "../../backend/dictionary/r.json";
import s from "../../backend/dictionary/s.json";
import t from "../../backend/dictionary/t.json";
import u from "../../backend/dictionary/u.json";
import v from "../../backend/dictionary/v.json";
import w from "../../backend/dictionary/w.json";
import x from "../../backend/dictionary/x.json";
import y from "../../backend/dictionary/y.json";
import z from "../../backend/dictionary/z.json";

const jsonFiles = {
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k,
  l,
  m,
  n,
  o,
  p,
  q,
  r,
  s,
  t,
  u,
  v,
  w,
  x,
  y,
  z,
};

//     # coords = [{"frame": 1, "right": [[x, y, z], ... [z, y, x]], "left": []}, {"frame": 2, "right": [], "left": []}]

let animationRunning = false;
const mouth = document.querySelector(".mouth");
const displayWord = document.querySelector(".currentWord");

var frameNumber = 0;
let data;
let currentWord = 0;

let sentence = [];
let firstLetters = [];

var container = document.getElementById("animationCanvas");

// Get the translate button
const translateButton = document.getElementById("startButton");
const textBox = document.getElementById("transcriptionDiv");

let clock = new THREE.Clock();
let delta = 0;
let interval = 1 / 60;

//Function to start animating
function startAnimation() {
  if(textBox.textContent){
    sentence = textBox.textContent.split(" ");
  }
  else{
    sentence = textBox.value.split(" ");

  }
  if (!animationRunning) {
    frameNumber = 0;
    for (var i = 0; i < sentence.length; i++) {
      // Iterate over numeric indexes from 0 to 5, as everyone expects.
      firstLetters.push(sentence[i][0].toLowerCase());
    }
    animate();
    animationRunning = true;
    translateButton.style.opacity = "0.5";
  }
}

// async function importJsonFile(word) {
//   const firstLetter = word[0].toLowerCase();
//   if (firstLetter in jsonFiles) {
//     try {
//       const jsonModule = await import(a);
//       console.log( jsonModule);
//       return jsonModule;
//     } catch (error) {
//       console.error("Error loading JSON file:", error);
//       return null;
//     }
//   } else {
//     console.error("No JSON file found for the first letter:", firstLetter);
//     return null;
//   }

// }

//  importJsonFile("athlete")

// Add click the translate button
translateButton.addEventListener("click", startAnimation);
const fov = 75;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 1000;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xadd8e6);
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const renderer = new THREE.WebGLRenderer({ canvas: container });
renderer.setSize(container.clientWidth, container.clientHeight);

//Dots rendering
function renderSphere(xCord, yCord, zCord) {
  const geometry = new THREE.SphereGeometry(0.2, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xb57700 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(xCord, yCord, zCord);
  scene.add(sphere);
}

//Line Rendering
function drawLine(x1, y1, z1, x2, y2, z2) {
  const point1 = new THREE.Vector3(x1, y1, z1);
  const point2 = new THREE.Vector3(x2, y2, z2);

  // Calculate the vector between the two points
  const vector = new THREE.Vector3().subVectors(point2, point1);

  //Cylinder line between dots
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, vector.length(), 8);

  const material = new THREE.MeshBasicMaterial({ color: 0xffcd00 });

  // Create a mesh using the geometry and material
  const line = new THREE.Mesh(geometry, material);

  // Position the line at the midpoint between the two points
  line.position.copy(point1).add(vector.clone().multiplyScalar(0.5));

  // Orient the lines
  line.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    vector.clone().normalize()
  );

  // Add the line to the scene
  scene.add(line);
}

startButton.addEventListener("click", mouthAnimation);

function mouthAnimation() {
  const mouth = document.querySelector(".mouth");
  let isOpen = true; // Assuming mouth starts in open state

  // Function to change mouth size and state
  function changeMouthSize() {
    // Toggle isOpen variable and change mouth size based on its current state
    isOpen = !isOpen;
    if (isOpen) {
      mouth.style.height = "1rem"; // Set the height to open state
    } else {
      mouth.style.height = "3rem"; // Set the height to closed state
    }
  }

  // Change mouth size every 2 seconds
  let mouthInterval = setInterval(changeMouthSize, 2000); // Set up interval for mouth animation

  // Stop mouth animation when currentWord >= sentence.length
  clearInterval(mouthInterval); // Stop the mouth animation
  mouth.style.height = "3rem"; // Reset mouth size to its default
}
function redistributeElements(left, right) {
  //fixes the problem where more than 21 nodes are identified as left and lets the lines be drawn properly
  if (left.length > 21) {
    const redistributedElements = left.splice(21);
    right.push(...redistributedElements);
  } else if (right.length > 21) {
    const redistributedElements = right.splice(21);
    left.push(...redistributedElements);
  }
}

async function connectParts(frameNumber, word) {
  const data = jsonFiles[firstLetters[currentWord]];
  const jointCoordinates = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [5, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [9, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [13, 17],
    [17, 18],
    [18, 19],
    [19, 20],
    [0, 17],
  ];
  var left = data[word][frameNumber]["left"];
  var right = data[word][frameNumber]["right"];
  redistributeElements(left, right);

  jointCoordinates.forEach(function (edge) {
    const a = edge[0];
    const b = edge[1];
    if (left[a] && left[b]) {
      const l1 = left[a];
      const l2 = left[b];
      drawLine(
        l1[0] * 50,
        l1[1] * -50,
        l1[2] * 50,
        l2[0] * 50,
        l2[1] * -50,
        l2[2] * 50
      );
    }
    if (right[a] && right[b]) {
      const r1 = right[a];
      const r2 = right[b];
      drawLine(
        r1[0] * 50,
        r1[1] * -50,
        r1[2] * 50,
        r2[0] * 50,
        r2[1] * -50,
        r2[2] * 50
      );
    }
  });
}

camera.position.set(27.5, -27, 25);

function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

 function animate() {
  // const data = await importJsonFile(sentence[currentWord]);
  requestAnimationFrame(animate);
  scene.children.length = 0; // Clear the scene

  if (animationRunning) {
    const data = jsonFiles[firstLetters[currentWord]];

    delta += clock.getDelta();
    if (data[sentence[currentWord].toLowerCase()]) {
      if (delta > interval) {
        delta = delta % interval;
        let word = sentence[currentWord].toLowerCase();
   
          displayWord.textContent = word
        console.log(data[word])
        var left = data[word][frameNumber]["left"]? data[word][frameNumber]["left"] : [];
        var right = data[word][frameNumber]["right"] ;

        //render left hand
        left.forEach(function (joint) {
          renderSphere(joint[0] * 50, joint[1] * -50, joint[2] * 50);
        });

        //render right hand
        right.forEach(function (joint) {
          renderSphere(joint[0] * 50, joint[1] * -50, joint[2] * 50);
        });
        connectParts(frameNumber, word);

        frameNumber++;
        if (frameNumber >= data[word].length) {
          currentWord++;
          if (currentWord >= sentence.length) {
            // All words have been animated, stop the animation
            scene.children.length = 0; // Clear the scene
            translateButton.style.opacity = "0.5";
            animationRunning = false;
            currentWord = 0;
            frameNumber = 0;
            translateButton.style.opacity = 1;
            displayWord.textContent = "";
            mouth.style.height = "3rem"; // Reset mouth size to its default
            setTimeout(()=>{     window.location.reload()},"1000")

          }
          else{
          frameNumber = 0; // Reset frame number for the next word
          }
        }
      }
    } else {
      currentWord++
      if (currentWord >= sentence.length) {
        // All words have been animated, stop the animation
        scene.children.length = 0; // Clear the scene
        translateButton.style.opacity = "0.5";
        animationRunning = false;
        currentWord = 0;
        frameNumber = 0;
        translateButton.style.opacity = 1;
        displayWord.textContent = "";
        mouth.style.height = "3rem"; // Reset mouth size to its default
        setTimeout(()=>{     window.location.reload()},"1000")

      }


    }

    renderer.render(scene, camera);
  }
}
