const multer = require("multer");

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./adminuploads");
  },
  filename: (req, file, callback) => {
    const filename = `image-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});


// FILE FILTER
const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only PNG, JPG, JPEG files are allowed"));
  }
};


// MULTER CONFIG
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;