'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BooksSchema = new _mongoose2.default.Schema({
  userID: String,
  userName: String,
  booksOwned: [{
    googleID: String,
    title: String,
    author: String,
    imgUrl: String
  }],
  pendingTradingRequests: [{ bookOfferID: String, bookRequestedID: String, tradeAccepted: Date }],
  pendingTradingOffers: [{ bookRequestedID: String, bookOfferID: String, tradeAccepted: Date }]

});

exports.default = _mongoose2.default.model('Books', BooksSchema);
//# sourceMappingURL=books-api.model.js.map
