/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pint              ->  index
 * POST    /api/pint              ->  create
 * GET     /api/pint/:id          ->  show
 * PUT     /api/pint/:id          ->  upsert
 * PATCH   /api/pint/:id          ->  patch
 * DELETE  /api/pint/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _pintApi = require('./pint.api.model');

var _pintApi2 = _interopRequireDefault(_pintApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
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

// Gets a list of pints
function index(req, res) {
  return _pintApi2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single pint from the DB
function show(req, res) {
  return _pintApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new pint in the DB
function create(req, res) {
  return _pintApi2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given pint in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _pintApi2.default.findOneAndUpdate(req.params.id, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing pint in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _pintApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Pint from the DB
function destroy(req, res) {
  return _pintApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=pint.api.controller.js.map
