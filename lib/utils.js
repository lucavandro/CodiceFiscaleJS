"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeString = normalizeString;
exports.daysInMonth = daysInMonth;
exports.isValidDate = isValidDate;
exports.getValidDate = getValidDate;
exports.extractVowels = extractVowels;
exports.extractConsonants = extractConsonants;
exports.pad = pad;
exports.birthplaceFields = birthplaceFields;

var _geoData = require("./geo-data");

function normalizeString(str) {
  return str.trim().replace(new RegExp(/[àá]/g), 'a\'').replace(new RegExp(/[èé]/g), 'e\'').replace(new RegExp(/[ìí]/g), 'i\'').replace(new RegExp(/[òó]/g), 'o\'').replace(new RegExp(/[ùú]/g), 'u\'').toUpperCase();
}

function daysInMonth(m, y) {
  switch (m) {
    case 1:
      return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0 ? 29 : 28;

    case 8:
    case 3:
    case 5:
    case 10:
      return 30;

    default:
      return 31;
  }
}

function isValidDate(d, m, y) {
  var month = m - 1;
  return month >= 0 && month < 12 && d > 0 && d <= daysInMonth(month, y);
}

function getValidDate(d, m, y) {
  if (typeof d === 'string' && m === undefined && y === undefined) {
    return new Date(d);
  } else if (isValidDate(d, m, y)) {
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  } else {
    throw new Error("The date ".concat(y, "/").concat(m, "/").concat(d, " is not a valid date"));
  }
}

function extractVowels(str) {
  return str.replace(/[^AEIOU]/gi, '');
}

function extractConsonants(str) {
  return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '');
}



function birthplaceFields(provinceSelector, birthplaceSelector) {
  var provinceSelect = document.querySelector(provinceSelector);
  var birthplaceSelect = document.querySelector(birthplaceSelector);
  var optGroupProv = document.createElement('optgroup');
  var optGroupEE = document.createElement('optgroup');
  optGroupEE.label = '-----------';
  provinceSelect.appendChild(optGroupProv);
  provinceSelect.appendChild(optGroupEE);
  Object.keys(_geoData.PROVINCE).forEach(function (code, i) {
    var name = _geoData.PROVINCE[code];
    var option = document.createElement('option');
    option.value = code;
    option.textContent = name;

    if (code === 'EE') {
      optGroupEE.appendChild(option);
    } else {
      optGroupProv.appendChild(option);
    }
  });

  provinceSelect.onchange = function (e) {
    var province = provinceSelect.value;

    while (birthplaceSelect.firstChild) {
      birthplaceSelect.removeChild(birthplaceSelect.firstChild);
    }

    _geoData.COMUNI.forEach(function (comune) {
      var cc = comune[0];
      var nome = comune[2];
      var prov = comune[1];

      if (prov === province) {
        var option = document.createElement('option');
        option.value = cc;
        option.textContent = nome.toLowerCase().replace(/\b\w/g, function (l) {
          return l.toUpperCase();
        });
        birthplaceSelect.appendChild(option);
      }
    });
  };

  provinceSelect.selectedIndex = '0';
  provinceSelect.onchange();
}