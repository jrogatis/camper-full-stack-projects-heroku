/**
 * Thing model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _poll = require('./poll.model');

var _poll2 = _interopRequireDefault(_poll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PollEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
PollEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _poll2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    PollEvents.emit(event + ':' + doc._id, doc);
    PollEvents.emit(event, doc);
  };
}

exports.default = PollEvents;
//# sourceMappingURL=poll.events.js.map
