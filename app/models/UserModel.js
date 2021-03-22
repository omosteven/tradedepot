const mongoose = require("mongoose");

const timeStamps = require("mongoose-timestamp");

const UserModel = new mongoose.Schema({
    email: {
        type: String,

        required: true,

        unique: true,

        lowercase: true
    },

    password: {
        type: String,

        required: true
    },

    fullName: {
        type: String,

        required: true
    },

    address: {
        type: String
    },

    city: {
        type: String,

        required: true
    },

    state: {
        type: String,

        required: true
    },

    phoneNumber: {
        type: String
    },
    country: {
        type: String,

        required: true
    },

    token: {
        type: String
    }
});

UserModel.plugin(timeStamps, {
    createdAt: "created_at",

    updatedAt: "updated_at"
});

module.exports = mongoose.model("UserData", UserModel);
