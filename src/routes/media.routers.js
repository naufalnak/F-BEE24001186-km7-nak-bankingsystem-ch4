const express = require("express");
const router = express.Router();
// const multer = require("multer")();

const { uploadImage } = require("../libs/multer");
const {
  imagekitUpload,
} = require("../media-handling/controllers/media.controllers");

// router.post("/images", uploadImage, storageImage);
// // router.post("/videos", storage.image.single("video"), storageVideo);
// // router.post("/files", storage.image.single("file"), storageFile);

router.put("/users/:userId/image", uploadImage, imagekitUpload);

// router.post("/imagekit/:userId", multer.single("image"), imagekitUpload);

module.exports = router;
