"use strict";

var _comune = require("./comune");

var _constants = require("./constants");

var _utils = require("./utils");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CodiceFiscale =
/*#__PURE__*/
function () {
  _createClass(CodiceFiscale, [{
    key: "day",
    get: function get() {
      return this.birthday.getDate();
    },
    set: function set(d) {
      this.birthday.setDate(d);
    }
  }, {
    key: "month",
    get: function get() {
      return this.birthday.getMonth() + 1;
    },
    set: function set(m) {
      this.birthday.setMonth(m - 1);
    }
  }, {
    key: "year",
    get: function get() {
      return this.birthday.getFullYear();
    },
    set: function set(y) {
      this.birthday.setFullYear(y);
    }
  }, {
    key: "cf",
    get: function get() {
      return this.code;
    }
  }, {
    key: "nameCode",
    get: function get() {
      return this.code.substr(3, 3);
    }
  }, {
    key: "surnameCode",
    get: function get() {
      return this.code.substr(0, 3);
    }
  }, {
    key: "checkCode",
    get: function get() {
      return this.code.substr(15, 1);
    }
  }]);

  function CodiceFiscale(data) {
    _classCallCheck(this, CodiceFiscale);

    if (typeof data === 'string') {
      if (CodiceFiscale.check(data)) {
        this.code = data;
        this.reverse();
      } else {
        throw new Error('Provided input is not a valid Codice Fiscale');
      }
    } else if (_typeof(data) === 'object') {
      var cfData = data;
      this.name = cfData.name;
      this.surname = cfData.surname;
      this.gender = this.checkGender(cfData.gender);
      this.birthday = cfData.birthday ? (0, _utils.getValidDate)(cfData.birthday) : (0, _utils.getValidDate)(cfData.day, cfData.month, cfData.year);
      this.birthplace = new _comune.Comune(cfData.birthplace, cfData.birthplaceProvincia);
      this.compute();
    } else {
      throw new Error('Comune constructor accept either a string or a plain object. Check the documentation');
    }
  }

  _createClass(CodiceFiscale, [{
    key: "toString",
    value: function toString() {
      return this.code;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        surname: this.surname,
        gender: this.gender,
        birthday: this.birthday.getFullYear() + '-' + ('00' + this.birthday.getMonth()).slice(-2) + '-' + ('00' + this.birthday.getDate()).slice(-2),
        birthplace: this.birthplace.nome,
        birthplaceProvincia: this.birthplace.prov,
        cf: this.code
      };
    }
  }, {
    key: "isValid",
    value: function isValid() {
      if (typeof this.code !== 'string') {
        return false;
      }

      this.code = this.code.toUpperCase();

      if (this.code.length !== 16) {
        return false;
      }

      var expectedCheckCode = this.code.charAt(15);
      var cf = this.code.slice(0, 15);
      return CodiceFiscale.getCheckCode(cf) === expectedCheckCode;
    }
  }, {
    key: "omocodie",
    value: function omocodie() {
      var results = [];
      var lastOmocode = this.code = this.code.slice(0, 15);

      for (var i = this.code.length - 1; i >= 0; i = i - 1) {
        var char = this.code[i];

        if (char.match(/\d/) !== null) {
          lastOmocode = "".concat(lastOmocode.substr(0, i)).concat(_constants.OMOCODIA_TABLE[char]).concat(lastOmocode.substr(i + 1));
          results.push(lastOmocode + CodiceFiscale.getCheckCode(lastOmocode));
        }
      }

      return results;
    }
  }, {
    key: "compute",
    value: function compute() {
      var code = this.getSurnameCode();
      code += this.getNameCode();
      code += this.dateCode();
      code += this.birthplace.cc;
      code += CodiceFiscale.getCheckCode(code);
      this.code = code;
    }
  }, {
    key: "reverse",
    value: function reverse() {
      this.name = this.code.substr(3, 3);
      this.surname = this.code.substr(0, 3);
      var yearCode = this.code.substr(6, 2);
      var year19XX = parseInt("19".concat(yearCode), 10);
      var year20XX = parseInt("20".concat(yearCode), 10);
      var currentYear20XX = new Date().getFullYear();
      var year = year20XX > currentYear20XX ? year19XX : year20XX;
      var monthChar = this.code.substr(8, 1);

      var month = _constants.MONTH_CODES.indexOf(monthChar);

      this.gender = 'M';
      var day = parseInt(this.code.substr(9, 2), 10);

      if (day > 31) {
        this.gender = 'F';
        day = day - 40;
      }

      this.birthday = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      var cc = this.code.substr(11, 4);
      this.birthplace = _comune.Comune.GetByCC(cc);
      return this.toJSON();
    }
  }, {
    key: "checkGender",
    value: function checkGender(gender) {
      this.gender = gender !== undefined ? gender.toUpperCase() : this.gender.toUpperCase();

      if (typeof this.gender !== 'string') {
        throw new Error('Gender must be a string');
      }

      if (this.gender !== 'M' && this.gender !== 'F') {
        throw new Error('Gender must be either \'M\' or \'F\'');
      }

      return gender;
    }
  }, {
    key: "getSurnameCode",
    value: function getSurnameCode() {
      var codeSurname = "".concat((0, _utils.extractConsonants)(this.surname)).concat((0, _utils.extractVowels)(this.surname), "XXX");
      return codeSurname.substr(0, 3).toUpperCase();
    }
  }, {
    key: "getNameCode",
    value: function getNameCode() {
      var codNome = (0, _utils.extractConsonants)(this.name);

      if (codNome.length >= 4) {
        codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3);
      } else {
        codNome += "".concat((0, _utils.extractVowels)(this.name), "XXX");
        codNome = codNome.substr(0, 3);
      }

      return codNome.toUpperCase();
    }
  }, {
    key: "dateCode",
    value: function dateCode() {
      var year = "0".concat(this.birthday.getFullYear());
      year = year.substr(year.length - 2, 2);

      var month = _constants.MONTH_CODES[this.birthday.getMonth()];

      var day = this.birthday.getDate();

      if (this.gender.toUpperCase() === 'F') {
        day += 40;
      }

      var dayStr = "0".concat(day);
      dayStr = dayStr.substr(dayStr.length - 2, 2);
      return String(year + month + dayStr);
    }
  }], [{
    key: "getCheckCode",
    value: function getCheckCode(codiceFiscale) {
      var val = 0;

      for (var i = 0; i < 15; i = i + 1) {
        var c = codiceFiscale[i];
        val += i % 2 !== 0 ? _constants.CHECK_CODE_EVEN[c] : _constants.CHECK_CODE_ODD[c];
      }

      val = val % 26;
      return _constants.CHECK_CODE_CHARS.charAt(val);
    }
  }, {
    key: "findLocationCode",
    value: function findLocationCode(name, prov) {
      return new _comune.Comune(name, prov).cc;
    }
  }, {
    key: "computeInverse",
    value: function computeInverse(codiceFiscale) {
      return new CodiceFiscale(codiceFiscale).toJSON();
    }
  }, {
    key: "compute",
    value: function compute(obj) {
      return new CodiceFiscale(obj).toString();
    }
  }, {
    key: "check",
    value: function check(codiceFiscale) {
      if (typeof codiceFiscale !== 'string') {
        return false;
      }

      var cf = codiceFiscale.toUpperCase();

      if (cf.length !== 16) {
        return false;
      }

      var expectedCheckCode = codiceFiscale.charAt(15);
      cf = codiceFiscale.slice(0, 15);
      return CodiceFiscale.getCheckCode(cf) === expectedCheckCode;
    }
  }, {
    key: "getOmocodie",
    value: function getOmocodie(cf) {
      return new CodiceFiscale(cf).omocodie();
    }
  }]);

  return CodiceFiscale;
}();

CodiceFiscale.utils = {
  birthplaceFields: _utils.birthplaceFields
};
module.exports = CodiceFiscale;