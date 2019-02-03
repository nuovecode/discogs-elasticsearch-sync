const elasticsearch = require('elasticsearch');
const config = require('../config.json')

let client = new elasticsearch.Client( {
  hosts: [
    config.elasticsearch.host
  ]
});

module.exports = client;
