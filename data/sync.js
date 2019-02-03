const client = require('./connection.js')
const chalk =  require('chalk')
const fetch = require('node-fetch')
const config = require('../config.json')

createIndex(config.elasticsearch.index)
let page = 1

function createIndex(index) {
  console.log(chalk.blue('Create ' + index + '..'))
  client.indices.create({index: index },(err, resp, status) => {
    if(err) {
      if (err.status === 400) {
        console.log(chalk.blue(index + ' already exists. Skip..'))
        populateIndex(index, page)
      } else {
        console.log(chalk.red(err))
      }
    } else {
      console.log(chalk.green('[' + status +'] Created index: ' + resp.index))
      populateIndex(index, page)
    }
  })
}

function populateIndex(index, page) {
  fetch('https://api.discogs.com/users/' + config.user.name + '/inventory?page='+ page.toString() +'&per_page=100&token=' + config.user.token).then(response => {
    return response.json();
  }).then(resp => {
    if (resp.listings) {
      console.log(chalk.blue('Import ' + index + '['+ page +']..'))
      resp.listings.forEach((record) => {
        client.index({
          index: index,
          id: record.id,
          type: 'records',
          body: record
        },(err,item,status)=> {
          console.log(chalk.green(status) + ' id: ' + item._id)
        })
      })
      if (resp.pagination.pages > page) {
        populateIndex(index, page + 1)
      } else {
        console.log(resp.pagination.items + ' items imported')
      }
    }
  })
}



