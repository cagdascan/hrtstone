Template.header.rendered = function () {
	if (Meteor.Router.page() == 'decks') {
		$('nav li#decks').addClass('active');
	}
	var aim = $('#login-buttons-open-change-password');
	$(aim).parent().html('<a href="YAZARSIN HACI"class="btn btn-tome btn-block">Go to my decks</a><button class="btn btn-default btn-block" id="login-buttons-open-change-password">Change Password</button><button class="btn btn-block btn-primary" id="login-buttons-logout">Sign out</button>');
};