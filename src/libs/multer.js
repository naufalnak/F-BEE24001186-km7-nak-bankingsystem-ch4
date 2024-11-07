const multer = require("multer");
// const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      const err = new Error(
        `Only ${allowedMimeTypes.join(", ")} allowed to upload!`
      );
      callback(err, false);
    }
  },
});

// Ekspor middleware upload untuk digunakan di router
module.exports = {
  uploadImage: upload.single("image"), // Ganti "image" dengan nama field yang sesuai
};

// const filename = (req, file, callback) => {
//   const fileName = Date.now() + path.extname(file.originalname);
//   callback(null, fileName);
// };

// const generateStorage = (destination) => {
//   return multer.diskStorage({
//     destination: (req, file, callback) => {
//       callback(null, destination);
//     },
//     filename,
//   });
// };

// // libs/multer.js
// module.exports = {
//   image: multer({
//     storage: generateStorage("./public/images"),
//     fileFilter: (req, file, callback) => {
//       const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

//       if (allowedMimeTypes.includes(file.mimetype)) {
//         callback(null, true);
//       } else {
//         const err = new Error(
//           `Only ${allowedMimeTypes.join(", ")} allowed to upload!`
//         );
//         callback(err, false);
//       }
//     },
//     onError: (err, next) => {
//       next(err);
//     },
//   }),
// };
