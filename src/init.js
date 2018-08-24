'use strict'

const
  express = require('express'),
  bodyParser = require('body-parser'),
  otherHandlers = require('./handlers/other');

function setupMiddleware(app) {
  app.use(otherHandlers.handlePreflight);
  app.use(bodyParser.json());
}

function setupRoutes(app) {
  module.exports.app = app;
  const init = require('./routes/voteRoutes');
  init();
}

function setupRouteNotFound(app) {
  app.use(otherHandlers.notFound);
}

function start(port = 3000) {
  const app = express();

  setupMiddleware(app);
  setupRoutes(app);
  setupRouteNotFound(app);

  const server = app.listen(port, function() {
    console.log('Server is listening on port', port);
  });

  return server;
}

module.exports = {
  start: start
};
