# Javascript v1.2.0 Deprecated


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
var cf = CodiceFiscale.compute({
    name: "Enzo",
    surname: "Righi",
    gender: "M",
    day: 24,
    month: 7,
    year: 1957,
    birthplace: "Napoli", 
    birthplaceProvincia: "NA"});
```
Support foreign countries
===
Use the italian name of the foreign country (e.g. Francia, for France) as birthplace
and "EE" as birthplace_provincia
```js
var cf = CodiceFiscale.compute({
    name: "Enzo",
    surname: "Righi",
    gender: "M",
    day: 24,
    month: 7,
    year: 1957,
    birthplace: "Francia", 
    birthplaceProvincia: "EE"});
```
----------
Inverse Computation
-------
Get a person data for a given Codice Fiscale. It returns an **object**:

 - Name (String)
 - Surname (String)
 - Gender (String)
 - Birthday day (Number)
 - Birthday month (Number)
 - Birthday year [Number]
 - Place of birth (String)
 - Province of birth (String)

```js
var personData = CodiceFiscale.computeInverse("RGHNZE10L24F839E");

// personData
{
    name: "NZE",
    surname: "RGH",
    gender: "M",
    day: 24,
    month: 7
    year: [1910, 2010],
    birthplace: "NAPOLI",
    birthplaceProvincia: "NA"
}
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