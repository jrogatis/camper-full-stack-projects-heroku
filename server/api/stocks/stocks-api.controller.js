/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stocks              ->  index
 * POST     /api/stocks/quotes       ->  showQuotes
 * POST    /api/stocks              ->  create
 * GET     /api/stocks/:id          ->  show
 * PUT     /api/stocks/:id          ->  upsert
 * PATCH   /api/stocks/:id          ->  patch
 * DELETE  /api/stocks/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.showQuotes = showQuotes;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _stocksApi = require('./stocks-api.model');

var _stocksApi2 = _interopRequireDefault(_stocksApi);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY'];

function camelize(text) {
  return (0, _string2.default)(text).slugify().camelize().s;
}

function toFloat(value, valueForNaN) {
  var result = parseFloat(value);
  if (isNaN(result)) {
    if (_lodash2.default.isUndefined(valueForNaN)) {
      return null;
    } else {
      return valueForNaN;
    }
  } else {
    return result;
  }
}

function toInt(value, valueForNaN) {
  var result = parseInt(value, 10);
  if (isNaN(result)) {
    if (_lodash2.default.isUndefined(valueForNaN)) {
      return null;
    } else {
      return valueForNaN;
    }
  } else {
    return result;
  }
}

function transformHistorical(symbol, data) {
  var headings = data.shift();
  return (0, _lodash2.default)(data).reverse().map(function (line) {
    var result = {};
    headings.forEach(function (heading, i) {
      var value = line[i];
      if (_lodash2.default.includes(['Volume'], heading)) {
        value = toInt(value, null);
      } else if (_lodash2.default.includes(['Open', 'High', 'Low', 'Close', 'Adj Close', 'Dividends'], heading)) {
        value = toFloat(value, null);
      } else if (_lodash2.default.includes(['Date'], heading)) {
        value = value;
      }
      result[camelize(heading)] = value;
    });
    result.symbol = symbol;
    return result;
  }).value();
}

function parseCSV(text) {
  return (0, _string2.default)(text).trim().s.split('\n').map(function (line) {
    return (0, _string2.default)(line).trim().parseCSV();
  });
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    //console.log('no respond', entity);
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      _fastJsonPatch2.default.apply(entity, patches);
    } catch (err) {
      return _promise2.default.reject(err);
    }
    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        return res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of stocks
function index(req, res) {
  return _stocksApi2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

function showQuotes(req, res) {
  var values = req.body;
  var url = 'http://chart.finance.yahoo.com/table.csv?s=';
  values.from = (0, _moment2.default)(values.from);
  values.to = (0, _moment2.default)(values.to);
  var qsa = {
    s: values.symbol,
    a: values.from.format('MM') - 1,
    b: values.from.format('DD'),
    c: values.from.format('YYYY'),
    d: values.to.format('MM') - 1,
    e: values.to.format('DD'),
    f: values.to.format('YYYY'),
    g: 'd',
    ignore: '.csv'
  };

  (0, _requestPromise2.default)({ uri: url, qs: qsa }).then(function (ret) {
    return parseCSV(ret);
  }).then(function (data) {
    return transformHistorical(values.symbol, data);
  }).then(respondWithResult(res)).catch(handleError(res));
}

function show(req, res) {
  //console.log('no show', req.params.id);
  return _stocksApi2.default.findOne({
    ID: req.params.id
  }).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new stock Symbol in the DB
function create(req, res) {
  return _stocksApi2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given stock in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _stocksApi2.default.findOneAndUpdate(req.params.id, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing nl in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _stocksApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a nl from the DB
function destroy(req, res) {
  return _stocksApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=stocks-api.controller.js.map
