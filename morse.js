$(document).ready(function () {
  // Selecting elements from the DOM
  const colorDisplay = document.getElementById("color-display");

  // Morse code mapping
  const morseCode = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
    H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
    O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..'
  };

  let totalDuration = 0;

  // Function to add timing delays and change color display for Morse code
  function addTiming(duration, callback) {
    totalDuration += duration;
    setTimeout(callback, totalDuration);
  }

  // Function to display Morse code based on input name
  function displayMorseCode(name) {
    totalDuration = 0;

    for (let i = 0; i < name.length; i++) {
      const letter = name[i];

      if (letter === ' ') {
        addTiming(5000, () => {
          colorDisplay.style.backgroundColor = 'gray';
        });
      } else if (morseCode.hasOwnProperty(letter)) {
        const code = morseCode[letter];

        for (let j = 0; j < code.length; j++) {
          const symbol = code[j];

          if (symbol === '.') {
            addTiming(0, () => {
              console.log("dot w");
              colorDisplay.style.backgroundColor = 'white';
            });
            addTiming(200, () => {
              console.log("dot b");
              colorDisplay.style.backgroundColor = 'black';
            });
          } else if (symbol === '-') {
            addTiming(0, () => {
              console.log("dash w");
              colorDisplay.style.backgroundColor = 'white';
            });
            addTiming(200, () => {
              console.log("dash b");
              colorDisplay.style.backgroundColor = 'black';
            });
            addTiming(1000, () => {
              colorDisplay.style.backgroundColor = 'black';
            });
          }
          addTiming(200, () => {
            colorDisplay.style.backgroundColor = 'black';
          });
        }

        colorDisplay.innerHTML += ' ';
        addTiming(0, () => {
          colorDisplay.style.backgroundColor = 'white';
        });
        addTiming(200, () => {
          colorDisplay.style.backgroundColor = 'black';
        });
        addTiming(2000, () => {
          colorDisplay.style.backgroundColor = 'black';
        });
      }
    }

    addTiming(3000, () => {
      colorDisplay.style.backgroundColor = 'white';
    });
  }

  // Event listener for button click to convert input to Morse code display
  document.getElementById("convertButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    const name = document.getElementById("nameInput").value.toUpperCase();
    displayMorseCode(name);
  });
});
