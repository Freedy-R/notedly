import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    // Dodaj właściwość favoriteCount.
    favoriteCount: {
      type: Number,
      default: 0,
    },
    // Dodaj właściwość favoritedBy.
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Przypisanie właściwości createdAt i updatedAt typu Date.
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
