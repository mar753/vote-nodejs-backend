'use strict';

const sql = require('mssql'),
  config = require('../../config/config.json');

let sqlPool;
const db = {items: []};

module.exports = {
  init: function() {
    return getAllItemsFromDb();
  },

  handleGetItems: function(req, res) {
    let found;
    for (let param in req.query) {
      if (param === 'id') { // ?id= parameter handling
        found = db.items.find(
          item => item.id === parseInt(req.query.id));
        break;
      }
    }
    if (typeof found !== 'undefined') {
      res.json(found);
    } else {
      res.json(db);
    }
  },

  handlePostItem: function(req, res) {
    let idToAdd = 1;
    if (db.items.length > 0) {
      idToAdd = db.items[db.items.length-1].id + 1;
    }
    db.items.push({id: idToAdd, name: req.body.value, vote: 0});
    postItemsToDb(idToAdd, req);
    res.send();
  },

  handlePutItem: function(req, res) {
    const idToEdit = parseInt(req.params.id);
    const foundItemIdx = db.items.findIndex(item => item.id === idToEdit);
    if (foundItemIdx === -1) {
      res.status(404).send('Item does not exist! Use POST to insert new items');
    } else {
      db.items[foundItemIdx].name = req.body.value;
      editItemInDb(foundItemIdx);
      res.send();
    }
  },

  handlePutVote: function(req, res) {
    const idToEdit = parseInt(req.params.id);
    const foundItemIdx = db.items.findIndex(item => item.id === idToEdit);
    if (foundItemIdx === -1) {
      res.status(404).send('Item does not exist! Use POST to insert new items');
    } else {
      db.items[foundItemIdx].vote += req.body.value;
      editVoteInDb(foundItemIdx);
      res.send();
    }
  },

  handleDeleteItem: function(req, res) {
    const idToDelete = parseInt(req.params.id);
    const foundItemIdx = db.items.findIndex(item => item.id === idToDelete);
    if (foundItemIdx === -1) {
      res.status(404).send('Item does not exist!');
    } else {
      db.items.splice(foundItemIdx, 1);
      deleteItemFromDb(idToDelete);
      res.send();
    }
  }
}

function getAllItemsFromDb() {
  return sql.connect(config).then(pool => {
    sqlPool = pool;
    return pool.request()
      .query('SELECT * FROM items');
  }).then(result => {
    db.items = result.recordset;
  })
  .catch(err => {
    console.error(err);
  });
}

function postItemsToDb(idToAdd, req) {
  sqlPool.request()
    .input('id', sql.Int, idToAdd)
    .input('name', sql.VarChar(sql.MAX), req.body.value)
    .input('vote', sql.Int, 0)
    .query('INSERT INTO [dbo].[items] ([id],[name],[vote]) ' +
        'VALUES (@id, @name, @vote)')
    .catch(err => {
      console.error(err);
    });
}

function editItemInDb(foundItemIdx) {
  sqlPool.request()
    .input('id', sql.Int, db.items[foundItemIdx].id)
    .input('name', sql.VarChar(sql.MAX), db.items[foundItemIdx].name)
    .query('UPDATE [dbo].[items] ' +
          'SET [name] = @name ' +
          'WHERE [id] = @id')
    .catch(err => {
      console.error(err);
    });
}

function editVoteInDb(foundItemIdx) {
  sqlPool.request()
    .input('id', sql.Int, db.items[foundItemIdx].id)
    .input('vote', sql.Int, db.items[foundItemIdx].vote)
    .query('UPDATE [dbo].[items] ' +
            'SET [vote] = @vote ' +
            'WHERE [id] = @id')
    .catch(err => {
      console.error(err);
    });
}

function deleteItemFromDb(idToDelete) {
  sqlPool.request()
    .input('id', sql.Int, idToDelete)
    .query('DELETE FROM [dbo].[items] ' +
        'WHERE [id] = @id')
    .catch(err => {
      console.error(err);
    });
}
