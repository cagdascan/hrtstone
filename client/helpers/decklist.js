Template.decklist.helpers({
	decks: function () {
		if (Session.get('selected_class') == 'All Classes'){
			if (Session.get('deck_sort') == 'top')
				return Decks.find({}, {sort:{upvotes_count: -1}}).fetch();
			else if (Session.get('deck_sort') == 'latest')
				return Decks.find({}, {sort:{timestamp: -1}}).fetch();
		}
		else{
			if (Session.get('deck_sort') == 'top')
				return Decks.find({'class': Session.get('selected_class')},
													{sort: {upvotes_count: -1}}).fetch();
			else if (Session.get('deck_sort') == 'latest')
				return Decks.find({'class': Session.get('selected_class')},
													{sort: {timestamp: -1}}).fetch();
		}
	},
	order: function () {

		// var array = Decks.find().fetch();

		// var index = _.map(array, function(array, index){ return index; });

		// console.log(index);
		return 1;

	}
});