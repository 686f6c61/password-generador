// Variables globales
let lastGenerationTime = 0;
const GENERATION_INTERVAL = 100; // Intervalo mínimo entre generaciones (en ms)

// Función para actualizar el valor de longitud y mostrar advertencia si es necesario
function updateLengthValue(value) {
  const length = parseInt(value);
  const warningElement = document.getElementById('length-warning');

  if (length < 12) {
    warningElement.textContent = "Las contraseñas con una longitud inferior a 12 caracteres no están recomendadas en seguridad aunque la ISO 27001 recomiende mínimo 8";
    warningElement.style.display = 'block';
  } else {
    warningElement.style.display = 'none';
  }
}

// Función para asegurar que las opciones seleccionadas estén incluidas en la contraseña
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

// Función para generar caracteres proporcionales
function generateProportionalChars(charset, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  return result;
}

// Función principal para generar la contraseña
async function generatePassword() {
  const length = Math.max(12, parseInt(document.getElementById('length').value));
  const useLowercase = document.getElementById('lowercase').checked;
  const useUppercase = document.getElementById('uppercase').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;
  const useBrackets = document.getElementById('brackets').checked;
  const useHighAnsi = document.getElementById('high-ansi').checked;
  const useWords = document.getElementById('words').checked;
  const numWords = parseInt(document.getElementById('word-count').value);

  let charset = '';
  if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) charset += '0123456789';
  if (useSymbols) charset += '!@#$%^&*';
  if (useBrackets) charset += '[]{}()';
  if (useHighAnsi) charset += '±¥µç';

  let password = '';

  if (useWords) {
    const words = await obtenerPalabras(numWords);
    password = words.join('-=-');
    while (password.length < length) {
      password += generateProportionalChars(charset, 1);
    }
  } else {
    password = generateProportionalChars(charset, length);
  }

  password = ensureSelectedOptionsIncluded(password, {
    useLowercase,
    useUppercase,
    useNumbers,
    useSymbols,
    useBrackets,
    useHighAnsi
  });

  document.getElementById('generated-password').textContent = password;
}

// Función para generar contraseña con límite de frecuencia
function throttledGeneratePassword() {
  const now = Date.now();
  if (now - lastGenerationTime > GENERATION_INTERVAL) {
    generatePassword();
    lastGenerationTime = now;
  }
}

// Configuración de eventos cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  const passwordGeneratorArea = document.getElementById('password-generator-area');
  let isGenerating = false;

  passwordGeneratorArea.addEventListener('mousemove', function () {
    if (!isGenerating) {
      isGenerating = true;
      requestAnimationFrame(function updateGeneration() {
        throttledGeneratePassword();
        if (isGenerating) {
          requestAnimationFrame(updateGeneration);
        }
      });
    }
  });

  passwordGeneratorArea.addEventListener('mouseleave', function () {
    isGenerating = false;
  });

  passwordGeneratorArea.addEventListener('click', function () {
    const password = document.getElementById('generated-password').textContent;
    navigator.clipboard.writeText(password).then(() => {
      showCopiedNotification();
    });
  });

  document.getElementById('generate-button').addEventListener('click', generatePassword);

  document.getElementById('copy-button').addEventListener('click', function () {
    const password = document.getElementById('generated-password').textContent;
    navigator.clipboard.writeText(password).then(() => {
      showCopiedNotification();
    });
  });

  // Inicializa el estado de la advertencia
  updateLengthValue(document.getElementById('length').value);
});

// Función para alternar otras opciones cuando se selecciona una
function toggleOtherOptions(selectedId) {
  const isSelected = document.getElementById(selectedId).checked;
  if (isSelected) {
    document.getElementById('words').checked = false;
    document.getElementById('word-count-row').style.display = 'none';
    ['lowercase', 'uppercase', 'numbers', 'symbols', 'brackets', 'high-ansi'].forEach(option => {
      document.getElementById(option).disabled = false; 
    });
  } else {
    document.getElementById(selectedId).checked = false;
  }
}

// Función para mostrar/ocultar la opción de número de palabras
function toggleWordCount() {
  const useWords = document.getElementById('words').checked;
  const wordCountRow = document.getElementById('word-count-row');
  wordCountRow.style.display = useWords ? 'block' : 'none';

  ['lowercase', 'uppercase', 'numbers', 'symbols', 'brackets', 'high-ansi'].forEach(option => {
    document.getElementById(option).disabled = useWords;
    if (useWords) {
      document.getElementById(option).checked = false;
    }
  });
}

// Función para mostrar la notificación de copiado
function showCopiedNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

// Función para alternar el menú
function toggleMenu() {
  document.querySelector('.menu-icon').classList.toggle('change');
  document.getElementById('sideMenu').classList.toggle('open');
}

// Cerrar el menú si se hace clic fuera de él
window.onclick = function(event) {
  if (!event.target.matches('.menu-icon') && !event.target.matches('.bar1') && !event.target.matches('.bar2') && !event.target.matches('.bar3')) {
    var menu = document.getElementById('sideMenu');
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      document.querySelector('.menu-icon').classList.remove('change');
    }
  }
}

// Las funciones para cambiar el idioma se han eliminado ya que ahora usamos enlaces directos