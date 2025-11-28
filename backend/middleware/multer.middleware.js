import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const uniquesuffix =
      file.originalname + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquesuffix);
  },
});
const upload = multer({
  storage: storage,
});
export default upload;
