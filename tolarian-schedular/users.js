var pool = require('./connection.js')

function Users() {}

Users.prototype.readAll = function() {
    return pool.query('SELECT * FROM users', [])
}

exports = module.exports = new Users()
