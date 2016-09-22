'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _auth = require('../auth.service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var urlRedirect;
router.get('/', _passport2.default.authenticate('twitter', {
  failureRedirect: '/signup',
  session: false
})).get('/nl/:redirectTo', function (req, res) {
  urlRedirect = req.params.redirectTo;
  res.redirect('/auth/twitter/');
}).get('/callback', _passport2.default.authenticate('twitter', {
  failureRedirect: '/signup',
  session: false
}), function (req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = (0, _auth.signToken)(req.user._id, req.user.role);
  res.cookie('token', token);
  if (urlRedirect) {
    res.redirect(urlRedirect);
  } else {
    res.redirect('/');
  }
});

exports.default = router;
//# sourceMappingURL=index.js.map
