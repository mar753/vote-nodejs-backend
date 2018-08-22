'use strict';

const proxyquire = require('proxyquire');

describe('Server routes unit tests', function() {
    const expressStubFunctions = {
      get(url, callback) {},
      use(callback) {},
      listen(port, callback) {}
    };
    const expressStub = jasmine.createSpy().and.returnValue(expressStubFunctions);
    const httpServerFake = {};
    let server;

  beforeEach(function() {
    spyOn(expressStubFunctions, "get");
    spyOn(expressStubFunctions, "use");
    spyOn(expressStubFunctions, "listen").and.returnValue(httpServerFake);

    server = proxyquire('../src/init.js', {
      express: expressStub
    });
  });

  it('tracks that the spies were called', function() {
    server.start();
    expect(expressStubFunctions.listen).toHaveBeenCalledWith(3000, jasmine.any(Function));
    expect(expressStubFunctions.get).toHaveBeenCalled();
    expect(expressStubFunctions.use.calls.count()).toEqual(2);
  });
});
