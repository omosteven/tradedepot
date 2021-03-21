const mongoose = require("mongoose");

const timeStamps = require("mongoose-timestamp");

const ProductModel = new mongoose.Schema({

    uploadedBy: {
        type: String,

        required: true
    },

    email_of_uploadedBy: {
        type: String,

        required: true,

        lowercase: true
    },

    productName: {
        type: String,

        required: true
    },

    productPrice: {
        type: String,

        required: true
    },

    productUrl: {
        type: String,

        required: true,

        unique: true
    },

    productImgUrl: {
        type: String,

        required: true,

        unique: true

    },

    address: {
        type: String,

        required: true
    },

    city: {
        type: String,

        required: true
    },

    country: {
        type: String,

        required: true
    },

    no_of_comments: {
        type: Number,
        required: true
    }
});

ProductModel.plugin(timeStamps, {
    createdAt: "created_at",

    updatedAt: "updated_at"
});

module.exports = mongoose.model("ProductData", ProductModel);
