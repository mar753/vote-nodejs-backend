'use strict';

const otherHandlers = require('../../src/handlers/other');

describe('Other handlers unit tests', function() {
  const req = {};
  const res = {};
  const innerSendSpy = jasmine.createSpy();

  beforeEach(function() {
    res.header = jasmine.createSpy();
    res.send = jasmine.createSpy();
    res.status = jasmine.createSpy().and.returnValue({send: innerSendSpy});
    req.method = 'GET';
  });

  it('checks if headers (i.a CORS) were properly added by a handler', function() {
    const nextSpy = jasmine.createSpy();
    otherHandlers.handlePreflight(req, res, nextSpy);
    expect(nextSpy).toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(res.header.calls.allArgs()).toEqual(
      [['Access-Control-Allow-Origin', '*'],
        ['Access-Control-Allow-Headers',
          'Content-Type, Authorization, Content-Length, X-Requested-With'],
        ['Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS']]);
  });

  it('checks if OPTIONS request will be properly handled', function() {
    const nextSpy = jasmine.createSpy();
    req.method = 'OPTIONS';
    otherHandlers.handlePreflight(req, res, nextSpy);
    expect(nextSpy).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith();
    expect(res.header.calls.allArgs()).toEqual(
      [['Access-Control-Allow-Origin', '*'],
        ['Access-Control-Allow-Headers',
          'Content-Type, Authorization, Content-Length, X-Requested-With'],
        ['Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS']]);
  });

  it('checks if message for HTTP 404 handler is proper', function() {
    otherHandlers.notFound(req, res);
    expect(innerSendSpy).toHaveBeenCalledWith('This route does not exist (HTTP 404)');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
