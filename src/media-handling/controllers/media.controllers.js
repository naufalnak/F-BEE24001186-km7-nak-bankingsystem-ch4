const imagekit = require("../../libs/imagekit");
const UserService = require("../../services/user");

module.exports = {
  storageImage: (req, res) => {
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        image_url: imageUrl,
      },
    });
  },

  storageVideo: (req, res) => {
    const videoUrl = `${req.protocol}://${req.get("host")}/videos/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        video_url: videoUrl,
      },
    });
  },

  storageFile: (req, res) => {
    const fileUrl = `${req.protocol}://${req.get("host")}/files/${
      req.file.filename
    }`;

    return res.status(200).json({
      status: true,
      message: "success",
      data: {
        file_url: fileUrl,
      },
    });
  },

  // imagekitUpload: async (req, res) => {
  //   try {
  //     const stringFile = req.file.buffer.toString("base64");

  //     const uploadFile = await imagekit.upload({
  //       fileName: req.file.originalname,
  //       file: stringFile,
  //     });

  //     return res.json({
  //       status: true,
  //       message: "success",
  //       data: {
  //         name: uploadFile.name,
  //         url: uploadFile.url,
  //         type: uploadFile.fileType,
  //       },
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  imagekitUpload: async (req, res) => {
    console.log(req.file); // Cek isi req.file
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded.",
      });
    }

    try {
      const stringFile = req.file.buffer.toString("base64");

      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });

      const userId = req.params.userId;

      await UserService.uploadImage(userId, uploadFile.url);

      return res.json({
        status: true,
        message: "success",
        data: {
          name: uploadFile.name,
          url: uploadFile.url,
          type: uploadFile.fileType,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: `Failed to upload: ${err.message}`,
      });
    }
  },
};
