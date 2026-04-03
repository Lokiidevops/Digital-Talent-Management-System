const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isSubmission = req.url.includes("/submit/");
    const isProfile = req.url.includes("/update-profile");
    cb(null, path.join(__dirname, "../uploads", isProfile ? "profiles" : (isSubmission ? "submissions" : "tasks")));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname).toLowerCase(),
    );
  },
});

// File filter (allow images and documents)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    console.error("Multer Filter Error: Invalid file type", file.mimetype, path.extname(file.originalname));
    cb(new Error("Error: Allow only Images and Documents!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter,
});

module.exports = upload;
