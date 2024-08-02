import multer, { FileFilterCallback } from "multer";
import { Request, Response } from "express";
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerUploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});
export default multerUploader;
