let mongoose = require('mongoose');

// const server = 'mongodb://localhost:27017/tradedepot'; // REPLACE WITH YOUR DB SERVER
// const server = 'mongodb+srv://MentUp:PrWdYH1jivvEQ7fE@cluster0.lx7g9.mongodb.net/MENTUP?retryWrites=true&w=majority';

const server = 'mongodb+srv://dbTradeDepot:jtnpNrfvBUHozBOP@cluster0.tmibi.mongodb.net/dbTradeDepot?retryWrites=true&w=majority';

class Database {

    constructor() {

        this._connect()

    }

    _connect() {

        mongoose.connect(server, {
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(() => {

            console.log('Database connection successful')

        }).catch(err => {

            console.error('Database connection error')

        })

    }

}

module.exports = new Database()
