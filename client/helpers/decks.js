Template.decks.selected_class = function () {
	return Session.get('selected_class');
};

Template.decks.events({
	'click .decks-top .selectclass ul li a': function (event) {
		Session.set('selected_class', $(event.currentTarget).text());
	}
});

Template.decks.helpers({
	top_active: function () {
		if (Session.get('deck_sort') == 'top')
			return 'active';
		else
			return '';
	},
	latest_active: function () {
		if (Session.get('deck_sort') == 'latest')
			return 'active';
		else
			return '';
	}
});