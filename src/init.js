'use strict'

const
  express = require('express'),
  bodyParser = require('body-parser'),
  otherHandlers = require('./handlers/other'),
  voteHandler = require('./handlers/vote');

function setupMiddleware(app) {
  app.use(otherHandlers.handlePreflight);
  app.use(bodyParser.json());
}

function setupRoutes(app) {
  app.get('/items', voteHandler.handleGetItems);
  app.post('/items', voteHandler.handlePostItem);
  app.put('/items/:id', voteHandler.handlePutItem);
  app.delete('/items/:id', voteHandler.handleDeleteItem);
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
