import mongoose from "mongoose";

const noteSchemaModel = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Note = mongoose.model("Note", noteSchemaModel);

export default Note;
