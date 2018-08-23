'use strict';

module.exports = {
  handlePreflight: function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //CORS
    res.header('Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.send();
    }
    else {
      next();
    }
  },

  notFound: function(req, res, next) {
    res.status(404).send('This route does not exist (HTTP 404)');
  }
}
