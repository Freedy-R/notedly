import mongoose from "mongoose";
import models from "../database/models/models.js";

const noteResolvers = {
  Query: {
    notes: async (parent, args, { models }) => {
      return await models.Note.find();
    },
    note: async (parent, args, { models }) => {
      return await models.Note.findById(args.id);
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
  },
};
export default noteResolvers;
