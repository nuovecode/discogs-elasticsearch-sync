const client = require('./connection.js')
const chalk =  require('chalk')
const fetch = require('node-fetch')
const config = require('../config.json')

let page = 1, bulk = []
createIndex(config.elasticsearch.index)

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

function makebulk(items, callback) {
  for(const item of items) {
    bulk.push({ index: { _index: config.elasticsearch.index, _type: 'for_sale', _id: item.id } }, item);
  }
  callback(bulk);
}

function populateIndex (resp, callback) {
  client.bulk({
    maxRetries: 5,
    index: config.elasticsearch.index,
    body: resp
  }, (error, resp, status) => {
    if (error) {
       console.log(chalk.red(status))
    } else {
      callback(resp.items);
    }
  });
}


function fetchItems(index, page) {
    fetch('https://api.discogs.com/users/' + config.user.name + '/inventory?status=for sale&page='+ page.toString() +'&per_page=100&token=' + config.user.token).then(response => {
      return response.json();
    }).then(resp => {
      if (resp.listings) {
        makebulk(resp.listings, resp => {
          populateIndex(resp, items => {
            for(const item of items) {
              console.log(chalk.green(item.index.status) + ' ' + item.index._id)
            }
          });
        });
      }
    }).catch(error =>{
      console.log(chalk.red(error))
    })
}

