Template.singlecard.rendered = function () {
	if ( Cards.find().fetch()[0] != undefined) {
		Session.set('global_cardname', Cards.find().fetch()[0].name);
		Session.set('global_rarity', Cards.find().fetch()[0].rarity);
		Session.set('global_cardclass', Cards.find().fetch()[0].class);
		Session.set('global_cardcost', Cards.find().fetch()[0].cost);
		Session.set('global_cardhp', Cards.find().fetch()[0].hp_or_dur);
		Session.set('global_cardattack', Cards.find().fetch()[0].attack);
	}
};

Template.singlecard.helpers({
	card: function () {
		return Cards.find();
	},
	card_class: function () {
		if (this.class == '')
			return 'Neutral'
		else
			return this.class;
	}
});