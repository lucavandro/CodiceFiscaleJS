const catastalCodes = require('./catastal-codes.json');
// retrieved from istat (paginebianche will not divide by gender)
const nameCodes  = require('./name-codes.json');
// retrieved from paginebianche
const surnameCodes = require('./surname-codes.json');

var CodiceFiscale = CodiceFiscale || {};

CodiceFiscale.compute=function(name,surname,gender,day,month,year,birthplace, birthplace_province){

    // Pass an object as parameter

    if(
      typeof name == 'object'
    ){
        var params = name;
        name       = params['name'],
        surname    = params['surname'],
        gender     = params['gender'],
        day        = params['day'],
        month      = params['month'],
        year       = params['year'],
        birthplace = params['birthplace'],
        birthplace_province = params['birthplace_province'];
    }

    var code=
      this.surnameCode(surname)+
      this.nameCode(name)+
      this.dateCode(day,month,year,gender)+
      this.findComuneCode(birthplace, birthplace_province);

    code+=this.getCheckCode(code);

    return code;

}
CodiceFiscale.check = function(codiceFiscale){
  if(typeof codiceFiscale !== 'string') return false;
  codiceFiscale = codiceFiscale.toUpperCase();
  if(codiceFiscale.length !== 16) return false;
  var expectedCheckCode = codiceFiscale.charAt(15);
  var cf = codiceFiscale.slice(0,15);

  return CodiceFiscale.getCheckCode(cf) == expectedCheckCode;

}
CodiceFiscale.getCheckCode=function(codiceFiscale){
  var val=0;
  for(var i=0; i<15 ;i++){
    var c=codiceFiscale[i];
    val+= i%2 ? this.CHECK_CODE_EVEN[c] : this.CHECK_CODE_ODD[c];
  }
  val=val%26;
  return this.CHECK_CODE_CHARS.charAt(val);
}

CodiceFiscale.estraiConsonanti=function(str){
  return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi,'');
}

CodiceFiscale.estraiVocali=function(str){
  return str.replace(/[^AEIOU]/gi,'');
}

CodiceFiscale.surnameCode=function(surname){
  var code_surname = this.estraiConsonanti(surname) + this.estraiVocali(surname) + 'XXX';
  return code_surname.substr(0,3).toUpperCase();
}

CodiceFiscale.nameCode=function(name){
  var codNome = this.estraiConsonanti(name);
  if(codNome.length>=4){
    codNome= codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3);
  }else{
    codNome+= this.estraiVocali(name) + 'XXX';
    codNome=codNome.substr(0,3);
  }
  return codNome.toUpperCase();
}

CodiceFiscale.dateCode=function(gg,mm,aa,gender){
  var date=new Date();
  date.setYear(aa);
  date.setMonth(mm-1);
  date.setDate(gg);
  // Padding year
  var year="0"+date.getFullYear();
  year=year.substr(year.length-2,2);

  var month=this.MONTH_CODES[date.getMonth()];
  var day=date.getDate();
  if(gender.toUpperCase()=='F') day+=40;

  // Padding day
  day="0"+day;
  day=day.substr(day.length-2,2);
  return String(year+month+day);
}


CodiceFiscale.findComuneCode=function(birthplace, birthplace_province){
  for (var i = this.CODICI_CATASTALI[birthplace_province].length - 1; i >= 0; i--) {
    var comune = this.CODICI_CATASTALI[birthplace_province][i];
    if(comune[0] == birthplace.trim().toUpperCase()) return comune[1];
  }
  throw Error("Comune not found");
}

CodiceFiscale.getOmocodie = function(code){
  var results = [];
  var lastOmocode = code = code.slice(0,15);
  for (var i = code.length - 1; i >= 0; i--) {
    var char = code[i];
    if(char.match(/\d/)){
      lastOmocode = lastOmocode.substr(0,i) + this.OMOCODIA_TABLE[char] + lastOmocode.substr(i+1);
      results.push(lastOmocode + this.getCheckCode(lastOmocode));
    }
  }
  return results;
}

CodiceFiscale.computeInverse = function(codiceFiscale) {
  var isValid = this.check(codiceFiscale);

  if (isValid) {
    codiceFiscale = codiceFiscale.toUpperCase();
  } else {
    throw new TypeError('\'' + codiceFiscale + '\' is not a valid Codice Fiscale');
  }

  var surname = codiceFiscale.substr(0, 3);
  surname = this.CODICI_COGNOMI[surname] || surname;

  var year = codiceFiscale.substr(6, 2);
  var yearList = [];
  var year19XX = parseInt('19' + year);
  var year20XX = parseInt('20' + year);
  var currentYear20XX = (new Date()).getFullYear();
  yearList.push(year19XX);
  if (currentYear20XX - year20XX >= 0) {
    yearList.push(year20XX);
  }

  var monthChar = codiceFiscale.substr(8, 1);
  var month = this.MONTH_CODES.indexOf(monthChar) + 1;

  var gender = 'M';
  var day = parseInt(codiceFiscale.substr(9, 2));
  if (day > 31) {
    gender = 'F';
    day = day - 40;
  }

  var name = codiceFiscale.substr(3, 3);
  name = this.CODICI_NOMI[gender][name] || name;

  var birthplace = '';
  var birthplace_province = '';
  for (var province in this.CODICI_CATASTALI) {
    birthplace = this.CODICI_CATASTALI[province].find(function(code) {
      return code[1] === codiceFiscale.substr(11, 4);
    })
    if (!!birthplace) {
      birthplace = birthplace[0];
      birthplace_province = province;
      break
    }
  }

  return {
    name:                 name,
    surname:              surname,
    gender:               gender,
    day:                  day,
    month:                month,
    year:                 yearList,
    birthplace:           birthplace,
    birthplace_province: birthplace_province
  }
}


CodiceFiscale.MONTH_CODES = ['A','B','C','D','E','H','L','M','P','R','S','T'];

CodiceFiscale.CHECK_CODE_ODD = {
  0:1,  1:0,  2:5,  3:7,  4:9,  5:13, 6:15, 7:17, 8:19,
  9:21, A:1,  B:0,  C:5,  D:7,  E:9,  F:13, G:15, H:17,
  I:19, J:21, K:2,  L:4,  M:18, N:20, O:11, P:3,  Q:6,
  R:8,  S:12, T:14, U:16, V:10, W:22, X:25, Y:24, Z:23
};

CodiceFiscale.CHECK_CODE_EVEN = {
  0:0,  1:1,   2:2,  3:3,   4:4,  5:5,  6:6,  7:7,  8:8,
  9:9,  A:0,   B:1,  C:2,   D:3,  E:4,  F:5,  G:6,  H:7,
  I:8,  J:9,   K:10, L:11,  M:12, N:13, O:14, P:15, Q:16,
  R:17, S:18,  T:19, U:20,  V:21, W:22, X:23, Y:24, Z:25
};

CodiceFiscale.OMOCODIA_TABLE = {
  "0":"L", "1":"M", "2":"N", "3":"P", "4":"Q",
  "5":"R", "6":"S", "7":"T", "8":"U", "9":"V"};

CodiceFiscale.CHECK_CODE_CHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

CodiceFiscale.CODICI_CATASTALI = catastalCodes;
CodiceFiscale.CODICI_COGNOMI = surnameCodes;
CodiceFiscale.CODICI_NOMI = nameCodes;

module.exports = CodiceFiscale;
