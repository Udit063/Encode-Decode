$(document).ready(function () {
    const colorDisplay = document.getElementById("color-display");
    const morseCodeDisplay = document.getElementById("morseCodeDisplay");
  
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const name = urlParams.get('name') ? urlParams.get('name').toUpperCase() : '';
  
    const morseCode = {
      A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
      H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
      O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
      U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..'
    };
  
    let totalDuration = 0; 
  
    function addTiming(duration, callback) {
      totalDuration += duration;
      setTimeout(callback, totalDuration);
    }
  
    function displayMorseCode(name) {
      morseCodeDisplay.innerHTML = ''; 
      totalDuration = 0; 
  
      for (let i = 0; i < name.length; i++) {
        const letter = name[i];
  
        if (letter === ' ') {
          morseCodeDisplay.innerHTML += ' / ';
          addTiming(5000, () => {
            colorDisplay.style.backgroundColor = 'gray'; 
          });
        } else if (morseCode.hasOwnProperty(letter)) {
          const code = morseCode[letter];
  
          for (let j = 0; j < code.length; j++) {
            const symbol = code[j];
            morseCodeDisplay.innerHTML += symbol;
  
            if (symbol === '.') {
              addTiming(0, () => {
                console.log('h');
                colorDisplay.style.backgroundColor = 'white';
              });
            } else if (symbol === '-') {
              addTiming(0, () => {
                console.log('i');
                colorDisplay.style.backgroundColor = 'black';
              });
            }
            addTiming(1000, () => {
              colorDisplay.style.backgroundColor = 'gray';
            });
          }
  
          morseCodeDisplay.innerHTML += ' ';
          addTiming(500, () => {
            colorDisplay.style.backgroundColor = 'gray';
          });
        }
      }
  
      addTiming(1000, () => {
        colorDisplay.style.backgroundColor = 'gray';
      });
    }
  
    document.getElementById("convertButton").addEventListener("click", function() {
      const name = document.getElementById("nameInput").value.toUpperCase();
      displayMorseCode(name);
    });
  
    if (name) {
      displayMorseCode(name);
    }
  });
  