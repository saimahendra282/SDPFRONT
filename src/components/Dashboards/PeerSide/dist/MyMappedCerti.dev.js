"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var enrichMappings = function enrichMappings() {
  var enriched = mappedCertificates.map(function (mapping) {
    var certificate = certificates.find(function (cert) {
      return cert.id === mapping.certificateId;
    });
    return _objectSpread({}, mapping, {
      _id: mapping._id || mapping.id,
      // Ensure the id is correctly mapped
      certificateName: certificate ? certificate.name : "Unknown",
      username: certificate ? certificate.email : "na",
      trackId: certificate ? certificate.trackId : "Unknown",
      issuedBy: certificate ? certificate.issuedBy : "Unknown",
      issuedDate: certificate ? certificate.issuedDate : "Unknown",
      expiryDate: certificate ? certificate.expiryDate : "Unknown",
      badge: certificate ? certificate.badge : null,
      pdfFile: certificate ? certificate.pdfFile : null
    });
  });
  setEnrichedMappings(enriched);
};
//# sourceMappingURL=MyMappedCerti.dev.js.map
