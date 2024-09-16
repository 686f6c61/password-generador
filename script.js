// Importamos la función obtenerPalabras desde el archivo 'palabras.js'
import { obtenerPalabras } from './palabras.js';

let mouseMoveCount = 0; // Contador que lleva la cuenta de los movimientos del ratón

// Función que asegura que las opciones seleccionadas (minúsculas, mayúsculas, números, etc.) estén presentes en la contraseña generada
function ensureSelectedOptionsIncluded(password, options) {
  options.forEach(option => {
    // Si la opción seleccionada no está en la contraseña, se añade un carácter aleatorio de esa opción
    if (!option.regex.test(password)) {
      const randomIndex = Math.floor(Math.random() * option.chars.length);
      password += option.chars[randomIndex];
    }
  });
  return password; // Devolvemos la contraseña actualizada
}

// Función para generar caracteres basados en un conjunto (charset) y una cantidad (count)
function generateProportionalChars(charset, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex]; // Añadimos caracteres aleatorios del conjunto al resultado
  }
  return result; // Devolvemos la cadena generada
}

// Función principal que genera la contraseña según las opciones seleccionadas por el usuario
async function generatePassword() {
  const length = parseInt(document.getElementById('length').value); // Longitud de la contraseña elegida
  const useLowercase = document.getElementById('lowercase').checked; // Si se usan minúsculas
  const useUppercase = document.getElementById('uppercase').checked; // Si se usan mayúsculas
  const useNumbers = document.getElementById('numbers').checked; // Si se usan números
  const useSymbols = document.getElementById('symbols').checked; // Si se usan símbolos
  const useBrackets = document.getElementById('brackets').checked; // Si se usan brackets
  const useHighAnsi = document.getElementById('high-ansi').checked; // Si se usan caracteres ANSI
  const useWords = document.getElementById('words').checked; // Si se generan contraseñas basadas en palabras

  let password = ""; // Iniciamos la contraseña vacía

  if (useWords) {
    // Si se usa la opción de palabras, generamos una contraseña basada en palabras
    const numWords = parseInt(document.getElementById('word-count').value); // Cantidad de palabras seleccionadas
    const words = await obtenerPalabras(numWords); // Obtenemos las palabras usando la API
    password = words.join('-'); // Unimos las palabras con guiones
  } else {
    // Si no se usan palabras, generamos una contraseña basada en caracteres

    // Inicializamos las variables para almacenar los conjuntos de caracteres y sus cantidades
    let symbols = "", numbers = "", uppercase = "", lowercase = "", brackets = "", highAnsi = "";
    let symbolsCount = 0, numbersCount = 0, uppercaseCount = 0, lowercaseCount = 0, bracketsCount = 0, highAnsiCount = 0;

    // Asignamos los conjuntos de caracteres y sus cantidades dependiendo de las opciones seleccionadas
    if (useSymbols) {
      symbols = "!@#$%^&*";
      symbolsCount = Math.ceil(length * 0.40); // 40% de la longitud de la contraseña serán símbolos
    }
    if (useNumbers) {
      numbers = "0123456789";
      numbersCount = Math.ceil(length * 0.20); // 20% serán números
    }
    if (useUppercase) {
      uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      uppercaseCount = Math.ceil(length * 0.25); // 25% serán mayúsculas
    }
    if (useLowercase) {
      lowercase = "abcdefghijklmnopqrstuvwxyz";
      lowercaseCount = Math.ceil(length * 0.15); // 15% serán minúsculas
    }
    if (useBrackets) {
      brackets = "[]{}()";
      bracketsCount = Math.ceil(length * 0.10); // 10% serán brackets
    }
    if (useHighAnsi) {
      highAnsi = "±¥µç";
      highAnsiCount = Math.ceil(length * 0.10); // 10% serán caracteres ANSI
    }

    // Calculamos la cantidad de caracteres restantes para asegurarnos de que todas las opciones se incluyan correctamente
    const totalProportionalCount = symbolsCount + numbersCount + uppercaseCount + lowercaseCount + bracketsCount + highAnsiCount;
    const remainingCount = length - totalProportionalCount;

    // Si sobran caracteres, los generamos aleatoriamente de los conjuntos disponibles
    if (remainingCount > 0) {
      const remainingChars = symbols + numbers + uppercase + lowercase + brackets + highAnsi;
      password += generateProportionalChars(remainingChars, remainingCount);
    }

    // Añadimos los caracteres de cada opción según las cantidades calculadas
    password += generateProportionalChars(symbols, symbolsCount);
    password += generateProportionalChars(numbers, numbersCount);
    password += generateProportionalChars(uppercase, uppercaseCount);
    password += generateProportionalChars(lowercase, lowercaseCount);
    password += generateProportionalChars(brackets, bracketsCount);
    password += generateProportionalChars(highAnsi, highAnsiCount);

    // Mezclamos todos los caracteres de la contraseña para evitar que sigan un patrón
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  // Mostramos la contraseña generada en el elemento correspondiente en la interfaz
  document.getElementById('generated-password').innerText = password;
}

// Función que muestra una notificación cuando la contraseña se copia al portapapeles
function showCopiedNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'block'; // Mostramos la notificación
  setTimeout(() => {
    notification.style.display = 'none'; // Ocultamos la notificación después de 2 segundos
  }, 2000);
}

// Evento que genera la contraseña cuando el ratón se mueve dentro del área de generación de contraseñas
const passwordGeneratorArea = document.getElementById('password-generator-area');
passwordGeneratorArea.addEventListener('mousemove', function () {
  mouseMoveCount++; // Aumentamos el contador con cada movimiento del ratón
  if (mouseMoveCount >= 5) {
    // Si el ratón se ha movido 5 veces, generamos una nueva contraseña
    generatePassword();
    mouseMoveCount = 0; // Reiniciamos el contador
  }
});

// Evento para copiar la contraseña al portapapeles cuando se hace clic en el área de generación de contraseñas
passwordGeneratorArea.addEventListener('click', function () {
  const password = document.getElementById('generated-password').innerText; // Obtenemos la contraseña generada
  const textarea = document.createElement('textarea'); // Creamos un elemento textarea temporal
  textarea.value = password; // Establecemos la contraseña como valor del textarea
  document.body.appendChild(textarea); // Añadimos el textarea al documento
  textarea.select(); // Seleccionamos el texto en el textarea
  document.execCommand('copy'); // Copiamos el texto seleccionado al portapapeles
  document.body.removeChild(textarea); // Eliminamos el textarea del documento
  showCopiedNotification(); // Mostramos la notificación de copiado
});

// Evento para generar la contraseña cuando se hace clic en el botón "Generar Contraseña"
document.getElementById('generate-button').addEventListener('click', async function () {
  await generatePassword(); // Generamos la contraseña
});

// Evento para copiar la contraseña al portapapeles cuando se hace clic en el botón "Copiar al Portapapeles"
document.getElementById('copy-button').addEventListener('click', function () {
  const password = document.getElementById('generated-password').innerText; // Obtenemos la contraseña generada
  const textarea = document.createElement('textarea'); // Creamos un elemento textarea temporal
  textarea.value = password; // Establecemos la contraseña como valor del textarea
  document.body.appendChild(textarea); // Añadimos el textarea al documento
  textarea.select(); // Seleccionamos el texto en el textarea
  document.execCommand('copy'); // Copiamos el texto seleccionado al portapapeles
  document.body.removeChild(textarea); // Eliminamos el textarea del documento
  showCopiedNotification(); // Mostramos la notificación de copiado
});
