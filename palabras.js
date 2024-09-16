async function obtenerPalabras(numPalabras) {
  const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${numPalabras}`);
  const data = await response.json();
  return data;
}

export { obtenerPalabras };