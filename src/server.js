const config = require('./config/config.js');
const app = require('./app.js');

console.log(`Running in NODE_ENV=${config.NODE_ENV}`);
console.log('The value of PORT is:', config.PORT);
const port = config.PORT;
app.listen(port, () =>
  console.log(`listening on port ${port}`)
);
