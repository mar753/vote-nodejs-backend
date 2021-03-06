'use strict';

const proxyquire = require('proxyquire');

describe('Server routes unit tests', function() {
    const expressStubFunctions = {
      get(url, callback) {},
      post(url, callback) {},
      put(url, callback) {},
      delete(url, callback) {},
      use(callback) {},
      listen(port, callback) {}
    };
    const expressStub = jasmine.createSpy().and.returnValue(expressStubFunctions);
    const httpServerFake = {};
    let server, routesSpy;

  beforeEach(function() {
    spyOn(expressStubFunctions, "get");
    spyOn(expressStubFunctions, "post");
    spyOn(expressStubFunctions, "put");
    spyOn(expressStubFunctions, "delete");
    spyOn(expressStubFunctions, "use");
    spyOn(expressStubFunctions, "listen").and.returnValue(httpServerFake);
    routesSpy = jasmine.createSpy();
    server = proxyquire('../src/init.js', {
      express: expressStub,
      './routes/voteRoutes.js': routesSpy
    });
  });

  it('tracks that the spies were called', function() {
    server.start();
    expect(expressStubFunctions.listen).toHaveBeenCalledWith(3000, jasmine.any(Function));
    expect(expressStubFunctions.get).toHaveBeenCalledWith('/items', jasmine.any(Function));
    expect(expressStubFunctions.post).toHaveBeenCalledWith('/items', jasmine.any(Function));
    expect(expressStubFunctions.put.calls.allArgs()).toEqual([['/items/:id', jasmine.any(Function)],
      ['/items/:id/vote', jasmine.any(Function)]]);
    expect(expressStubFunctions.delete).toHaveBeenCalledWith('/items/:id', jasmine.any(Function));
    expect(expressStubFunctions.use.calls.count()).toEqual(3);
    expect(routesSpy).toHaveBeenCalledTimes(1);
  });
});
