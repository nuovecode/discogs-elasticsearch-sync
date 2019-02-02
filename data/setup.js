var client = require('./connection.js');
let chalk =  require('chalk');

client.indices.create({index: 'discogs'},(err, resp, status) => {
  console.log(chalk.blue('Create index..'))
  if(err) {
    console.log(chalk.red(err.response))
  } else {
    console.log(chalk.green('[' + status +'] Created index: ' + resp.index))
  }
});


// TODO: populate db
