"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Signer: true,
  SignerResult: true,
  ApiBase: true
};
Object.defineProperty(exports, "Signer", {
  enumerable: true,
  get: function () {
    return _types.Signer;
  }
});
Object.defineProperty(exports, "SignerResult", {
  enumerable: true,
  get: function () {
    return _types.SignerResult;
  }
});
Object.defineProperty(exports, "ApiBase", {
  enumerable: true,
  get: function () {
    return _base.ApiBase;
  }
});

require("@polkadot/api/augment");

var _types = require("@polkadot/types/types");

var _base = require("../base");

var _types2 = require("../submittable/types");

Object.keys(_types2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types2[key];
    }
  });
});

var _base2 = require("./base");

Object.keys(_base2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _base2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _base2[key];
    }
  });
});

var _consts = require("./consts");

Object.keys(_consts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _consts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _consts[key];
    }
  });
});

var _rpc = require("./rpc");

Object.keys(_rpc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rpc[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rpc[key];
    }
  });
});

var _storage = require("./storage");

Object.keys(_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _storage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _storage[key];
    }
  });
});

var _submittable = require("./submittable");

Object.keys(_submittable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _submittable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _submittable[key];
    }
  });
});