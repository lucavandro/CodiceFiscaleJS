module.exports = function(source) {
  // Trova l'inizio dell'array
  const arrayStart = source.indexOf('[');
  const arrayStr = source.substring(arrayStart, source.lastIndexOf(']') + 1);
  
  let comuni;
  try {
    comuni = eval(arrayStr);
  } catch(e) {
    // Se fallisce (improbabile), ritorna il sorgente originale intatto
    return source;
  }

  // Comprime l'array nella stringa delimitata
  const delimitedStr = comuni.map(c => c.join('|')).join(';');
  
  // Ritorna il codice ottimizzato per la build
  return `
const rawData = "${delimitedStr}";
export const COMUNI = rawData.split(';').map(row => {
    const parts = row.split('|');
    return [parts[0], parts[1], parts[2], parseInt(parts[3], 10)];
});
  `;
};
