const client = require('./connection.js');
const chalk =  require('chalk');

client.indices.delete({index: 'discogs'}, (err, resp, status) =>{
  console.log(chalk.blue('Delete..'))
  if(err) {
    console.log(chalk.red(err.response))
  } else {
    console.log(chalk.green('[' + status +'] Deleted index'))
  }
});
