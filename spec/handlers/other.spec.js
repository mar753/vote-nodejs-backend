'use strict';

const otherHandlers = require('../../src/handlers/other');

describe('Other handlers unit tests', function() {
  const req = {};
  const res = {};
  const innerSendSpy = jasmine.createSpy();

  beforeEach(function() {
    res.header = jasmine.createSpy();
    res.status = jasmine.createSpy().and.returnValue({send: innerSendSpy});
  });

  it('checks if CORS headers were properly added by a handler', function() {
    const nextSpy = jasmine.createSpy();
    otherHandlers.cors(req, res, nextSpy);    
    expect(nextSpy).toHaveBeenCalled();
    expect(res.header.calls.allArgs()).toEqual(
      [['Access-Control-Allow-Origin', '*'], ['Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept']]);
  });

  it('checks if message for HTTP 404 handler is proper', function() {
    otherHandlers.notFound(req, res);
    expect(innerSendSpy).toHaveBeenCalledWith('This route does not exist (HTTP 404)');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
