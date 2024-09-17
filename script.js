  // Variables globales
  let lastGenerationTime = 0;
  const GENERATION_INTERVAL = 100; // Intervalo mínimo entre generaciones (en ms)

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
    // Obtener valores de los inputs y checkboxes
    const length = parseInt(document.getElementById('length').value);
    const useLowercase = document.getElementById('lowercase').checked;
    const useUppercase = document.getElementById('uppercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;
    const useBrackets = document.getElementById('brackets').checked;
    const useHighAnsi = document.getElementById('high-ansi').checked;
    const useWords = document.getElementById('words').checked;
    const numWords = parseInt(document.getElementById('word-count').value);

    // Construir el conjunto de caracteres basado en las opciones seleccionadas
    let charset = '';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*';
    if (useBrackets) charset += '[]{}()';
    if (useHighAnsi) charset += '±¥µç';

    let password = '';

    // Generar contraseña basada en palabras si la opción está seleccionada
    if (useWords) {
      const words = await obtenerPalabras(numWords);
      password = words.join('-');
      while (password.length < length) {
        password += generateProportionalChars(charset, 1);
      }
    } else {
      password = generateProportionalChars(charset, length);
    }

    // Asegurar que la contraseña incluya al menos un carácter de cada tipo seleccionado
    password = ensureSelectedOptionsIncluded(password, {
      useLowercase,
      useUppercase,
      useNumbers,
      useSymbols,
      useBrackets,
      useHighAnsi
    });

    // Mostrar la contraseña generada
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

    // Evento para generar contraseña al mover el ratón
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

    // Detener la generación cuando el ratón sale del área
    passwordGeneratorArea.addEventListener('mouseleave', function () {
      isGenerating = false;
    });

    // Copiar contraseña al hacer clic en el área de generación
    passwordGeneratorArea.addEventListener('click', function () {
      const password = document.getElementById('generated-password').textContent;
      navigator.clipboard.writeText(password).then(() => {
        showCopiedNotification();
      });
    });

    // Evento para el botón de generar contraseña
    document.getElementById('generate-button').addEventListener('click', generatePassword);

    // Evento para el botón de copiar contraseña
    document.getElementById('copy-button').addEventListener('click', function () {
      const password = document.getElementById('generated-password').textContent;
      navigator.clipboard.writeText(password).then(() => {
        showCopiedNotification();
      });
    });
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