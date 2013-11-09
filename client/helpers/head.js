Template.head.rendered = function () {
	if (Meteor.Router.page() == 'decks') {
		$('nav li#decks').addClass('active');
	}
};