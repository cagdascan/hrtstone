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
	'click .decks-top .selectclass ul li a': function (x) {
		var x = x.currentTarget;
		var y = $(x).html();
		Session.set('selected_class', y);
		console.log(Session.get('selected_class'));
	},
	'click .decks-top .toplatest .btn-group .btn': function (x) {
		$('.decks-top .toplatest .btn-group .btn').removeClass('active');
		var x = x.currentTarget;
		var y = $(x).text();
		Session.set('toplatest', y);
		$(x).addClass('active');
		console.log(Session.get('toplatest'));
	}
});