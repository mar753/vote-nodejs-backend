'use strict';

const db = {items: []};

module.exports = {
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
    res.send();
  },

  handlePutItem: function(req, res) {
    const idToEdit = parseInt(req.params.id);
    const foundItemIdx = db.items.findIndex(item => item.id === idToEdit);
    if (foundItemIdx === -1) {
      res.status(404).send('Item does not exist! Use POST to insert new items');
    } else {
      db.items[foundItemIdx].name = req.body.value;
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
      res.send();
    }
  }
}
