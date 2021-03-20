const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const AuthRoutes = require("./app/routes/AuthRoutes");
const ProductRoutes = require("./app/routes/ProductRoute");

const DB = require("./config/Database");

dotenv.config();

const app = express();

// Connection object which contains the constant for the port and the database
// port: process.env.PORT,
// let connection_config = {
//     port: process.env.PORT,
//     database_url: process.env.MONGODB_URI
// }

// if (process.env.NODE_ENV == 'development') {
//     connection_config.port = 5000;
//     connection_config.database_url = process.env.DATABASE_URL

// }

app.use(bodyParser.urlencoded({extended: false}));

// application/json parsing json incoming request

app.use(bodyParser.json());

// Allowing CORS
app.use(cors());

// Application routes

app.use('/auth', AuthRoutes);
app.use('/product', ProductRoutes);
// routes ends here
app.use('/', (req, res) => {
    res.status(200).json({statusCode: 200, message: 'Welcome to the entry point to the api'})
})

app.all('*', (req, res, next) => {
    return res.status(404).json({statusCode: 404, message: 'Not found, invalid route'});
})
// Handling errors


app.use((error, req, res, next) => { // console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({message: message, statusCode: status});
});


const server = app.listen(process.env.PORT, (params) => {
    host = server.address().address;

    port = process.env.PORT === undefined ? server.address().port : process.env.PORT;

    console.log('Server running at ' + port);
});
