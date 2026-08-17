const fs = require('fs');
const path = require('path');

const ISTAT_DATA_URL = "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";
const ISTAT_FILE_NAME = "Elenco-comuni-italiani.csv";
const ISTAT_FILE_PATH = path.join(__dirname, ISTAT_FILE_NAME);

const COMUNI_FILE_NAME = "lista-comuni.js";
const COMUNI_FILE_PATH = path.join(__dirname, 'src', COMUNI_FILE_NAME);

const PROVINCE_FILE_NAME = "lista-province.js";
const PROVINCE_FILE_PATH = path.join(__dirname, 'src', PROVINCE_FILE_NAME);

async function main() {
    console.log('Scarico i dati...');
    try {
        const response = await fetch(ISTAT_DATA_URL);
        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(ISTAT_FILE_PATH, Buffer.from(arrayBuffer));
        console.log('Download completato');
    } catch (e) {
        console.error('Errore durante il download:', e);
        return;
    }

    function parseCSV(text) {
        let result = [];
        let row = [];
        let inQuotes = false;
        let value = '';
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (inQuotes) {
                if (char === '"') {
                    if (text[i + 1] === '"') {
                        value += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    value += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ';') {
                    row.push(value);
                    value = '';
                } else if (char === '\n' || char === '\r') {
                    if (char === '\r' && text[i + 1] === '\n') i++;
                    row.push(value);
                    result.push(row);
                    row = [];
                    value = '';
                } else {
                    value += char;
                }
            }
        }
        if (value || row.length > 0) {
            row.push(value);
            result.push(row);
        }
        return result;
    }

    console.log('Lettura dei nuovi dati in corso');
    const csvContent = fs.readFileSync(ISTAT_FILE_PATH, 'latin1');
    const parsedCsv = parseCSV(csvContent);
    
    const headers = parsedCsv[0];
    const codCatastaleIdx = headers.indexOf('Codice Catastale del comune');
    const siglaAutoIdx = headers.indexOf('Sigla automobilistica');
    const denomItaIdx = headers.indexOf('Denominazione in italiano');

    if (codCatastaleIdx === -1 || siglaAutoIdx === -1 || denomItaIdx === -1) {
        console.error('Error: Impossibile trovare le colonne necessarie nel CSV.');
        console.error('Trovate colonne:', headers);
        return;
    }

    const nuova_lista_comuni = [];
    
    for (let i = 1; i < parsedCsv.length; i++) {
        let cols = parsedCsv[i];
        if (cols.length < Math.max(codCatastaleIdx, siglaAutoIdx, denomItaIdx)) continue;
        
        let cod = cols[codCatastaleIdx];
        let prov = cols[siglaAutoIdx];
        let name = cols[denomItaIdx];
        
        if (!cod || !name) continue;

        // Remove quotes if present
        if (cod.startsWith('"')) cod = cod.slice(1, -1);
        if (prov && prov.startsWith('"')) prov = prov.slice(1, -1);
        if (name.startsWith('"')) name = name.slice(1, -1);

        name = name.toLowerCase();

        // Remove at the end of a word
        name = name.replace(/(à|á)(?=\s|$|-)/g, "a'");
        name = name.replace(/(è|é)(?=\s|$|-)/g, "e'");
        name = name.replace(/(ì|í)(?=\s|$|-)/g, "i'");
        name = name.replace(/(ò|ó)(?=\s|$|-)/g, "o'");
        name = name.replace(/(ù|ú)(?=\s|$|-)/g, "u'");
        
        // Remove inside a word
        const map = {'à':'a', 'á':'a', 'â':'a', 'ê':'e', 'è':'e', 'é':'e', 'ì':'i', 'í':'i', 'ô':'o', 'ò':'o', 'ó':'o', 'ù':'u', 'ú':'u', 'ç':'c'};
        name = name.replace(/[àáâêèéìíôòóùúç]/g, m => map[m] || m);
        
        name = name.toUpperCase().trim();

        nuova_lista_comuni.push([cod, prov, name]);
    }

    console.log("Confronto i nuovi dati con quelli presenti");
    
    // Read current COMUNI
    let txtComuni = fs.readFileSync(COMUNI_FILE_PATH, 'utf8');
    const arrayStart = txtComuni.indexOf('[');
    const arrayStr = txtComuni.substring(arrayStart, txtComuni.lastIndexOf(']') + 1);
    let lista_comuni = eval(arrayStr);
    
    // For original flag preservation
    const originalFlags = new Map();
    lista_comuni.forEach(comune => {
        originalFlags.set(comune[0], comune[3]);
        if (comune.length > 3) comune.splice(3, 1);
    });

    // Read current PROVINCE
    let txtProvince = fs.readFileSync(PROVINCE_FILE_PATH, 'utf8');
    txtProvince = txtProvince.replace("export const PROVINCE = ", "").replace(/:/g, '":').replace(/,\r?\n/g, ',\n"').replace(/\{\r?\n/g, '{\n"');
    let lista_province = Object.keys(eval(`(${txtProvince})`));

    const nuove_province = new Set();
    const nuovi_comuni = [];

    // Helper to check if array exists
    const stringified_lista_comuni = new Set(lista_comuni.map(c => JSON.stringify(c)));

    for (let comune of nuova_lista_comuni) {
        if (!stringified_lista_comuni.has(JSON.stringify(comune))) {
            lista_comuni.push(comune);
            nuovi_comuni.push(comune);
            stringified_lista_comuni.add(JSON.stringify(comune));
        }
        if (!lista_province.includes(comune[1])) {
            nuove_province.add(comune[1]);
        }
    }

    const stringified_nuova_lista = new Set(nuova_lista_comuni.map(c => JSON.stringify([c[0], c[1], c[2]])));

    // Re-add flags
    for (let comune of lista_comuni) {
        const baseComune = [comune[0], comune[1], comune[2]];
        
        if (comune[1] === 'EE') {
            // Keep original flag for foreign countries (default to 1 if new)
            comune[3] = originalFlags.has(comune[0]) ? originalFlags.get(comune[0]) : 1;
        } else if (stringified_nuova_lista.has(JSON.stringify(baseComune))) {
            comune[3] = 1;
        } else {
            comune[3] = 0;
        }
    }

    console.log(`Trovati ${nuovi_comuni.length} nuovi comuni`);
    console.log(`Trovate ${nuove_province.size} nuove province`);

    if (nuove_province.size > 0) {
        const NUOVE_PROVINCE_FILE_NAME = "nuove_province.txt";
        const NUOVE_PROVINCE_FILE_PATH = path.join(__dirname, NUOVE_PROVINCE_FILE_NAME);
        console.log(`Le sigle delle nuove province sono salvate nel file ${NUOVE_PROVINCE_FILE_NAME}`);
        fs.writeFileSync(NUOVE_PROVINCE_FILE_PATH, Array.from(nuove_province).join('\n') + '\n');
    }

    // Sorting
    lista_comuni.sort((a, b) => {
        // python script sorted by: "\r,\r".join([x[2],x[0],x[1],str(x[3])])
        const strA = [a[2], a[0], a[1], String(a[3])].join("\r,\r");
        const strB = [b[2], b[0], b[1], String(b[3])].join("\r,\r");
        if (strA < strB) return -1;
        if (strA > strB) return 1;
        return 0;
    });

    let outStream = fs.createWriteStream(COMUNI_FILE_PATH);
    outStream.write("export const COMUNI = [ \n");
    for (let i = 0; i < lista_comuni.length; i++) {
        let c = lista_comuni[i];
        let name = c[2];
        if (name.includes(" * ")) {
            name = name.split(" * ")[0];
        }
        outStream.write(`["${c[0]}","${c[1]}","${name}",${c[3]}]`);
        if (i !== lista_comuni.length - 1) {
            outStream.write(",\n");
        } else {
            outStream.write("\n");
        }
    }
    outStream.write("]\n");
    outStream.end();

    console.log(`File ${COMUNI_FILE_NAME} aggiornato`);

    // Clean up
    if (fs.existsSync(ISTAT_FILE_PATH)) {
        fs.unlinkSync(ISTAT_FILE_PATH);
    }
}

main();
