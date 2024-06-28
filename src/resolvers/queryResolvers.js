const queryResolvers = {
  Query: {
    notes: async (parent, args, { models }) => {
      return await models.Note.find().limit(100);
    },
    note: async (parent, args, { models }) => {
      return await models.Note.findById(args.id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.find({});
    },
    user: async (parent, args, { models }) => {
      return await models.User.findOne({ username: args.username });
    },
    me: async (parent, args, { models, user }) => {
      return await models.User.findById(user.id);
    },
    noteFeed: async (parent, args, { models }) => {
      const limit = 10;
      let hasNextPage = false;
      let cursorQuery = {};
      if (args.cursor) {
        cursorQuery = { _id: { $lt: args.cursor } };
      }
      let notes = await models.Note.find(cursorQuery)
        .sort({ _id: -1 })
        .limit(limit + 1);
      if (notes.length > limit) {
        hasNextPage = true;
        notes = notes.slice(0, -1);
      }
      const newCursor = notes[notes.length - 1]._id;
      return {
        notes,
        cursor: newCursor,
        hasNextPage,
      };
    },
  },
};
export default queryResolvers;
