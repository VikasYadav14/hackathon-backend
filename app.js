const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/dbConnection')
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 5001;

app.use(bodyParser.json())
app.use(cors());
app.use((req, res, next) => {
    res.setTimeout(600000, () => { // 10 minutes
        console.log('Request has timed out.');
        res.sendStatus(408); // Request Timeout
    });
    next();
});
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