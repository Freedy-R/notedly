import mongoose from "mongoose";
import models from "../database/models/models.js";

const noteResolvers = {
  Note: {
    author: async (note, args, { models }) => {
      return await models.User.findById(note.author);
    },
    favoritedBy: async (note, args, { models }) => {
      return await models.User.find({ _id: { $in: note.favoritedBy } });
    },
  },
  Mutation: {
    newNote: async (parent, args, { models, user }) => {
      if (!user) {
        throw new Error("You must be logged in to create a note");
      }
      return await models.Note.create({
        content: args.content,
        author: mongoose.Types.ObjectId.createFromHexString(user.id),
      });
    },
    updateNote: async (parent, args, { models, user }) => {
      if (!user) {
        throw new Error("You must be logged in to update a note");
      }
      const note = await models.Note.FindById(args.id);
      if (note && String(note.author) !== user.id) {
        throw new Error("You can only update your own notes");
      }
      return await models.Note.findByIdAndUpdate(
        {
          _id: args.id,
        },
        {
          $set: {
            content: args.content,
          },
        },
        {
          new: true,
        }
      );
    },
    deleteNote: async (parent, args, { models, user }) => {
      if (!user) {
        throw new Error("You must be logged in to delete a note");
      }
      const note = await models.Note.FindById(args.id);
      if (note && String(note.author) !== user.id) {
        throw new Error("You can only delete your own notes");
      }
      try {
        await models.Note.findByIdAndDelete({ _id: args.id });
        return true;
      } catch (err) {
        console.error("Error deleting note:", err);
        return false;
      }
    },
    toggleFavorite: async (parent, { id }, { user }) => {
      if (!user) {
        throw new AuthenticationError();
      }
      let noteCheck = await models.Note.findById(id);
      const hasUser = noteCheck.favoritedBy.indexOf(user.id);
      if (hasUser >= 0) {
        return await models.Note.findByIdAndUpdate(
          id,
          {
            $pull: {
              favoritedBy: mongoose.Types.ObjectId(user.id),
            },
            $inc: {
              favoriteCount: -1,
            },
          },
          {
            new: true,
          }
        );
      } else {
        return await models.Note.findByIdAndUpdate(
          id,
          {
            $push: {
              favoritedBy: mongoose.Types.ObjectId(user.id),
            },
            $inc: {
              favoriteCount: 1,
            },
          },
          {
            new: true,
          }
        );
      }
    },
  },
};
export default noteResolvers;
