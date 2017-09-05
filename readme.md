CodiceFiscale.js
===================


CodiceFiscale.js is a utility library to compute and validate Italian  Italian Tax code (codice fiscale).



Usage
=====

Compute
-------

Compute a codice fiscale given:

 - Name (String)
 - Surname (String)
 - Gender (String) ["M","F"]
 - Birthday day (Number)
 - Birthday month (Number)
 - Birthday year (Number)
 - Place of birth (String)
 - Province of birth (String)

```js
var cf = CodiceFiscale.compute("Enzo","Righi","M",24,7,1957,"Napoli", "NA");
```
or

```js
var cf = CodiceFiscale.compute({
    name: "Enzo",
    surname: "Righi",
    gender: "M",
    day: 24,
    month: 7,
    year: 1957,
    birthplace: "Napoli", 
    birthplace_provincia: "NA"});
```
**NEW**  Added support for foreign countries
===
Use the italian name of the foreign country (e.g. Francia, for France) as birthplace
and "EE" as birthplace provice
```js
var cf = CodiceFiscale.compute("Enzo","Righi","M",24,7,1957,"Francia", "EE");
```
or

```js
var cf = CodiceFiscale.compute({
    EEme: "Enzo",
    surname: "Righi",
    gender: "M",
    day: 24,
    month: 7,
    year: 1957,
    birthplace: "Francia", 
    birthplace_provincia: "EE"});
```

----------

Check
-------
Check if a codice fiscale is valid. It returns a **boolean** value.

```js
var isValid = CodiceFiscale.check("VNDLDL10A01G410Z");
```
----------
Omocodie
-------
Get all the omocodie for a given Codice Fiscale. It returns an array of strings

```js
var omocodie = CodiceFiscale.getOmocodie("VNDLDL10A01G410Z");
```


-------

## Available npm scripts:

- `npm run build`: build the bundle into `dist` directory.
- `npm run test`: launch the karma tests.
