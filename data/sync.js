const client = require('./connection.js')
const chalk =  require('chalk')
const fetch = require('node-fetch')
const config = require('../config.json')

createIndex(config.elasticsearch.index)

function createIndex(index) {
  console.log(chalk.blue('Create index..' + index))
  client.indices.create({index: index },(err, resp, status) => {
    if(err) {
      console.log(chalk.red(err.response))
    } else {
      console.log(chalk.green('[' + status +'] Created index: ' + resp.index))
      populateIndex(index)
    }
  })
}

function populateIndex(index) {
  console.log(chalk.blue('Populate index ..'))
  fetch('https://api.discogs.com/users/' + config.user.name + '/inventory?page=1&per_page=50&token=' + config.user.token).then(response => {
    return response.json();
  }).then(resp => {
    if (resp.listings) {
      resp.listings.forEach((record) => {
        client.index({
          index: index,
          id: record.id,
          type: 'records',
          body: record
        },(err,resp,status)=> {
          console.log(resp);
        })
      })
    }
  })
}



