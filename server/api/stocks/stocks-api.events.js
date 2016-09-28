/**
 * Thing model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _stocksApi = require('./stocks-api.model');

var _stocksApi2 = _interopRequireDefault(_stocksApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StocksEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
StocksEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _stocksApi2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    StocksEvents.emit(event + ': ' + doc._id, doc);
    StocksEvents.emit(event, doc);
  };
}

exports.default = StocksEvents;
//# sourceMappingURL=stocks-api.events.js.map
