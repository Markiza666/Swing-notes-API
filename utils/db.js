const Datastore = require('nedb');
const path = require('path');

const db = {
    users: new Datastore({ filename: path.join(__dirname, '../data/users.db'), autoload: true }),
    notes: new Datastore({ filename: path.join(__dirname, '../data/notes.db'), autoload: true })
};

module.exports = db;