'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NlSchema = new _mongoose2.default.Schema({
  ID: String,
  DESC: String
});

exports.default = _mongoose2.default.model('Stocks', NlSchema);
//# sourceMappingURL=stocks-api.model.js.map
