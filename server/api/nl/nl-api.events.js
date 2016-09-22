/**
 * Thing model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _nlApi = require('./nl-api.model');

var _nlApi2 = _interopRequireDefault(_nlApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NlEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
NlEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _nlApi2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    NlEvents.emit(event + ': ' + doc._id, doc);
    NlEvents.emit(event, doc);
  };
}

exports.default = NlEvents;
//# sourceMappingURL=nl-api.events.js.map
