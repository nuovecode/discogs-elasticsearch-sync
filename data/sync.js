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
        fetchItems(index, page)
      } else {
        console.log(chalk.red(err))
      }
    } else {
      console.log(chalk.green('[' + status +'] Created index: ' + resp.index))
      fetchItems(index, page)
    }
  })
}

function fetchItems(index, page) {
    fetch('https://api.discogs.com/users/' + config.user.name + '/inventory?status=for sale&page='+ page.toString() +'&per_page=5&token=' + config.user.token).then(response => {
      return response.json();
    }).then(resp => {
      if (resp.listings) {
        console.log(chalk.blue('Import ' + index + '['+ page +']..'))
        resp.listings.forEach((record) => {
          populateIndex(index, record)
        })
        if (resp.pagination.pages > page) {
          setTimeout(() => {
            fetchItems(index, page + 1)
          }, 0)
        } else {
          console.log(resp.pagination.items + ' items imported')
        }
      }
    }).catch(error =>{
      console.log(chalk.red(error))
    })
}

function populateIndex (index, record) {
  client.index({
    index: index,
    id: record.id,
    type: 'records',
    body: record
  },(err,item,status)=> {
    if(status === 200) {
      console.log(chalk.green(status) + ' id: ' + record.id)
    } else {
      console.log(chalk.red(status) + ' id: ' + record.id)
    }
  })
}

