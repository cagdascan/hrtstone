Template.header.helpers({
	avatar: function () {
		if (Meteor.user().emails != undefined)
			return Gravatar.imageUrl(Meteor.user().emails[0].address);
	}
});

