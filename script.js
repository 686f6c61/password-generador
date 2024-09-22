// Variables globales
let entropy = 0;
const requiredEntropy = 100;
let lastGenerationTime = 0;
const GENERATION_INTERVAL = 50;

function calculateRealEntropy(password) {
  const charSet = new Set(password);
  return Math.log2(Math.pow(charSet.size, password.length));
}

function generateRandomEntropy() {
  return Math.floor(Math.random() * 1000) + 100; // Genera un número entre 100 y 1099
}

function updateLengthValue(value) {
  const length = parseInt(value);
  const warningElement = document.getElementById('length-warning');
  const inputElement = document.getElementById('length');

  if (length < 14) {
    warningElement.textContent = "La longitud mínima de la contraseña es 14 caracteres.";
    warningElement.style.display = 'block';
    inputElement.value = 14;
  } else {
    warningElement.style.display = 'none';
  }
}

function ensureSelectedOptionsIncluded(password, options) {
  const charsets = {
    useLowercase: 'abcdefghijklmnopqrstuvwxyz',
    useUppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    useNumbers: '0123456789',
    useSymbols: '!@#$%^&*',
    useBrackets: '[]{}()',
    useHighAnsi: '±¥µç'
  };

  for (let option in options) {
    if (options[option] && !new RegExp(`[${charsets[option]}]`).test(password)) {
      let randomChar = charsets[option][Math.floor(Math.random() * charsets[option].length)];
      let randomPosition = Math.floor(Math.random() * password.length);
      password = password.substring(0, randomPosition) + randomChar + password.substring(randomPosition + 1);
    }
  }

  return password;
}

function generateProportionalChars(charset, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  return result;
}

async function obtenerPalabras(numPalabras, idioma) {
  const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${numPalabras}&lang=${idioma}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function generatePassword() {
  const length = Math.max(14, parseInt(document.getElementById('length').value));
  const useLowercase = document.getElementById('lowercase').checked;
  const useUppercase = document.getElementById('uppercase').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;
  const useBrackets = document.getElementById('brackets').checked;
  const useHighAnsi = document.getElementById('high-ansi').checked;
  const useWords = document.getElementById('words').checked;
  const numWords = parseInt(document.getElementById('word-count').value);
  const selectedLanguage = document.getElementById('language-select').value;

  let charset = '';
  if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) charset += '0123456789';
  if (useSymbols) charset += '!@#$%^&*';
  if (useBrackets) charset += '[]{}()';
  if (useHighAnsi) charset += '±¥µç';

  if (charset === '' && !useWords) {
    document.getElementById('generated-password').textContent = 'SIN CONTRASEÑA GENERADA';
    actualizarInterfaz('', {}, false);
    return;
  }

  let password = '';

  if (useWords) {
    try {
      console.log("Intentando obtener palabras...");
      console.log("Número de palabras solicitadas:", numWords);
      console.log("Idioma seleccionado:", selectedLanguage);
      const words = await obtenerPalabras(numWords, selectedLanguage);
      console.log("Palabras obtenidas:", words);
      if (!words || words.length === 0) {
        throw new Error("No se obtuvieron palabras de la API");
      }
      password = words.join('-=-');
      while (password.length < length) {
        password += generateProportionalChars(charset, 1);
      }
    } catch (error) {
      console.error('Error detallado al obtener palabras:', error);
      document.getElementById('generated-password').textContent = 'Error al generar la contraseña';
      actualizarInterfaz('', {}, false);
      return;
    }
  } else {
    password = generateProportionalChars(charset, length);
  }

  const options = {
    useLowercase,
    useUppercase,
    useNumbers,
    useSymbols,
    useBrackets,
    useHighAnsi
  };

  password = ensureSelectedOptionsIncluded(password, options);

  document.getElementById('generated-password').textContent = password;
  actualizarInterfaz(password, options, useWords);
}

