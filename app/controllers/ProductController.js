// import dependencies
const validator = require('validator');
const payloadChecker = require('payload-validator');

// import the helpers
const Token = require("../helpers/Token");
const FireStore = require("../helpers/FireStore");
const Util = require("../helpers/Util");

// import the models
const ProductModel = require("../models/ProductModel");
const CommentsModel = require("../models/CommentsModel");

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
            "productPrice": ""
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
                            req.body.productUrl = "/products/" + Util.generateRandomStr(10);

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
                            res.status(403).json({name: "Upload Product", "message": "You need to be logged in first", "sucess": false})
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
            "country": ""
        };

        // validate received body payload
        if (req.query) {
            let payloadCheckRes = payloadChecker.validator(req.query, expectedPayload, [
                "address", "country"
            ], false);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) {
                let sortFunc;
                // sort by no of comments(Favorites)
                if (req.query.sort === "comments") {
                    sortFunc = {
                        "no_of_comments": -1
                    }

                } else {
                    sortFunc = {
                        "created_at": -1
                    }
                };

                let priorityFunc;

                if (req.query.city.length > 0) { // sort by address

                    priorityFunc = {
                        "city": req.query.city
                    }
                } else {
                    priorityFunc = {};
                };

                ProductModel.find(priorityFunc, null, {
                    sort: sortFunc
                }, (fetchErr, fetchRes) => {

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

    // method to fetch a product's info
    static fetchProductInfo(req, res) {
        // validate the input

        // set the expected payload object

        let expectedPayload = {
            "productID": ""
        };

        // validate received body payload
        if (req.query) {
            let payloadCheckRes = payloadChecker.validator(req.query, expectedPayload, ["productID"], false);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) {

                ProductModel.findOne({
                    _id: productID
                }, (fetchErr, fetchRes) => {

                    if (fetchErr) { // Not Found due to an error
                        res.status(404).json({name: "Fetch Product Info", "message": "An error occurred", "success": false})

                    } else {
                        res.status(200).json({name: "Fetch Product Info", "message": "Successfully fetched", "success": true, "data": fetchRes})
                    }
                })

            } else {
                res.status(400).json({name: "Fetch Product Info", "message": payloadCheckRes.response.errorMessage, "success": false})
            }
        } else {
            res.status(404).json({name: "Fetch Product Info", "message": "Incorrect payload", "sucess": false})
        }
    }


    static postComment(req, res) {
        // validate the input

        // set the expected payload object

        let expectedPayload = {
            "token": "",
            "postedBy": "",
            "productID": "",
            "comment": ""
        };

        // validate received body payload
        if (req.body) {
            let payloadCheckRes = payloadChecker.validator(req.body, expectedPayload, [
                "token", "postedBy", "productID", "comment"
            ], true);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) {
                let tokenToEmail = Token.verify(req.body.token);

                // check if the token is not expired yet
                if (tokenToEmail) { // check if the email is valid

                    if (validator.isEmail(tokenToEmail)) { // extend the payload by email_of_postedBy
                        req.body.email_of_postedBy = tokenToEmail;
                        // validate the product id first
                        ProductModel.findOneAndUpdate({
                            _id: req.body.productID
                        }, {
                            $inc: {
                                'no_of_comments': 1
                            }
                        }, (proErr, proSuc) => {

                            if (proErr) { // Product not found
                                res.status(404).json({name: "Post Comment", "message": "An error occurred", "success": false})

                            } else { // Add comment to CommentsModel

                                if (proSuc === null) {
                                    res.status(404).json({name: "Post Comment", "message": "This product seems to have been deleted", "sucess": false})

                                } else {
                                    let addComment = new CommentsModel(req.body);

                                    addComment.save().then(() => { // successfully added
                                        res.status(200).json({name: "Post Comment", "message": "Your comment has been posted successfully", "sucess": true})

                                    }).catch(() => {
                                        res.status(404).json({name: "Post Comment", "message": "An error occurred", "success": false})
                                    })
                                }
                            }
                        })

                    } else { // Unauthorized email
                        res.status(401).json({name: "Post Comment", "message": "Invalid email", "sucess": false})

                    }

                } else { // Access Forbidden
                    res.status(403).json({name: "Post Comment", "message": "You need to be logged in first", "sucess": false})
                }
            } else {
                res.status(400).json({name: "Post Comment", "message": payloadCheckRes.response.errorMessage, "success": false})
            }
        } else {
            res.status(404).json({name: "Post Comment", "message": "Incorrect payload", "sucess": false})

        }
    }


    // method to fetch all comments of a product
    static fetchComments(req, res) {
        // validate the input

        // set the expected payload object

        let expectedPayload = {
            "productID": ""
        };

        // validate received body payload
        if (req.query) {
            let payloadCheckRes = payloadChecker.validator(req.query, expectedPayload, ["productID"], false);

            // check if the payload is successfully validated or not
            if (payloadCheckRes.success) {

                CommentsModel.find({
                    productID: req.query.productID
                }, null, {
                    sort: {
                        "created_at": -1
                    }
                }, (fetchErr, fetchRes) => {

                    if (fetchErr) { // Not Found due to an error
                        res.status(404).json({name: "Fetch Product's Comments", "message": "An error occurred", "success": false})

                    } else {
                        if (fetchRes === null) {
                            res.status(404).json({name: "Fetch Product's Comments", "message": "This product seems to have been deleted", "sucess": false})
                        } else {
                            res.status(200).json({name: "Fetch Product's Comments", "message": "Successfully fetched", "success": true, "data": fetchRes})
                        }
                    }
                })
            } else {
                res.status(400).json({name: "Fetch Product's Comments", "message": payloadCheckRes.response.errorMessage, "success": false})
            }
        } else {
            res.status(404).json({name: "Fetch Product's Comments", "message": "Incorrect payload", "sucess": false})

        }
    }
};

module.exports = ProductController;
