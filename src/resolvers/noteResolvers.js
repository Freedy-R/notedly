import models from "../database/models/models.js";
const noteResolvers = {
  Query: {
    notes: async () => {
      return await models.Note.find();
    },
    note: (parent, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },

  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: "Adam Scott",
      });
    },
  },
};
export default noteResolvers;
