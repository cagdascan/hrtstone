Template.header.helpers({
	avatar: function () {
		return Gravatar.imageUrl(Meteor.user().emails[0].address);
	}
});

