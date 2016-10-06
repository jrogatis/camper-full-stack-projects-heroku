/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/books              ->  index
 * POST    /api/books              ->  create
 * GET     /api/books/:id          ->  show
 * PUT     /api/books/:id          ->  upsert
 * PATCH   /api/books/:id          ->  patch
 * DELETE  /api/books/:id          ->  destroy
 * GET     /api/books/user/:id     ->  showByUser
 * GET     /api/books/book/:id     ->  showByBook
 * POST    /api/books/bookTrade/:IdOfferBook/:idRequestBook  ->  doBookTrade
 * POST    /api/books/acceptBookTrade/:IdOffer ->  acceptBookTrade
 * GET     /api/books/allBooks/:id    ->  showAllBooks
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.showByUser = showByUser;
exports.showByBook = showByBook;
exports.requestBookTrade = requestBookTrade;
exports.acceptBookTrade = acceptBookTrade;
exports.showAllBooks = showAllBooks;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _booksApi = require('./books-api.model');

var _booksApi2 = _interopRequireDefault(_booksApi);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import ObjectId from 'mongoose';

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

function handleTradeOffer(bookIds) {
  // console.log('bookIds', bookIds);
  return function (entity) {
    //console.log('entity', JSON.stringify(entity));
    // a litle meesie but you set a offer on the request book owner
    // and vice versa
    var offerToAdd = {
      bookRequestedID: bookIds.bookToRequestID,
      bookOfferID: bookIds.bookToOfferID,
      tradeAccepted: ''
    };
    var requestToAdd = {
      bookRequestedID: bookIds.bookToRequestID,
      bookOfferID: bookIds.bookToOfferID,
      tradeAccepted: ''
    };

    //now i need to know what of this 2 entities have the book
    // is the onwer of the transaction so he recive the request register
    entity.map(function (ent, entityIndex) {
      ent.booksOwned.map(function (book) {
        if (book._id.toString() === bookIds.bookToOfferID) {
          entity[entityIndex].pendingTradingRequests.push(requestToAdd);
          entity[entityIndex].save();
        } else if (book._id.toString() === bookIds.bookToRequestID) {
          entity[entityIndex].pendingTradingOffers.push(offerToAdd);
          entity[entityIndex].save();
        }
      });
    });

    return entity;
  };
}

function handleBookOfferAceptance(aceptedOfferID) {
  return function (offeredEntity) {
    var selectedOffer = _lodash2.default.find(offeredEntity.pendingTradingOffers, function (offer) {
      return offer._id.toString() === aceptedOfferID.pendingTradingOffers;
    });

    _booksApi2.default.findOne({
      'booksOwned._id': selectedOffer.bookOfferID
    }).exec().then(function (requestEntity) {
      var bookToTradeFromOfferedEntity = _lodash2.default.find(offeredEntity.booksOwned, function (book) {
        return book._id.toString() === selectedOffer.bookRequestedID;
      });
      var bookToTradeFromRequestEntity = _lodash2.default.find(requestEntity.booksOwned, function (book) {
        return book._id.toString() === selectedOffer.bookOfferID;
      });

      /////// ALL THE OFFERS AND REQUESTS THAT HAVE THAT BOOK NEED TO BE DELETED!!!
      offeredEntity.booksOwned.pull({
        _id: selectedOffer.bookRequestedID
      });
      offeredEntity.booksOwned.push(bookToTradeFromRequestEntity);
      offeredEntity.save();

      _booksApi2.default.update({
        _id: offeredEntity._id
      }, {
        $pull: {
          pendingTradingOffers: {
            bookRequestedID: selectedOffer.bookRequestedID
          }
        }
      }, function (err) {
        return console.log('err', err);
      });

      _booksApi2.default.update({
        _id: offeredEntity._id
      }, {
        $pull: {
          pendingTradingRequests: {
            bookOfferID: selectedOffer.bookOfferID
          }
        }
      }, function (err) {
        return console.log('err', err);
      });

      requestEntity.booksOwned.pull({
        _id: selectedOffer.bookOfferID
      });
      requestEntity.booksOwned.push(bookToTradeFromOfferedEntity);
      requestEntity.save();
      _booksApi2.default.update({
        _id: requestEntity._id
      }, {
        $pull: {
          pendingTradingOffers: {
            bookRequestedID: selectedOffer.bookRequestedID
          }
        }
      }, function (err) {
        return console.log('err', err);
      });
      _booksApi2.default.update({
        _id: requestEntity._id
      }, {
        $pull: {
          pendingTradingRequests: {
            bookOfferID: selectedOffer.bookOfferID
          }
        }
      }, function (err) {
        return console.log('err', err);
      });
    });
  };
}

// Gets a list of Books
function index(req, res) {
  return _booksApi2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

function showByUser(req, res) {
  //console.log('no show', req.params.id);
  return _booksApi2.default.findOne({
    userID: req.params.id
  }).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

function showByBook(req, res) {
  return _booksApi2.default.findOne({
    'booksOwned._id': req.params.id
  }, 'userID booksOwned.title booksOwned.imgUrl booksOwned._id').exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

function requestBookTrade(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  //find the user that is offering that book
  //console.log(req.body);
  return _booksApi2.default.find({
    $or: [{
      'booksOwned._id': req.body.bookToOfferID
    }, {
      'booksOwned._id': req.body.bookToRequestID
    }]
  }).exec().then(handleEntityNotFound(res)).then(handleTradeOffer(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

function acceptBookTrade(req, res) {
  //console.log('acceptBookTrade', req.body)
  return _booksApi2.default.findOne({
    'pendingTradingOffers._id': req.body.pendingTradingOffers
  }).exec().then(handleEntityNotFound(res)).then(handleBookOfferAceptance(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

function showAllBooks(req, res) {
  return _booksApi2.default.find({}, 'userID booksOwned').exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

function show(req, res) {
  return _booksApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new book in the DB
function create(req, res) {
  return _booksApi2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given book in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _booksApi2.default.findOneAndUpdate({ _id: req.params.id }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing book in the DB
function patch(req, res) {
  console.log('no patch');
  if (req.body._id) {
    delete req.body._id;
  }
  return _booksApi2.default.findOne({ userID: req.params.id }).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a book from the DB
function destroy(req, res) {
  return _booksApi2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=books-api.controller.js.map
