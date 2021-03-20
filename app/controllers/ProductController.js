// import dependencies
const validator = require('validator');
const payloadChecker = require('payload-validator');

// import the helpers
const Token = require("../helpers/Token");
const FireStore = require("../helpers/FireStore");
const Util = require("../helpers/Util");

// import the models
const ProductModel = require("../models/ProductModel");

class ProductController { // method to create a new product
    static async createNew(req, res) {
        // validate the input

        // set the expected payload object

        let expectedPayload = {
            "uploadedBy": "",
            "token": "",
            "productName": "",
            "address": "",
            "city": "",
            "country": "",
            "productPrice" : ""
        };

        // validate received body payload
        if (req.body) {
            let payloadCheckRes = payloadChecker.validator(req.body, expectedPayload, [
                "uploadedBy",
                "token",
                "productName",
                "address",
                "city",
                "country",
                "productPrice"
            ], false);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) { // check if file is part of the request or not
                if (req.file != undefined) { // validate the token
                    let tokenToEmail = Token.verify(req.body.token);

                    // check if the token is not expired yet
                    if (tokenToEmail) { // check if the email is valid

                        if (validator.isEmail(tokenToEmail)) { // extend the payload object

                            req.body.email_of_uploadedBy = tokenToEmail;

                            // initialize a variable to hold the status of the file upload
                            let fileUpload;

                            // generate a random string and extend the payload for productUrl
                            req.body.productUrl = "https://tradedepot/product/" + Util.generateRandomStr(10);

                            let uploadResp = FireStore.uploadImage(req.file.path, req.file.filename);

                            // handle file upload async
                            await uploadResp.then(result => {
                                fileUpload = result
                            }).catch(err => {
                                fileUpload = err;
                            })

                            // check the status of the file uploaded
                            if (fileUpload == false) {
                                res.status(404).json({name: "Upload Product", "message": "An error occurred while uploading the image", "sucess": false})

                            } else { // extend the payload with the productImgUrl
                                req.body.productImgUrl = fileUpload;

                                // insert the data into the ProductModel
                                let createProduct = new ProductModel(req.body);

                                createProduct.save().then(() => {

                                    res.status(200).json({name: "Upload Product", "message": "Product uploaded successfully", "success": true})

                                }).catch(err => {

                                    res.status(404).json({name: "Upload Product", "message": "An error occurred", "success": false})

                                });

                            }
                        } else { // Access Forbidden
                            res.status(403).json({name: "Upload Product", "message": "Session expired or invalid", "sucess": false})
                        }
                    } else { // Unauthorized email
                        res.status(401).json({name: "Upload Product", "message": "Invalid email", "sucess": false})
                    }
                } else {
                    res.status(406).json({name: "Upload Product", "message": "File is required", "sucess": false})
                }
            } else { // Bad Request
                res.status(400).json({name: "Upload Product", "message": payloadCheckRes.response.errorMessage, "success": false})
            }
        } else { // Bad Request
            res.status(404).json({name: "Upload Product", "message": "Incorrect payload", "sucess": false})
        }
    }

    // method to fetch all products
    static fetchProducts(req, res) {
        // validate the input

        // set the expected payload object

        let expectedPayload = {
            "address": "",
            "city": "",
            "country": ""
        };

        // validate received body payload
        if (req.body) {
            let payloadCheckRes = payloadChecker.validator(req.body, expectedPayload, [
                "address", "city", "country"
            ], false);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) {

                ProductModel.find({}, (fetchErr, fetchRes) => {

                    if (fetchErr) { // Not Found due to an error
                        res.status(404).json({name: "Fetch Products", "message": "An error occurred", "success": false})

                    } else {
                        res.status(200).json({name: "Fetch Products", "message": "Successfully fetched", "success": true, "data": fetchRes})
                    }
                })
            } else {
                res.status(400).json({name: "Fetch Products", "message": payloadCheckRes.response.errorMessage, "success": false})
            }
        } else {
            res.status(404).json({name: "Fetch Products", "message": "Incorrect payload", "sucess": false})

        }
    }
};

module.exports = ProductController;
