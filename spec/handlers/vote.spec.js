'use strict';

const voteHandler = require('../../src/handlers/vote');

describe('Vote handler unit tests', function() {
  const req = {};
  const res = {};

  beforeEach(function() {
    res.header = jasmine.createSpy();
    res.send = jasmine.createSpy();
  });

  it('checks if the handleGetItems route was properly handled', function() {
    const responsePattern = {
      items: [
        {id: 1, name: 'Joe'},
        {id: 2, name: 'Mary'}
    ]};

    voteHandler.handleGetItems(req, res);
    expect(res.header).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.send).toHaveBeenCalledWith(responsePattern);
  });
});
