Template.decks.rendered = function () {
	if (Session.get('selected_class') === undefined) {
		Session.set('selected_class','All Classes')
	}
	if (Session.get('toplatest') === undefined) {
		Session.set('toplatest','Top');
	}
};

Template.decks.selected_class = function () {
	return Session.get('selected_class');
};

Template.decks.events({
	'click .decks-top .selectclass ul li a': function (event) {
		Session.set('selected_class', $(event.currentTarget).text());
	},
	'click .decks-top .toplatest .btn-group .btn': function (event) {
		$('.decks-top .toplatest .btn-group .btn').removeClass('active');
		Session.set('toplatest', $(event.currentTarget).text());
		$(event.currentTarget).addClass('active');
	}
});