'use strict'

const express = require('express');
const otherHandlers = require('./handlers/other');
const voteHandler = require('./handlers/vote');

function setupResponseHeaders(app) {
  app.use(otherHandlers.cors);
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

  setupResponseHeaders(app);
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
