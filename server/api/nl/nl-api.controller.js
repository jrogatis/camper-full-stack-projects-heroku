/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/nl              ->  index
 * POST    /api/nl              ->  create
 * GET     /api/nl/:id          ->  show
 * PUT     /api/nl/:id          ->  upsert
 * PATCH   /api/nl/:id          ->  patch
 * DELETE  /api/nl/:id          ->  destroy
 * GET     /api/nl:id:qUsers    ->  quantUsers
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
exports.quantUsers = quantUsers;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _nlApi = require('./nl-api.model');

var _nlApi2 = _interopRequireDefault(_nlApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// Gets a list of nl
function index(req, res) {
  return _nlApi2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

function show(req, res) {
  //console.log('no show', req.params.id);
  return _nlApi2.default.findOne({
    ID: req.params.id
  }).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new nl in the DB
function create(req, res) {
  return _nlApi2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given nl in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _nlApi2.default.findOneAndUpdate(req.params.id, req.body, {
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
  return _nlApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a nl from the DB
function destroy(req, res) {
  return _nlApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}

function quantUsers(req, res) {
  return _nlApi2.default.findOne({
    ID: req.params.id
  }, 'usersGoing').exec().then(function (entity) {
    if (!entity) {
      return res.status(200).json(0);
    }
    return res.status(200).json(entity.usersGoing.length);
  }).catch(handleError(res));
}
//# sourceMappingURL=nl-api.controller.js.map
