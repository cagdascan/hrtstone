//*** Cards publication ***///
Meteor.publish("cards01", function (card_query){
	return Cards.find(card_query, {sort: {'cost': 1}});
});

//*** Decks publication ***///
Meteor.publish("decks", function (decklist_query, deck_sort){
	return Decks.find(decklist_query, {sort:{deck_sort: -1}});
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
  remove: function(userid, doc){
    return false;
  }
});


