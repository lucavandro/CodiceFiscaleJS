# This fork is no longer maintained. Check out the original repository instead.
------------------

# CodiceFiscale.js
A utility library to compute, validate and reverse compute the Italian tax code, called *Codice Fiscale*.

------------------
## NPM SCRIPTS
- `npm run build`  
build the bundle into *dist* directory

- `npm run test`  
launch the karma tests

----------
## METHODS
- [compute](#compute)  
compute a Codice Fiscale

- [computeInverse](#computeinverse)  
reverse compute a person data for a given Codice Fiscale

- [check](#check)  
check if a Codice Fiscale is valid

- [getOmocodie](#getomocodie)  
get all the *omocodie* (i.e. eligible variations) for a given Codice Fiscale

----------
## compute
Compute a Codice Fiscale given:
 - Name `string`
 - Surname `string`
 - Gender `string ["M", "F"]`
 - Birthday day `number`
 - Birthday month `number`
 - Birthday year `number`
 - Place of birth `string`
 - Province of birth `string`

 Returns a **`string`**
```js
var cf = CodiceFiscale.compute("Enzo", "Righi", "M", 24, 7, 1957, "Napoli", "NA");
console.log(cf);

"RGHNZE57L24F839Y"
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
    birthplace_province: "NA"
});
console.log(cf);

"RGHNZE57L24F839Y"
```
### Support for foreign countries
Use the italian name of the foreign country as *birthplace* (e.g. "Francia" for "France"),  
and "EE" for *birthplace_province*
```js
var cf = CodiceFiscale.compute("Enzo", "Righi", "M", 24, 7, 1957, "Francia", "EE");
console.log(cf);

"RGHNZE57L24Z110D"
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
    birthplace: "Francia", 
    birthplace_province: "EE"
});
console.log(cf);

"RGHNZE57L24Z110D"
```
-----------------
## computeInverse
Reverse compute a person data for a given Codice Fiscale.

Returns an **`object`**:
 - Name `[{number, string}] or string`
 - Surname `[{number, string}] or string`
 - Gender `string`
 - Birthday day `number`
 - Birthday month `number`
 - Birthday year `[number]`
 - Place of birth `string`
 - Province of birth `string`

```js
var personData = CodiceFiscale.computeInverse("RGHLVT57L24F839Y")
console.log(personData);

{
    // if name and surname are unknonw
    name:    "LVT",
    surname: "RGN",
    // if name and surname are known
    name: [
        {frequency: 40, name: "LUCA VITTORIO"}
        {frequency: 20, name: "LUIGI VITTORIO"}
        {frequency: 18, name: "LUCA VITO"}
        {frequency: 6,  name: "LUIGI VITO"}
        ...
    ],
    surname: [
        {frequency: 1536, surname: "RIGHI"}
        {frequency: 1141, surname: "RIGHETTI"}
        {frequency: 291,  surname: "RIGHINI"}
        {frequency: 226,  surname: "RIGHETTO"}
        ...
    ],
    gender: "M",
    day: 24,
    month: 7
    year: [1910, 2010],
    birthplace: "NAPOLI",
    birthplace_province: "NA"
}
```
--------
## check
Check if a Codice Fiscale is valid.

Returns a **`boolean`**

```js
var isValid = CodiceFiscale.check("VNDLDL10A01G410Z");
console.log(isValid);

true
```
----------
## getOmocodie
Get all the *omocodie* (i.e. eligible variations) for a given Codice Fiscale.

Returns an **`array of strings`**
```js
var omocodie = CodiceFiscale.getOmocodie("VNDLDL10A01G410Z");
console.log(omocodie);

 ["VNDLDL10A01G41LC", "VNDLDL10A01G4MLN", ..., "VNDLDL1LALMGQMLY", "VNDLDLMLALMGQMLQ"]
```
