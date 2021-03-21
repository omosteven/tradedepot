const express = require("express");
const multer = require("multer");

const router = express.Router();
const uploadFile = multer({dest: 'uploads'});

const ProductController = require("../controllers/ProductController");

router.post("/create/", uploadFile.single("productImg"), ProductController.createNew);

router.get("/fetchall/", ProductController.fetchProducts);

router.post("/comments/publish/", ProductController.postComment);

router.get("/comments/fetchall/", ProductController.fetchComments);

module.exports = router;
