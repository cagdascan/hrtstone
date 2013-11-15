Accounts.onCreateUser(function (options, user) {
  Lists.insert({'_id':user._id,'upvotes':[], 'comments': []});
  return user;
});