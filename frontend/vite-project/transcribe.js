import { timerLocal } from "three/examples/jsm/nodes/Nodes.js";

const startButton = document.getElementById('startButton');
const talkButton  = document.getElementById('talkButton')
const transcriptionDiv = document.getElementById('transcriptionDiv');
const front = document.getElementById("front2");
let recognition = null;
let isTranscribing = false; // Flag to track if transcribing is currently active


const container = document.querySelector("body");
container.addEventListener("mousemove", (e) => {
  const eyes = document.querySelectorAll(".eye");
  [].forEach.call(eyes, function (eye) {
    let mouseX = eye.getBoundingClientRect().right;
    if (eye.classList.contains("eye-left")) {
      mouseX = eye.getBoundingClientRect().left;
    }
    let mouseY = eye.getBoundingClientRect().top;
    let radianDegrees = Math.atan2(e.pageX - mouseX, e.pageY - mouseY);
    let rotationDegrees = radianDegrees * (180 / Math.PI) * -1 + 180;
    eye.style.transform = `rotate(${rotationDegrees}deg)`;
  });
});


// startButton.addEventListener('click', () => {

//   const urlInput = document.querySelector('.url_input');
//   const videoContainer = document.querySelector('.videoContainer')
//   const iframe = document.getElementById('myIframe');

//   iframe.src = "https://www.youtube.com/embed/" + urlInput.value.split("=")[1].split("&")[0];


//   if (urlInput.value.trim() !== '') {
//     // Show the textbox if the URL input is filled
//     videoContainer.style.display = 'flex';
//     videoContainer.style.flex = '1';
    

//   } else {
//     // Hide the textbox if the URL input is empty
//     videoContainer.style.display = 'none';
//   }
  
// });




// Change mouth size every 2 seconds


talkButton.addEventListener('click',()=>{
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognition) {
      // Initialize the SpeechRecognition object
      recognition = new SpeechRecognition();
    
      // Set parameters for speech recognition
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
    
      // Event listener for when speech is recognized
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        // Update the transcription display
        transcriptionDiv.textContent = transcript;
        
        // Log the transcription to the console
        console.log('Transcription:', transcript);
      };
    
      // Event listener for errors
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
    
    // Toggle transcribing state
    isTranscribing = !isTranscribing;

    if (isTranscribing) {
      // Start speech recognition
      recognition.start();
      front.textContent = 'Stop';
    } else {
      // Stop speech recognition
      recognition.stop();
      front.textContent = 'Talk';
    }
  } else {
    // Provide a fallback solution if SpeechRecognition is not supported
    console.error('Speech recognition is not supported in this browser.');
    // You can implement a fallback solution here, such as displaying a message to the user.
  }
})

// const eyeballs = document.querySelectorAll('.eyeball');

// // Animation function to update eyeball positions
// function animateEyeballs() {
//   // Update each eyeball's position
//   eyeballs.forEach((eyeball, index) => {
//     // Check if the eyeball needs to change direction
//     if (!eyeball.dataset.animationStartTime || Date.now() - parseInt(eyeball.dataset.animationStartTime) > parseInt(eyeball.dataset.animationDuration)) {
//       // Randomize the direction and duration
//       const angle = Math.random() * Math.PI - Math.PI / 2; // Random angle between -π/2 and π/2 (left and right)
//       const radius = 18; // Random radius
//       const duration = Math.random() * 2000 + 1000; // Random duration between 1000ms and 3000ms

//       // Update eyeball's custom data attributes
//       eyeball.dataset.animationStartTime = Date.now();
//       eyeball.dataset.animationDuration = duration;

//       // Get the current position of the eyeball
//       const currentPosition = {
//         x: parseFloat(eyeball.dataset.currentX) || 0,
//         y: parseFloat(eyeball.dataset.currentY) || 0
//       };

//       // Calculate the new position for the eyeball
//       const targetPosition = {
//         x: Math.cos(angle) * radius,
//         y: 0 // Set the y component to 0 to restrict movement to the horizontal axis
//       };

//       // Smoothly interpolate between the current position and the new position
//       const startTime = Date.now();
//       const animate = () => {
//         const elapsedTime = Date.now() - startTime;
//         const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is capped at 1
//         const newPosition = {
//           x: currentPosition.x + (targetPosition.x - currentPosition.x) * progress,
//           y: currentPosition.y + (targetPosition.y - currentPosition.y) * progress
//         };

//         // Apply the transformation
//         eyeball.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;

//         // Continue animation if not finished
//         if (progress < 1) {
//           requestAnimationFrame(animate);
//         } else {
//           // Update eyeball's current position
//           eyeball.dataset.currentX = newPosition.x;
//           eyeball.dataset.currentY = newPosition.y;
//         }
//       };

//       // Start the animation
//       animate();
//     }
//   });

//   // Call this function again on the next frame
//   requestAnimationFrame(animateEyeballs);
// }

// // Start the animation
// animateEyeballs();


