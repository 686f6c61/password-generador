// Función asincrónica para obtener un número determinado de palabras aleatorias desde una API externa.
async function obtenerPalabras(numPalabras) {
  // Realizamos una solicitud a la API 'random-word-api' para obtener el número de palabras especificado.
  // La URL incluye el parámetro `number` que corresponde a la cantidad de palabras solicitadas.
  const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${numPalabras}`);

  // Convertimos la respuesta de la API a formato JSON, lo que nos devuelve un array de palabras.
  const data = await response.json();

  // Devolvemos el array de palabras obtenidas.
  return data;
}

// Exportamos la función `obtenerPalabras` para que pueda ser utilizada en otros archivos, como `script.js`.
export { obtenerPalabras };
