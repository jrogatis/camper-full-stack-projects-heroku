/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/yelp/:id          ->  show
 */

'use strict';

//import jsonpatch from 'fast-json-patch';
//import querystring from 'querystring';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;

var _oauthSignature = require('oauth-signature');

var _oauthSignature2 = _interopRequireDefault(_oauthSignature);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var n = require('nonce')();

var request_yelp = function request_yelp(search_parameters, callback) {
  var httpMethod = 'GET';
  var url = 'http://api.yelp.com/v2/search';
  var set_parameters = {
    location: search_parameters,
    sort: '2'
  };
  var required_parameters = {
    //callback : 'cb',
    oauth_consumer_key: process.env.oauth_consumer_key,
    oauth_token: process.env.oauth_token,
    oauth_nonce: n(),
    oauth_timestamp: n().toString().substr(0, 10),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0'
  };
  var parameters = _lodash2.default.assign(set_parameters, required_parameters);
  var consumerSecret = process.env.consumerSecret;
  var tokenSecret = process.env.tokenSecret;
  var signature = _oauthSignature2.default.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {
    encodeSignature: false
  });
  parameters.oauth_signature = signature;
  var paramURL = _querystring2.default.stringify(parameters);
  var apiURL = url + '?' + paramURL;
  /* Then we use request to send make the API Request */
  (0, _request2.default)(apiURL, function (error, response, body) {
    return callback(error, response, body);
  });
};

// Gets a list of venues
function index(req, res) {
  request_yelp(req.params.setParams, function (error, response, body) {
    if (!error) {
      //console.log(body.businesses);
      res.status(200).end(body);
    } else {
      console.log(error);
    }
  });
}
//# sourceMappingURL=yelp.controller.js.map
