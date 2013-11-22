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
	},
	user_deck_sub: function () {
		if (Session.get('user_deck_sub') == true)
			return true;
		else
			return false;
	},
	user_deck_sub_name: function () {
		if (Decks.find().count() != 0)
			return Decks.find().fetch()[0].username;
	},
	user_deck_sub_avatar: function () {
		if (Decks.find().count() != 0)
			return Decks.find().fetch()[0].userpicture;
	},
	selected_class: function () {
		return Session.get('selected_class');
	}
});