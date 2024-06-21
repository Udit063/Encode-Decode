$(document).ready(function () {
  const video = document.getElementById("video");
  const colorDisplay = document.getElementById("color-display");
  const colorDurations = document.getElementById("color-durations");
  const blackDurations = document.getElementById("black-durations");
  const morseDisplay = document.getElementById("morse-display");
  const resultDisplay = document.getElementById("result-display");
  let currentColor = null;
  let colorStartTime = null;
  const durationArrays = [];
  let lightDurations = [];
  let blackDurationsArray = [];
  let morseString = "";
  let resultString = "";

  const morseCode = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
    H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
    O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..'
  };

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

  function logColorDuration(isBlack, duration) {
    const formattedDuration = formatDuration(duration);

    if (isBlack) {
      const colorDurationElement = document.createElement("div");
      colorDurationElement.classList.add("color-duration");
      colorDurationElement.textContent = `Black - ${formattedDuration}`;
      blackDurations.appendChild(colorDurationElement);
    } else {
      const colorDurationElement = document.createElement("div");
      colorDurationElement.classList.add("color-duration");
      colorDurationElement.textContent = `Light - ${formattedDuration}`;
      colorDurations.appendChild(colorDurationElement);
    }
  }

  function formatDuration(duration) {
    const milliseconds = Math.floor(duration % 1000);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  }

  function isBlack(rgb) {
    return rgb.r < 50 && rgb.g < 50 && rgb.b < 50;
  }

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
          blackDurationsArray.push({ color: "Black", duration: duration });
          if (duration < 300) {
            morseString += ".";
          } else if (duration <= 1310) {
            morseString += "-";
          } else if (duration > 1310 && duration <= 2100) {
            interpretMorse(morseString);
            morseString = "";
          } else if (duration >= 2100) {
            morseString += " ";
            interpretMorse(morseString);
            morseString = "";
          }
        } else { // Was light
          durationArrays.push({ symbol: '.', duration });
          lightDurations.push({ color: "Light", duration: duration });
        }

        logColorDuration(currentColor, duration);
      }

      currentColor = isCurrentlyBlack;
      colorStartTime = now;
    }
  }

  function interpretMorse(morseString) {
    const morseWords = morseString.trim().split("   "); // Split by three spaces for words
    const translatedWords = morseWords.map(word => {
      const morseLetters = word.split(" "); // Split by single space for letters
      return morseLetters.map(letter => {
        return Object.keys(morseCode).find(key => morseCode[key] === letter) || "";
      }).join("");
    }).join(" ");
    resultString += translatedWords + " ";
    resultDisplay.textContent = resultString.trim();
    console.log(`Morse Code: ${morseString}`);
    console.log(`Translated Text: ${resultString.trim()}`);
  }
  

  function startVideoStream() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        setInterval(captureColor, 100);
      })
      .catch(function (error) {
        console.error("Error accessing the webcam: ", error);
      });
  }

  startVideoStream();
});
