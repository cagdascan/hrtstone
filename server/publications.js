//*** Cards publication ***///
Meteor.publish("cards01", function (card_query){
	return Cards.find(card_query, {sort: {'cost': 1}});
});

//*** Decks publication ***///
Meteor.publish("decks", function (decklist_query, decklist_sort, limit){
	return Decks.find(decklist_query, {sort: decklist_sort, limit: limit});
});

//*** User list publication ***///
Meteor.publish("userlists", function (){
  return Lists.find({'_id': this.userId});
});

//*** Comments publication ***///
Meteor.publish("comments", function (deckid, limit){
  return Comments.find({'deckid': deckid}, {sort: {timestamp: -1}, limit: limit});
});

//** Server side methods ***///
Meteor.methods({
  upvote_count_updater: function (deckid, upvote){
    if (upvote == 'upvote'){
      Decks.update({'_id': deckid}, {$inc:{'upvotes_count': 1}});
    }
    else{
      Decks.update({'_id': deckid}, {$inc:{'upvotes_count': -1}});
    }
  }
});

//*** Decks allow deny rules ***///
Decks.allow({
  insert: function(userId, doc){
    if (doc.userid === userId &&
        doc.comments == false &&
        doc.upvotes == false &&
        doc.username == Meteor.users.findOne({_id: userId}).username &&
        (doc.timestamp instanceof Date) 
       )
      return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return false;
  },
  remove: function(userId, doc){
    return false;
  }
});

//*** Lists allow deny rules ***///
Lists.allow({
  insert: function(userId, doc){
      return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    if (doc._id === userId) 
      return true;
  },
  remove: function(userId, doc){
    return false;
  }
});

//*** Comments allow deny rules ***///
Comments.allow({
  insert: function(userId, doc){
    if (doc.userid === userId)
      return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return false
  },
  remove: function(userid, doc){
    return false;
  }
});
