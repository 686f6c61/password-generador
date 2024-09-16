import { obtenerPalabras } from './palabras.js';

let mouseMoveCount = 0;

// Función para garantizar que las opciones seleccionadas estén en la contraseña generada
function ensureSelectedOptionsIncluded(password, options) {
  options.forEach(option => {
    if (!option.regex.test(password)) {
      const randomIndex = Math.floor(Math.random() * option.chars.length);
      password += option.chars[randomIndex];
    }
  });
  return password;
}

// Función para generar caracteres basados en proporciones
function generateProportionalChars(charset, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

// Función para actualizar la contraseña generada según las opciones seleccionadas
async function generatePassword() {
  const length = parseInt(document.getElementById('length').value);
  const useLowercase = document.getElementById('lowercase').checked;
  const useUppercase = document.getElementById('uppercase').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;
  const useBrackets = document.getElementById('brackets').checked;
  const useHighAnsi = document.getElementById('high-ansi').checked;
  const useWords = document.getElementById('words').checked;

  let password = "";

  if (useWords) {
    // Generar contraseña con palabras
    const numWords = parseInt(document.getElementById('word-count').value);
    const words = await obtenerPalabras(numWords);
    password = words.join('-');
  } else {
    let symbols = "", numbers = "", uppercase = "", lowercase = "", brackets = "", highAnsi = "";
    let symbolsCount = 0, numbersCount = 0, uppercaseCount = 0, lowercaseCount = 0, bracketsCount = 0, highAnsiCount = 0;

    if (useSymbols) {
      symbols = "!@#$%^&*";
      symbolsCount = Math.ceil(length * 0.40);
    }
    if (useNumbers) {
      numbers = "0123456789";
      numbersCount = Math.ceil(length * 0.20);
    }
    if (useUppercase) {
      uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      uppercaseCount = Math.ceil(length * 0.25);
    }
    if (useLowercase) {
      lowercase = "abcdefghijklmnopqrstuvwxyz";
      lowercaseCount = Math.ceil(length * 0.15);
    }
    if (useBrackets) {
      brackets = "[]{}()";
      bracketsCount = Math.ceil(length * 0.10);
    }
    if (useHighAnsi) {
      highAnsi = "±¥µç";
      highAnsiCount = Math.ceil(length * 0.10);
    }

    const totalProportionalCount = symbolsCount + numbersCount + uppercaseCount + lowercaseCount + bracketsCount + highAnsiCount;
    const remainingCount = length - totalProportionalCount;

    if (remainingCount > 0) {
      const remainingChars = symbols + numbers + uppercase + lowercase + brackets + highAnsi;
      password += generateProportionalChars(remainingChars, remainingCount);
    }

    password += generateProportionalChars(symbols, symbolsCount);
    password += generateProportionalChars(numbers, numbersCount);
    password += generateProportionalChars(uppercase, uppercaseCount);
    password += generateProportionalChars(lowercase, lowercaseCount);
    password += generateProportionalChars(brackets, bracketsCount);
    password += generateProportionalChars(highAnsi, highAnsiCount);

    // Mezclamos los caracteres de la contraseña
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  document.getElementById('generated-password').innerText = password;
}

// Mostrar notificación de copiado
function showCopiedNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

// Evento para el área de generación de contraseñas
const passwordGeneratorArea = document.getElementById('password-generator-area');
passwordGeneratorArea.addEventListener('mousemove', function () {
  mouseMoveCount++;
  if (mouseMoveCount >= 5) {
    generatePassword();
    mouseMoveCount = 0; // Reiniciamos el contador
  }
});

// Evento para copiar al portapapeles al hacer clic en el área de generación de contraseñas
passwordGeneratorArea.addEventListener('click', function () {
  const password = document.getElementById('generated-password').innerText;
  const textarea = document.createElement('textarea');
  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showCopiedNotification();
});

// Evento para el botón Generar Contraseña
document.getElementById('generate-button').addEventListener('click', async function () {
  await generatePassword();
});

// Evento para el botón Copiar al Portapapeles
document.getElementById('copy-button').addEventListener('click', function () {
  const password = document.getElementById('generated-password').innerText;
  const textarea = document.createElement('textarea');
  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showCopiedNotification();
});