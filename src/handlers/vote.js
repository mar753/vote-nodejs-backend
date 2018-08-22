'use strict';

const responseStub = {
  items: [
    {id: 1, name: 'Joe'},
    {id: 2, name: 'Mary'}
  ]};

module.exports = {
  handleGetItems: function(req, res) {
    res.header('Content-Type', 'application/json');
    res.send(responseStub);
  }
}
