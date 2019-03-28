"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comune = void 0;

var _geoData = require("./geo-data");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Comune =
/*#__PURE__*/
function () {
  _createClass(Comune, [{
    key: "nomeNorm",
    get: function get() {
      return (0, _utils.normalizeString)(this.nome);
    }
  }]);

  function Comune(nome, prov, cc) {
    var check = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    _classCallCheck(this, Comune);

    if (check || cc === undefined || prov === undefined) {
      var comune;
      comune = prov !== undefined ? this.searchByNameAndProvince(nome, prov) : this.searchByName(nome);

      if (comune === undefined && nome.length === 4) {
        comune = this.searchByCC(nome);
      }

      if (comune === undefined) {
        throw new Error("Comune with name ".concat(nome, " doesn't exist"));
      } else if (cc !== undefined && comune.cc !== cc) {
        throw new Error("Comune with cc ".concat(cc, " doesn't exist"));
      } else {
        this.nome = comune.nome;
        this.prov = comune.prov;
        this.cc = comune.cc;
      }
    } else {
      this.nome = nome;
      this.prov = prov;
      this.cc = cc;
    }
  }

  _createClass(Comune, [{
    key: "searchByCC",
    value: function searchByCC(cc) {
      var result;

      try {
        result = Comune.GetByCC(cc);
      } catch (e) {}

      if (result !== undefined) {
        return result.toJSON();
      }
    }
  }, {
    key: "searchByName",
    value: function searchByName(nome) {
      var query = (0, _utils.normalizeString)(nome);
      var left = 0;
      var right = _geoData.COMUNI.length - 1;
      var result = [];

      while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        var currentItem = _geoData.COMUNI[middle];

        if (query === currentItem[2]) {
          result.push(currentItem);

          if (middle > 0 && _geoData.COMUNI[middle - 1][2] === query) {
            result.push(_geoData.COMUNI[middle - 1]);
          } else if (middle < _geoData.COMUNI.length - 1 && _geoData.COMUNI[middle + 1][2] === query) {
            result.push(_geoData.COMUNI[middle + 1]);
          }

          break;
        } else if (query < currentItem[2]) {
          right = middle - 1;
        } else {
          left = middle + 1;
        }
      }

      if (result.length === 1) {
        return {
          cc: result[0][0],
          prov: result[0][1],
          nome: result[0][2]
        };
      } else if (result.length > 1) {
        throw new Error("Comune with name of ".concat(nome, " is found in more than one province. Please specify the province code"));
      }
    }
  }, {
    key: "searchByNameAndProvince",
    value: function searchByNameAndProvince(nome, prov) {
      var query = (0, _utils.normalizeString)(nome);
      var left = 0;
      var right = _geoData.COMUNI.length - 1;
      var result;

      while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        var currentItem = _geoData.COMUNI[middle];

        if (query === currentItem[2]) {
          if (prov === currentItem[1]) {
            result = currentItem;
          } else if (middle > 0 && _geoData.COMUNI[middle - 1][2] === query && prov === _geoData.COMUNI[middle - 1][1]) {
            result = _geoData.COMUNI[middle - 1];
          } else if (middle < _geoData.COMUNI.length - 1 && _geoData.COMUNI[middle + 1][2] === query && prov === _geoData.COMUNI[middle + 1][1]) {
            result = _geoData.COMUNI[middle + 1];
          }

          break;
        } else if (query < currentItem[2]) {
          right = middle - 1;
        } else {
          left = middle + 1;
        }
      }

      if (result !== undefined) {
        return {
          cc: result[0],
          prov: result[1],
          nome: result[2]
        };
      } else {
        throw new Error("Comune with name of ".concat(nome, " and prov ").concat(prov, " doesn't exists"));
      }
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        cc: this.cc,
        nome: this.nome,
        prov: this.prov
      };
    }
  }], [{
    key: "GetByName",
    value: function GetByName(name, prov) {
      return new Comune(name, prov);
    }
  }, {
    key: "GetByCC",
    value: function GetByCC(cc) {
      var result;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _geoData.COMUNI[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (item[0] === cc) {
            result = item;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (result !== undefined) {
        return new Comune(result[2], result[1], result[0], false);
      }

      throw new Error("Comune with cc ".concat(cc, " doesn't exist"));
    }
  }]);

  return Comune;
}();

exports.Comune = Comune;