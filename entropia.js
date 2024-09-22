// entropia.js

function calcularEntropia(contrasena, opciones, esBasadaEnPalabras) {
  if (contrasena === '' || contrasena === 'SIN CONTRASEÑA GENERADA' || contrasena === 'Error al generar la contraseña') {
    return 0;
  }

  // Si la contraseña está basada en palabras
  if (esBasadaEnPalabras) {
    // Definir los bits de entropía por palabra
    const bitsPorPalabra = 12; // Este valor puede ajustarse según el tamaño real del vocabulario
    
    // Separar las palabras usando el separador '-=-'
    const palabras = contrasena.split('-=-').filter(palabra => palabra.trim() !== '');
    const numeroDePalabras = palabras.length;
    
    // Calcular la entropía de las palabras
    let entropia = numeroDePalabras * bitsPorPalabra;
    
    // Calcular la entropía de los separadores
    const numeroDeSeparadores = numeroDePalabras - 1;
    if (numeroDeSeparadores > 0) {
      const bitsPorSeparador = Math.log2(3); // Suponiendo 3 opciones de separador
      entropia += numeroDeSeparadores * bitsPorSeparador;
    }
    
    // Calcular la entropía de caracteres adicionales si la contraseña es más larga de lo esperado
    const longitudEsperada = palabras.join('-=-').length;
    const longitudActual = contrasena.length;
    const longitudAdicional = longitudActual - longitudEsperada - (numeroDeSeparadores * 3); // 3 caracteres por separador
    
    if (longitudAdicional > 0) {
      const conjuntoCaracteres = obtenerConjuntoCaracteres(opciones);
      entropia += longitudAdicional * Math.log2(conjuntoCaracteres.length);
    }
    
    return entropia;
  } else {
    // Para contraseñas basadas en caracteres
    const conjuntoCaracteres = obtenerConjuntoCaracteres(opciones);
    
    // Si el conjunto de caracteres está vacío, la entropía es 0
    if (conjuntoCaracteres.length === 0) return 0;
    
    // Calcular la entropía: longitud de la contraseña * log2(tamaño del conjunto de caracteres)
    const entropia = contrasena.length * Math.log2(conjuntoCaracteres.length);
    return entropia;
  }
}

function obtenerConjuntoCaracteres(opciones) {
  let conjunto = '';
  if (opciones.useLowercase) conjunto += 'abcdefghijklmnopqrstuvwxyz';
  if (opciones.useUppercase) conjunto += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opciones.useNumbers) conjunto += '0123456789';
  if (opciones.useSymbols) conjunto += '!@#$%^&*';
  if (opciones.useBrackets) conjunto += '[]{}()';
  if (opciones.useHighAnsi) conjunto += '±¥µç';
  return conjunto;
}

function evaluarFortaleza(entropia) {
  if (entropia < 28) return '😢 Muy débil';
  if (entropia < 36) return '🙁 Débil';
  if (entropia < 60) return '😐 Razonable';
  if (entropia < 128) return '🙂 Fuerte';
  return '😄 Muy fuerte';
}

function estimarTiempoCraqueo(entropia) {
  const intentosPorSegundo = 1e9; // Asumimos 1 billón de intentos por segundo
  const segundos = Math.pow(2, entropia) / intentosPorSegundo;
  
  if (segundos < 60) return 'menos de un minuto';
  if (segundos < 3600) return `${Math.floor(segundos / 60)} minutos`;
  if (segundos < 86400) return `${Math.floor(segundos / 3600)} horas`;
  if (segundos < 31536000) return `${Math.floor(segundos / 86400)} días`;
  if (segundos < 315360000) return `${Math.floor(segundos / 31536000)} años`;
  return 'más de 10 años';
}

function actualizarEntropiaYFortaleza(password, opciones, esBasadaEnPalabras) {
  const entropia = calcularEntropia(password, opciones, esBasadaEnPalabras);
  const fortaleza = evaluarFortaleza(entropia);
  const tiempoCraqueo = estimarTiempoCraqueo(entropia);

  const entropiaElement = document.getElementById('entropia-valor');
  const fortalezaElement = document.getElementById('fortaleza-valor');
  const tiempoCraqueoElement = document.getElementById('tiempo-craqueo');

  entropiaElement.textContent = entropia.toFixed(2) + " bits";
  fortalezaElement.textContent = fortaleza;
  tiempoCraqueoElement.textContent = tiempoCraqueo;

  // Actualizar la clase basada en la fortaleza
  fortalezaElement.className = 'fortaleza-' + fortaleza.split(' ')[1].toLowerCase().replace(' ', '-');
}