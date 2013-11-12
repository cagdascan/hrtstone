Meteor.publish("cards01", function (card_query){
	return Cards.find(card_query, {sort: {'cost': 1}});
});
