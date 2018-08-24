'use strict';

const rewire = require('rewire');
const voteHandler = rewire('../../src/handlers/vote');

describe('Vote handler unit tests', function() {
  const req = {};
  const res = {};
  let responsePattern;
  const innerSendSpy = jasmine.createSpy();

  function SqlRequestObject() {}
  SqlRequestObject.prototype.input = function() {return this};
  SqlRequestObject.prototype.query = function() {return Promise.resolve({
    recordset: [
      {id: 1, name: 'Joe', vote: 0},
      {id: 2, name: 'Mary', vote: 0}
    ]
  })};
  let sqlRequestObject = new SqlRequestObject();
  const sqlResolveObject = {
    request: jasmine.createSpy().and.returnValue(sqlRequestObject)
  }
  const sqlStub = {
    Int: () => {},
    VarChar: () => {},
    MAX: '',
    connect: jasmine.createSpy().and.returnValue(Promise.resolve(sqlResolveObject))
  };

  beforeEach(function() {
    responsePattern = {items: [
      {id: 1, name: 'Joe', vote: 0},
      {id: 2, name: 'Mary', vote: 0}
    ]};
    res.header = jasmine.createSpy();
    res.send = jasmine.createSpy();
    res.json = jasmine.createSpy();
    res.status = jasmine.createSpy().and.returnValue({send: innerSendSpy});
    spyOn(sqlRequestObject, 'input').and.callThrough();
    spyOn(sqlRequestObject, 'query').and.callThrough();
    voteHandler.__set__('db', responsePattern);
    voteHandler.__set__('sql', sqlStub);
  });

  afterEach(function() {
  });

  it('checks if the handleGetItems route was properly handled', function() {
    req.query = {};
    voteHandler.handleGetItems(req, res);
    expect(res.json).toHaveBeenCalledWith(responsePattern);
  });

  it('checks the handleGetItems ?id= query parameter', function() {
    req.query = {id: 2};
    voteHandler.handleGetItems(req, res);
    expect(res.json).toHaveBeenCalledWith({id: 2, name: 'Mary', vote: 0});
  });

  it('checks the handleGetItems no ?id= query parameter', function() {
    req.query = {name: 'abc'};
    voteHandler.handleGetItems(req, res);
    expect(res.json).toHaveBeenCalledWith(responsePattern);
  });

  it('checks the handleGetItems ?id= as second query parameter', function() {
    req.query = {name: 'abc', id: 2};
    voteHandler.handleGetItems(req, res);
    expect(res.json).toHaveBeenCalledWith({id: 2, name: 'Mary', vote: 0});
  });

  it('checks if db init was successful', function() {
    voteHandler.init();
    expect(sqlStub.connect).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('checks if the handlePostItem route was properly handled - empty db', function(done) {
    req.body = {value: 'dfg'};
    voteHandler.init().then(() => {
      responsePattern.items = [];
      expect(responsePattern.items.length).toBe(0);
      voteHandler.handlePostItem(req, res);
      expect(res.send).toHaveBeenCalledWith();
      expect(responsePattern.items.length).toBe(1);
      expect(responsePattern.items[0].id).toBe(1);
      expect(sqlRequestObject.input).toHaveBeenCalledTimes(3);
      expect(sqlRequestObject.query.calls.allArgs()).toEqual(
        [[ 'SELECT * FROM items' ],
        [ 'INSERT INTO [dbo].[items] ([id],[name],[vote]) VALUES (@id, @name, @vote)' ]]);
      done();
    });
  });

  it('checks if the handlePostItem route was properly handled', function(done) {
    req.body = {value: 'dfg'};
    voteHandler.init().then(() => {
      responsePattern.items[1].id = 999;
      expect(responsePattern.items.length).toBe(2);
      voteHandler.handlePostItem(req, res);
      expect(res.send).toHaveBeenCalledWith();
      expect(responsePattern.items.length).toBe(3);
      expect(responsePattern.items[2].id).toBe(1000);
      expect(sqlRequestObject.input).toHaveBeenCalledTimes(3);
      expect(sqlRequestObject.query.calls.allArgs()).toEqual(
        [[ 'SELECT * FROM items' ],
        [ 'INSERT INTO [dbo].[items] ([id],[name],[vote]) VALUES (@id, @name, @vote)' ]]);
      done();
    });
  });

  it('checks if the handlePutItem route item was edited', function(done) {
    req.body = {value: 'qwe'};
    req.params = {id: 1};
    voteHandler.init().then(() => {
      expect(responsePattern.items.length).toBe(2);
      expect(responsePattern.items[0].id).toBe(1);
      expect(responsePattern.items[0].name).toBe('Joe');
      voteHandler.handlePutItem(req, res);
      expect(responsePattern.items.length).toBe(2);
      expect(responsePattern.items[0].id).toBe(1);
      expect(responsePattern.items[0].name).toBe('qwe');
      expect(res.send).toHaveBeenCalled();
      expect(sqlRequestObject.input).toHaveBeenCalledTimes(2);
      expect(sqlRequestObject.query.calls.allArgs()).toEqual(
        [[ 'SELECT * FROM items' ],
        [ 'UPDATE [dbo].[items] SET [name] = @name WHERE [id] = @id' ]]);
      done();
    });

  });

  it('checks if the handlePutItem route item was not edited', function() {
    req.body = {newValue: 'qwe'};
    req.params = {id: 5};
    expect(responsePattern.items.length).toBe(2);
    voteHandler.handlePutItem(req, res);
    expect(responsePattern.items.length).toBe(2);
    expect(innerSendSpy).toHaveBeenCalledWith(
      'Item does not exist! Use POST to insert new items');
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('checks if the handlePutVote route item was edited', function(done) {
    req.body = {value: -1};
    req.params = {id: 1};
    voteHandler.init().then(() => {
      expect(responsePattern.items.length).toBe(2);
      expect(responsePattern.items[0].vote).toBe(0);
      voteHandler.handlePutVote(req, res);
      expect(responsePattern.items.length).toBe(2);
      expect(responsePattern.items[0].vote).toBe(-1);
      expect(res.send).toHaveBeenCalled();
      expect(sqlRequestObject.input).toHaveBeenCalledTimes(2);
      expect(sqlRequestObject.query.calls.allArgs()).toEqual(
        [[ 'SELECT * FROM items' ],
        [ 'UPDATE [dbo].[items] SET [vote] = @vote WHERE [id] = @id' ]]);
      done();
    });
  });

  it('checks if the handlePutVote route item was not edited', function() {
    req.body = {newValue: 1};
    req.params = {id: 5};
    expect(responsePattern.items.length).toBe(2);
    expect(responsePattern.items[0].vote).toBe(0);
    voteHandler.handlePutVote(req, res);
    expect(responsePattern.items.length).toBe(2);
    expect(responsePattern.items[0].vote).toBe(0);
    expect(innerSendSpy).toHaveBeenCalledWith(
      'Item does not exist! Use POST to insert new items');
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('checks if the handleDeleteItem route item was removed', function(done) {
    req.params = {id: 1};
    voteHandler.init().then(() => {
      expect(responsePattern.items.length).toBe(2);
      expect(responsePattern.items[0].id).toBe(1);
      expect(responsePattern.items[0].name).toBe('Joe');
      voteHandler.handleDeleteItem(req, res);
      expect(responsePattern.items.length).toBe(1);
      expect(responsePattern.items[0].id).toBe(2);
      expect(responsePattern.items[0].name).toBe('Mary');
      expect(res.send).toHaveBeenCalledWith();
      expect(sqlRequestObject.input).toHaveBeenCalledTimes(1);
      expect(sqlRequestObject.query.calls.allArgs()).toEqual(
        [[ 'SELECT * FROM items' ],
        [ 'DELETE FROM [dbo].[items] WHERE [id] = @id' ]]);
      done();
    });
  });

  it('checks if the handleDeleteItem route item does not exist', function() {
    req.params = {id: 5};
    expect(responsePattern.items.length).toBe(2);
    expect(responsePattern.items[0].id).toBe(1);
    expect(responsePattern.items[0].name).toBe('Joe');
    voteHandler.handleDeleteItem(req, res);
    expect(responsePattern.items.length).toBe(2);
    expect(responsePattern.items[0].id).toBe(1);
    expect(responsePattern.items[0].name).toBe('Joe');
    expect(innerSendSpy).toHaveBeenCalledWith('Item does not exist!');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
