/**
 * Pint model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _pintApi = require('./pint.api.model');

var _pintApi2 = _interopRequireDefault(_pintApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PintEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
PintEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _pintApi2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    PintEvents.emit(event + ': ' + doc._id, doc);
    PintEvents.emit(event, doc);
  };
}

exports.default = PintEvents;
//# sourceMappingURL=pint.api.events.js.map
