const multer = require("multer");
const path = require("path");


// Storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});


// File type validation

const fileFilter = (req, file, cb) => {

  // Front and back book images
  if (
    file.fieldname === "bookImages" &&
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
    return;
  }


  // Book PDF
  if (
    file.fieldname === "bookPdf" &&
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
    return;
  }


  cb(
    new Error(
      "Invalid file type."
    )
  );
};


// Multer configuration

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});


module.exports = upload;