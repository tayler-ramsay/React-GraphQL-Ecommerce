const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO check they are logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    //First take a copy of the updates
    const updates = { ...args };
    //remove the id from the item
    delete updates.id;
    //run the update method from our generated/prisma.graphql API
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    //find the item
    const item = await ctx.db.query.item({ where }, `{id title}`);
    //check if they own or have permissions
    //TODO
    //delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
