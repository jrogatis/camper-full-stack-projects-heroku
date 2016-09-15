'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PollSchema = new _mongoose2.default.Schema({
  name: String,
  owner: String,
  items: [{
    item: String,
    votes: Number }]
});

exports.default = _mongoose2.default.model('Poll', PollSchema);
//# sourceMappingURL=poll.model.js.map
