const crypto = require('crypto');

class Util {

    static generateRandomStr(size) { // return randomBytes(5).toString("hex");
        return crypto.randomBytes(256).toString('hex').slice(0, size);
    }
};
module.exports = Util;
