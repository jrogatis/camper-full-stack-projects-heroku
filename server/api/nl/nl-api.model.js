'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NlSchema = new _mongoose2.default.Schema({
  ID: String,
  usersGoing: [{
    userID: String }]
});

exports.default = _mongoose2.default.model('Nl', NlSchema);
//# sourceMappingURL=nl-api.model.js.map
