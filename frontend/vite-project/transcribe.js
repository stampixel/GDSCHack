const startButton = document.getElementById('startButton');
const talkButton  = document.getElementById('talkButton')
const transcriptionDiv = document.getElementById('transcriptionDiv');
const front = document.getElementById("front2");
let recognition = null;
let isTranscribing = false; // Flag to track if transcribing is currently active

startButton.addEventListener('click', () => {

  const urlInput = document.querySelector('.url_input');
  const videoContainer = document.querySelector('.videoContainer')
  const iframe = document.getElementById('myIframe');

  iframe.src = "https://www.youtube.com/embed/" + urlInput.value.split("=")[1].split("&")[0];


  if (urlInput.value.trim() !== '') {
    // Show the textbox if the URL input is filled
    videoContainer.style.display = 'flex';
    videoContainer.style.flex = '1';
    

  } else {
    // Hide the textbox if the URL input is empty
    videoContainer.style.display = 'none';
  }
  
});


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
