Template.decklist.helpers({
	decks: function () {
		if (Session.get('selected_class') == 'All Classes')
			return Decks.find({}, {sort:{timestamp:-1}}).fetch();
		else
			return Decks.find({'class': Session.get('selected_class')}).fetch();
	},
	upvote_count: function () {
		return Decks.findOne({'_id': this._id}).upvotes.length;
	},
	comment_count: function () {
		return Decks.findOne({'_id': this._id}).comments.length;
	}
});