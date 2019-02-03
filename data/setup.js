const client = require('./connection.js')
const chalk =  require('chalk')
const fetch = require('node-fetch')


client.indices.create({index: 'discogs'},(err, resp, status) => {
  console.log(chalk.blue('Create index..'))
  if(err) {
    console.log(chalk.red(err.response))
  } else {
    console.log(chalk.green('[' + status +'] Created index: ' + resp.index))
  }
})


fetch('https://api.discogs.com/users/theblackpaul/inventory?page=1&per_page=50&status=for sale&token=hnFIiFvjzCTckqndykzCstkEMzJuvrDgyvvSGiUL').then(response => {
  return response.json();
}).then(resp => {
  if (resp.listings) {
    resp.listings.forEach((record) => {
      client.index({
        index: 'discogs',
        id: record.id,
        type: 'records',
        body: record
      },(err,resp,status)=> {
        console.log(resp);
      })
    })
  }
})
