const express = require('express');

const app = express();



// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));

const port = process.env.PORT || 8082;
app.listen(port, () => {
  console.log('REST API listening on port ', port);
});
