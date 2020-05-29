
#!/usr/bin/python
# -*- coding: iso-8859-1 -*-

import urllib.request
from os import path, curdir
import csv
import re
import os

# PERMALINK : do not change without a reason
ISTAT_DATA_URL = "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv"
ISTAT_FILE_NAME = "Elenco-comuni-italiani.csv"
ISTAT_FILE_PATH = path.join(curdir, ISTAT_FILE_NAME)

COMUNI_FILE_NAME = "lista-comuni.js"
COMUNI_FILE_PATH = path.join(curdir, 'src', COMUNI_FILE_NAME)

PROVINCE_FILE_NAME = "lista-province.js"
PROVINCE_FILE_PATH = path.join(curdir, 'src', PROVINCE_FILE_NAME)

print('Scarico i dati...')
urllib.request.urlretrieve(ISTAT_DATA_URL, ISTAT_FILE_PATH)

print('Download completato')
print('Lettura dei nuovi dati in corso')

nuova_lista_comuni = []
nuova_lista_province = []
with open(ISTAT_FILE_PATH) as csvfile:
    reader = csv.DictReader(csvfile, delimiter=';')
    #next(reader, None)  #skip the header

    for row in reader:
        cod  = row['Codice Catastale del comune']
        prov = row['Sigla automobilistica']
        name = row["Denominazione in italiano"]
        
        
        # Remove accents and use uppercase for comune's name
        name = name.lower()

        # Remove a the end of a word
        name = re.compile(r"(à|á)(?=\s|$|-)").sub( "a'", name)
        name = re.compile(r"(è|é)(?=\s|$|-)").sub( "e'", name)
        name = re.compile(r"(ì|í)(?=\s|$|-)").sub( "i'", name)
        name = re.compile(r"(ò|ó)(?=\s|$|-)").sub( "o'", name)
        name = re.compile(r"(ù|ú)(?=\s|$|-)").sub( "u'", name)
        
        #Remove inside a word
        name = name.translate(str.maketrans("àáâêèéìíôòóùúç","aaaeeeiiooouuc"))
        
        #make everything uppercase and remove empty spaces 
        name = name.upper().strip()


        nuova_lista_comuni.append([ cod, prov, name])

print("Confronto i nuovi dati con quelli presenti")
with open(COMUNI_FILE_PATH, 'r') as f:
    txt = f.read()
    txt = txt.replace("export const COMUNI = ", "")
    lista_comuni = eval(txt)
    for comune in lista_comuni:
        del comune[3]

with open(PROVINCE_FILE_PATH, 'r') as f:
    txt = f.read()
    txt = txt.replace("export const PROVINCE = ", "").replace(':', '":').replace(",\n",",\n\"").replace("{\n","{\n\"")
    lista_province = eval(txt+"\n").keys()



nuove_province = []
nuovi_comuni = []
for comune in nuova_lista_comuni:
    if comune not in lista_comuni:
        lista_comuni.append(comune)
        nuovi_comuni.append(comune)
    if comune[1] not in lista_province:
        nuove_province.append(comune[1])


for comune in lista_comuni:
    if comune[:3] in nuova_lista_comuni:
        try:
            comune[3] = 1 
        except:
            comune.append(1)
    else:
        try:
            comune[3] = 0  
        except:
            comune.append(0)

nuove_province = list(set(nuove_province)) # Remove duplicates

print(f"Trovati {len(nuovi_comuni)} nuovi comuni")
print(f"Trovati {len(nuove_province)} nuove province")

# Nuove province
if len(nuove_province):
    NUOVE_PROVINCE_FILE_NAME = "nuove_province.txt"
    NUOVE_PROVINCE_FILE_PATH = path.join(curdir,  NUOVE_PROVINCE_FILE_NAME)
    print(f"Le sigle delle nuove province sono salvate nel file {NUOVE_PROVINCE_FILE_NAME}")
    with open(NUOVE_PROVINCE_FILE_PATH, 'w') as f:
        for provincia in nuove_province:
            print(provincia, file=f)
        f.close()

# Sorting
comuni_txt = list(map(lambda x: "\r,\r".join([x[2],x[0],x[1],str(x[3])]), lista_comuni))
comuni_txt.sort()

with open(COMUNI_FILE_PATH,'w') as f:
    f.write("export const COMUNI = [ ")
    last_idx = len(comuni_txt) - 1 
    for i, el in enumerate(comuni_txt):
        comps = el.split("\r,\r")
        if " * " in comps[0]:
            comps[0] = comps[0].split(" * ")[0]
        f.write(f"[\"{comps[1]}\",\"{comps[2]}\",\"{comps[0]}\",{comps[3]}]")
        if i != last_idx:
            f.write(",")
        f.write("\n")
    f.write("]")


print(f"File {COMUNI_FILE_NAME} aggiornato")
# Clean up
os.remove(ISTAT_FILE_PATH)