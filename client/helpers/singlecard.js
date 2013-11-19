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