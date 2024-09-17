// Función asíncrona para obtener palabras aleatorias de una API
async function obtenerPalabras(numPalabras) {
  // Realiza una solicitud a la API de palabras aleatorias
  const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${numPalabras}`);
  // Convierte la respuesta a formato JSON
  const data = await response.json();
  // Devuelve el array de palabras
  return data;
}