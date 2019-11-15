const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
 items: forwardTo('db'),
 item: forwardTo('db'),
 itemsConnection: forwardTo('db'),
 me(parent, args, ctx, info) {
  // check if there is a current user ID
  if (!ctx.request.userId) {
   return null;
  }
  return ctx.db.query.user(
   {
    where: { id: ctx.request.userId }
   },
   info
  );
 },
 async users(parent, args, ctx, info) {
  //check is the user logged in
  if (!ctx.request.userId) {
   throw new Error('You must be logged in');
  }
  //check if the user has permission to query all the users
  hasPermission(ctx.request.user, [
   'ADMIN',
   'PERMISSIONUPDATE'
  ]);
  //if they so, query all the users
  return ctx.db.query.users({}, info);
 },
 async order(parent, args, ctx, info) {
  // Make sure logged in
  if (!ctx.request.userId) {
   throw new Error('You are not logged in');
  }
  // Query the current order
  const order = await ctx.db.query.order(
   {
    where: { id: args.id }
   },
   info
  );
  // Check if they have the permissions to see this order
  const ownsOrder = order.user.id === ctx.request.userId;
  const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
   'ADMIN'
  );
  if (!ownsOrder || !hasPermission) {
   throw new Error("You can't see this Budd");
  }
  // Return order
  return order;
 },
 async orders(parent, args, ctx, info) {
  //Get user id
  const { userId } = ctx.request;
  //Check if they are logged in
  if (!userId) {
   throw new Error('You must be logged in');
  }
  //Return orders
  return ctx.db.query.orders(
   {
    where: { user: { id: userId } }
   },
   info
  );
 }
};

module.exports = Query;
