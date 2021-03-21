const mongoose = require("mongoose");

const timeStamps = require("mongoose-timestamp");

const CommentsModel = new mongoose.Schema({

    productID: {
        type: String,

        required: true
    },
    postedBy: {
        type: String,

        required: true
    },
    email_of_postedBy: {
        type: String,

        required: true,

        lowercase: true
    },
    comment: {
        type: String,

        required: true
    }

});

CommentsModel.plugin(timeStamps, {
    createdAt: "created_at",

    updatedAt: "updated_at"
});

module.exports = mongoose.model("CommentsData", CommentsModel);
