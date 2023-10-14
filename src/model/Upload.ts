import Joi from "joi";
import mongoose, { Schema, Model } from "mongoose";
import { FormTypes } from "../../types";

type FileUploadTypes = {
  file: Buffer;
  fileType: string;
};

const fileSchema: Schema<FileUploadTypes> = new mongoose.Schema({
  file: { type: Buffer, required: true },
  fileType: { type: String, required: true },
});

const File: Model<FileUploadTypes> = mongoose.model("File", fileSchema);

function validateFile(file: FileUploadTypes) {
  const schema = Joi.object<FileUploadTypes>({
    file: Joi.binary().required(),
    fileType: Joi.string().required(),
  });

  return schema.validate(file);
}

export { validateFile, File };