function copyPasswordToClipboard() {
  const password = document.getElementById('generated-password').textContent;
  if (password !== 'SIN CONTRASEÑA GENERADA' && password !== 'Error al generar la contraseña') {
    navigator.clipboard.writeText(password).then(() => {
      showCopiedNotification();
    });
  }
}

function initializePasswordGenerator() {
  const passwordGeneratorArea = document.getElementById('password-generator-area');

  passwordGeneratorArea.addEventListener('mousemove', function(e) {
    entropy += Math.abs(e.movementX) + Math.abs(e.movementY);

    const now = Date.now();
    if (entropy >= requiredEntropy && now - lastGenerationTime > GENERATION_INTERVAL) {
      generatePassword();
      lastGenerationTime = now;
      entropy = 0;
    }
  });

  passwordGeneratorArea.addEventListener('click', copyPasswordToClipboard);

  // Nuevo event listener para copiar la contraseña al hacer clic en ella
  document.getElementById('generated-password').addEventListener('click', copyPasswordToClipboard);
}

document.addEventListener('DOMContentLoaded', function() {
  initializePasswordGenerator();

  document.getElementById('generate-button').addEventListener('click', function() {
    entropy = generateRandomEntropy();
    generatePassword();
  });

  document.getElementById('copy-button').addEventListener('click', copyPasswordToClipboard);

  document.getElementById('words').addEventListener('change', toggleWordCount);

  document.getElementById('length').value = 14; // Asegura que el valor inicial sea 14
  updateLengthValue(document.getElementById('length').value);

  // Inicializar los selects de Materialize
  var elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);

  // Inicializar los inputs de Materialize
  M.updateTextFields();

  // Generar una contraseña inicial
  generatePassword();
});

function toggleOtherOptions(selectedId) {
  const isSelected = document.getElementById(selectedId).checked;
  if (isSelected) {
    document.getElementById('words').checked = false;
    document.getElementById('word-options-row').style.display = 'none';
    ['lowercase', 'uppercase', 'numbers', 'symbols', 'brackets', 'high-ansi'].forEach(option => {
      document.getElementById(option).disabled = false; 
    });
  } else {
    document.getElementById(selectedId).checked = false;
  }
  generatePassword();
}

function toggleWordCount() {
  const useWords = document.getElementById('words').checked;
  const wordOptionsRow = document.getElementById('word-options-row');
  wordOptionsRow.style.display = useWords ? 'block' : 'none';

  ['lowercase', 'uppercase', 'numbers', 'symbols', 'brackets', 'high-ansi'].forEach(option => {
    document.getElementById(option).disabled = useWords;
    if (useWords) {
      document.getElementById(option).checked = false;
    }
  });

  if (useWords) {
    // Reinicializar el select cuando se muestra
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }

  console.log("Generando nueva contraseña después de toggle words");
  generatePassword();
}

function showCopiedNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

function toggleMenu() {
  document.querySelector('.menu-icon').classList.toggle('change');
  document.getElementById('sideMenu').classList.toggle('open');
}

window.onclick = function(event) {
  if (!event.target.matches('.menu-icon') && !event.target.matches('.bar1') && !event.target.matches('.bar2') && !event.target.matches('.bar3')) {
    var menu = document.getElementById('sideMenu');
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      document.querySelector('.menu-icon').classList.remove('change');
    }
  }
}

function actualizarInterfaz(password, options, esBasadaEnPalabras) {
  const entropia = calculateRealEntropy(password);
  const fortaleza = evaluarFortaleza(entropia);
  const tiempoCraqueo = estimarTiempoCraqueo(entropia);

  document.getElementById('entropia-valor').textContent = entropia.toFixed(2) + " bits";
  document.getElementById('fortaleza-valor').textContent = fortaleza;
  document.getElementById('tiempo-craqueo').textContent = tiempoCraqueo;

  // Actualizar la clase basada en la fortaleza
  const fortalezaElement = document.getElementById('fortaleza-valor');
  fortalezaElement.className = 'fortaleza-' + fortaleza.split(' ')[1].toLowerCase().replace(' ', '-');
}