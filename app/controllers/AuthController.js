// import dependencies
const validator = require('validator');
const passwordHash = require("bcryptjs");
const payloadChecker = require('payload-validator');

// import the helpers
const Token = require("../helpers/Token");

// import the models
const UserModel = require('../models/UserModel');

class AuthController {

    // method to handle user log in
    static login(req, res) {
        // validate the input

        // set the expected payload object
        let expectedPayload = {
            "email": "",
            "password": ""
        };

        // validate received body payload
        if (req.body) {
            let payloadCheckRes = payloadChecker.validator(req.body, expectedPayload, [
                "email", "password"
            ], false);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) { // check if the email is valid
                if (validator.isEmail(req.body.email)) { // generate token

                    let newToken = Token.generate(req.body.email);

                    // Authenticate email and password and update token upon success
                    let email = req.body.email;

                    UserModel.findOneAndUpdate({
                        email
                    }, {
                        token: newToken
                    }, (loginErr, loginSuc) => { // if the request to the DB fails

                        if (loginErr) { // Not Found due to an error
                            res.status(404).json({name: "Login", "message": "An error occurred", "success": false})

                        } else { // if no result found

                            if (loginSuc == null) { // User Not Found
                                res.status(404).json({name: "Login", "message": "Incorrect login details", "sucess": false})

                            } else { // verify the hash of the password in the DB with the password in the payload
                                if (passwordHash.compareSync(req.body.password, loginSuc.password)) {
                                    // User Successfully Found
                                    // Mask off password for security sake
                                    loginSuc.password = "";
                                    loginSuc.token = newToken;
                                    res.status(200).json({name: "Login", "message": "Successfully logged in", "sucess": true, data: loginSuc})

                                } else { // User Not Found
                                    res.status(404).json({name: "Login", "message": "Incorrect login details", "sucess": false})

                                }
                            }
                        }
                    })

                } else { // Email Not Accepted
                    res.status(406).json({name: "Login", "message": "Invalid email", "sucess": false})

                }
            } else { // Bad Request
                res.status(400).json({name: "Login", "message": payloadCheckRes.response.errorMessage, "success": false})
            }
        } else { // Bad Request
            res.status(404).json({name: "Login", "message": "Incorrect payload", "sucess": false})
        }
    }

    static signUp(req, res) {
        // validate the input

        // set the expected payload object

        let expectedPayload = {
            "fullName": "",
            "email": "",
            "password": "",
            "address": "",
            "country": ""
        };

        // validate received body payload
        if (req.body) {
            let payloadCheckRes = payloadChecker.validator(req.body, expectedPayload, [
                "fullName",
                "email",
                "password",
                "address",
                "country"
            ], false);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) { // check if the email is valid
                if (validator.isEmail(req.body.email)) {

                    if (req.body.password.length >= 8) { // Perform hashing on the password
                        let hashedPassword = passwordHash.hashSync(req.body.password, 10);
                        // Update the password to the hashed version
                        req.body.password = hashedPassword;

                        // Insert the user data into the UserData collection

                        let SignUp = new UserModel(req.body);

                        SignUp.save().then(() => { // Successful creation
                            res.status(200).json({name: "SignUp", "message": "Account created successfully", "success": true})

                        }).catch(err => { // check if error occurs due to duplicate email (unique) or not
                            if (err.keyPattern.email != undefined) { // Email Unauthorized for SignUp
                                res.status(401).json({name: "SignUp", "message": "Email already in use", "success": false})

                            } else { // Not Found due to an error
                                res.status(404).json({name: "SignUp", "message": "An error occurred", "success": false})
                            }
                        })

                    } else { // Password Length Not Accepted
                        res.status(406).json({name: "SignUp", "message": "Password length not accepted", "sucess": false})

                    }
                } else { // Email Not Accepted
                    res.status(406).json({name: "SignUp", "message": "Invalid email", "sucess": false})

                }
            } else { // Bad Request
                res.status(400).json({name: "SignUp", "message": payloadCheckRes.response.errorMessage, "success": false})
            }
        } else { // Bad Request
            res.status(404).json({name: "SignUp", "message": "Incorrect payload", "sucess": false})
        }

    }
};
module.exports = AuthController
