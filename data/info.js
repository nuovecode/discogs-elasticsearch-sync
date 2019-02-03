const client = require('./connection.js');
const chalk =  require('chalk');

client.cluster.health({},(err ,resp, status) => {
  console.log(chalk.blue('Check client Health...'))
  if (err) console.log(chalk.red(err))
  if (status === 200) {
    console.log(chalk.green(status))
    console.log(resp)
  }
});

