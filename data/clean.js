const client = require('./connection.js');
const chalk =  require('chalk');
const config = require('../config.json')

let index = config.elasticsearch.index
if (process.env.npm_config_index) {
  index = process.env.npm_config_index
}

console.log(chalk.blue('Delete '+ index + '..'))
client.indices.delete({
  index: index
}, (err, resp, status) =>{
  if(err || status === 404) console.log(chalk.red('[' + status +'] Index ' + index + ' don\'t exists'))
  else console.log(chalk.green('[' + status +'] Deleted index ' + index))
})
