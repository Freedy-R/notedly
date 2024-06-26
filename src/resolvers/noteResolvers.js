import models from "../database/models/models.js";

const noteResolvers = {
  Query: {
    notes: async (parent, args, { models }) => {
      return await models.Note.find();
    },
    note: async (parent, args, { models }) => {
      return notes.find((note) => note.id === args.id);
    },
  },

  Mutation: {
    newNote: async (parent, args, { models }) => {
      return await models.Note.create({
        content: args.content,
        author: "Adam Scott",
      });
    },
    updateNote: async (parent, args, { models }) => {
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
    deleteNote: async (parent, args) => {
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
