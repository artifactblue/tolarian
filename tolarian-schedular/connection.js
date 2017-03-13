/**
 * How to use exports 
 * Reference: https://987.tw/2014/03/08/export-this-node-jsmo-zu-de-jie-mian-she-ji-mo-shi/
 */
var pg = require('pg')

var MAX = 10
var IDLE_TIMEOUT_MILLIS = 30000

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
    user: process.env.AWS_RDS_USER, //env var: PGUSER
    database: process.env.AWS_RDS_DATABASE, //env var: PGDATABASE
    password: process.env.AWS_RDS_PASSWORD, //env var: PGPASSWORD
    host: process.env.AWS_RDS_HOST, // Server hosting the postgres database
    port: process.env.AWS_RDS_PORT, //env var: PGPORT
    max: MAX, // max number of clients in the pool
    idleTimeoutMillis: IDLE_TIMEOUT_MILLIS // how long a client is allowed to remain idle before being closed
}

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config)

module.exports = pool
