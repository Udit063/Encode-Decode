$(document).ready(function () {
  // Selecting elements from the DOM
  const video = document.getElementById("video");
  const resultDisplay = document.getElementById("result-display");
  const rahulImage = document.getElementById("rahul-image");
  const uditImage = document.getElementById("udit-image");

  // Variables for tracking color detection and Morse code translation
  let currentColor = null;
  let colorStartTime = null;
  const durationArrays = [];
  let morseString = "";
  let resultString = "";

  // Morse code mapping
  const morseCode = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
    H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
    O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..'
  };

  // Function to calculate average RGB value from video frame
  function calculateAverageRGB(frame) {
    const length = frame.data.length / 4;
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < length; i++) {
      r += frame.data[i * 4];
      g += frame.data[i * 4 + 1];
      b += frame.data[i * 4 + 2];
    }

    r = Math.floor(r / length);
    g = Math.floor(g / length);
    b = Math.floor(b / length);

    return { r, g, b };
  }

  // Function to format duration into readable string
  function formatDuration(duration) {
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  }

  // Function to determine if the average RGB represents a "black" color
  function isBlack(rgb) {
    return rgb.r < 50 && rgb.g < 50 && rgb.b < 50;
  }

  // Function to capture color changes from the video stream
  function captureColor() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const { r, g, b } = calculateAverageRGB(frame);
    const now = Date.now();

    const isCurrentlyBlack = isBlack({ r, g, b });

    if (currentColor !== isCurrentlyBlack) {
      if (currentColor !== null) {
        const duration = now - colorStartTime;

        if (currentColor) { 
          durationArrays.push({ symbol: '-', duration });
          if (duration < 300) {
            morseString += ".";
          } else if (duration <= 1311) {
            morseString += "-";
          } else if (duration > 1311 && duration <= 2100) {
            interpretMorse(morseString);
            morseString = "";
          } else if (duration >= 2100) {
            morseString += " ";
            interpretMorse(morseString);
            morseString = "";
          }
        }
      }

      currentColor = isCurrentlyBlack;
      colorStartTime = now;
    }
  }

  // Function to interpret Morse code string and display result
function interpretMorse(morseString) {
  const morseWords = morseString.trim().split("   "); // Split by three spaces for words
    const translatedWords = morseWords.map(word => {
      const morseLetters = word.split(" "); // Split by single space for letters
      return morseLetters.map(letter => {
        return Object.keys(morseCode).find(key => morseCode[key] === letter) || "";
      }).join("");
    }).join(" ");

  resultString += translatedWords.trim(); // Append translated words to resultString
  resultDisplay.textContent = resultString;

  console.log(`Morse Code: ${morseString}`);
  console.log(`Translated Text: ${resultString}`);

  // Displaying or hiding images based on the translated result
  const trimmedResult = resultString.toLowerCase();
  if (trimmedResult.includes("rahul")) {
    console.log("Displaying Rahul's image");
    rahulImage.classList.remove("hidden");
    uditImage.classList.add("hidden");
  } else if (trimmedResult.includes("udit")) {
    console.log("Displaying Udit's image");
    uditImage.classList.remove("hidden");
    rahulImage.classList.add("hidden");
  } else {
    console.log("Hiding both images");
    rahulImage.classList.add("hidden");
    uditImage.classList.add("hidden");
  }
}


  // Function to start the video stream and capture color changes
  function startVideoStream() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        let videoSourceId = null;
        devices.forEach(function (device) {
          if (device.kind === 'videoinput') {
            if (isMobile && device.label.toLowerCase().includes('back')) {
              videoSourceId = device.deviceId;
            } else if (!isMobile && device.label.toLowerCase().includes('front')) {
              videoSourceId = device.deviceId;
            }
          }
        });

        const constraints = {
          video: {
            deviceId: videoSourceId ? { exact: videoSourceId } : undefined,
            facingMode: isMobile ? { exact: "environment" } : "user"
          }
        };

        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        setInterval(captureColor, 100);
      })
      .catch(function (error) {
        console.error("Error accessing the webcam: ", error);
      });
  }

  // Start the video stream when the document is ready
  startVideoStream();
});
