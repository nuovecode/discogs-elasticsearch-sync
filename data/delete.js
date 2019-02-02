let client = require('./connection.js');
let chalk =  require('chalk');

client.indices.delete({index: 'discogs_tmp'}, (err, resp, status) =>{
  console.log(chalk.blue('Delete..'))
  if(err) {
    console.log(chalk.red(err.response))
  } else {
    console.log(chalk.green('[' + status +'] Deleted index'))
  }
});
