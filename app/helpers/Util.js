const crypto = require('crypto');
const nodemailer = require("nodemailer");

class Util {

    static generateRandomStr(size) { // return randomBytes(5).toString("hex");
        return crypto.randomBytes(256).toString('hex').slice(0, size);
    }

    static sendMail(mailOptions) {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "omosteven123@gmail.com",
                pass: "adebomii"
            }
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return false;
                // console.log("error");
            } else {
                return true;
                // console.log("sent");
            }
        });
    }
};
module.exports = Util;
