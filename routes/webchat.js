var express = require('express');
var router = express.Router();
const checkAuth = require('middleware/checkAuth');

//check authorization
router.use('/', checkAuth);

//get to webchat page
router.get('/', function(req, res, next) {
  res.render('webchat', {title: 'webchat'});
});

module.exports = router;
