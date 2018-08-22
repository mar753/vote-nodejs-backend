'use strict';

module.exports = {
  cors: function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  },

  notFound: function(req, res, next) {
    res.status(404).send('This route does not exist (HTTP 404)');
  }
}
