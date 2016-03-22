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
