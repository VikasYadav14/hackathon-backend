const express = require('express');
const app = express();
const http = require('http').createServer(app);
const db = require('./config/dbConnection')
const bodyParser = require('body-parser');
const PORT = 5001;

app.use(bodyParser.json())

app.use('/api', require('./src/routes'));

http.listen(PORT,(err)=>{
    err ? 
    console.log(`connection failed at port: ${PORT}`)
    :
    console.log(`connction successful port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})