	Meteor.publish("cards01", function(){
		return Cards.find({'rarity': 'common'});
	});