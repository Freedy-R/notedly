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
      // Jeżeli użytkownik nie zostanie znaleziony, należy zgłosić błąd uwierzytelniania.
      if (!user) {
        throw new AuthenticationError();
      }
      // Sprawdzenie, czy użytkownik oznaczył już daną notatkę jako ulubioną.
      let noteCheck = await models.Note.findById(id);
      const hasUser = noteCheck.favoritedBy.indexOf(user.id);
      // Jeżeli nazwa użytkownika znajduje się na liście, należy ją
      // z niej usunąć i zmniejszyć o 1 wartość właściwości favoriteCount.
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
            // Właściwości new należy przypisać wartość true, aby zwrócić uaktualnioną notatkę.
            new: true,
          }
        );
      } else {
        // Jeżeli nazwa użytkownika nie znajduje się na liście, należy ją
        // dodać do listy i zwiększyć o 1 wartość właściwości favoriteCount.
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
