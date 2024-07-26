const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http').createServer(app);
const db = require('./config/dbConnection')
const bodyParser = require('body-parser');
const cors = require('cors');


const PORT = process.env.PORT || 5000;

app.use(bodyParser.json())

app.use('/api', require('./src/routes'));

http.listen(PORT, (err) => {
    console.log(PORT);
    err ?
        console.log(`connection failed at port: ${PORT}`)
        :
        console.log(`connction successful port: ${PORT}`);
    console.log(PORT);
})