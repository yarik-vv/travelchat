const express = require('express');
const router = express.Router();
const log = require('libs/log')(module);

//get to error page
router.get('/', (req, res, next) => {
  log.warn('Kto-to pitalsa zayti na nesushestvueshuyou stranicu!');
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;