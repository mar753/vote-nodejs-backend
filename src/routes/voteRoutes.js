app = module.parent.exports.app;

const voteHandler = require('../handlers/vote');

app.get('/items', voteHandler.handleGetItems);
app.post('/items', voteHandler.handlePostItem);
app.put('/items/:id', voteHandler.handlePutItem);
app.delete('/items/:id', voteHandler.handleDeleteItem);
app.put('/items/:id/vote', voteHandler.handlePutVote);

module.exports = voteHandler.init;
