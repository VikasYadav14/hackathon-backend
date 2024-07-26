const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/dbConnection')
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT;

app.use(bodyParser.json())
app.use(cors());
app.use('/api', require('./src/routes'));

app.listen(PORT, (err) => {
    console.log(PORT);
    err ?
        console.log(`connection failed at port: ${PORT}`)
        :
        console.log(`connction successful port: ${PORT}`);
    console.log(PORT);
})

module.exports = app;