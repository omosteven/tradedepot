const jwt = require('jsonwebtoken');

class Token { // helper method to generate a token
    static generate(text) {

        const jwtKey = 'tradeDepot';

        const jwtExpirySeconds = 604800;
        // For a week

        const token = jwt.sign({
            text
        }, jwtKey, {
            algorithm: 'HS256',

            expiresIn: jwtExpirySeconds
        });

        return token;
    }

    // helper method to verify token
    static verify(token) {

        try {

            let payload = jwt.verify(token, "tradeDepot");

            return payload.text

        } catch (e) {

            if (e instanceof jwt.JsonWebTokenError) {
                return false;

            } else {

                return e;

            }

        }
    }

};

module.exports = Token
