'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PintSchema = new _mongoose2.default.Schema({
  ownerId: String,
  imgUrl: String,
  desc: String,
  date: { type: Date, default: Date.now },
  likes: [{
    userId: String
  }]
});

exports.default = _mongoose2.default.model('Pint', PintSchema);
//# sourceMappingURL=pint.api.model.js.map
