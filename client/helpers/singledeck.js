Template.singledeck.helpers({
	deck: function () {
		return Decks.find().fetch(); 
	},
	singledeck_url: function () {
		var deckname = URLify2(this.value.deckname) + '-' + this.value._id;
		return deckname;
	},
	current_userpicture: function () {
		var email = Meteor.users.findOne().emails[0].address;
		return Gravatar.imageUrl(email);
	},
	comments: function () {
		return Comments.find({}, {sort:{timestamp: -1}}).fetch();
	},
	disabled: function () {
		if (Session.get('current_comment') == '')
			return 'disabled';
		else
			return '';
	},
	legendary: function () {
		if (this.rarity == 'legendary')
			return true;
		else
			return false;
	},
	more_than_one: function () {
		if (this.count == 2)
			return true;
		else
			return false;
	}
});


Template.singledeck.events({
	'click #send_comment': function () {

		var gravatar_url = Gravatar.imageUrl(Meteor.user().emails[0].address);
		var comment = $('#comment_area').val();

		Comments.insert({'userid'      : Meteor.userId(),
										 'username'    : Meteor.user().username,
										 'userpicture' : gravatar_url,
										 'deckid'			 : Session.get('singleDeck'),
                     'comment'     : comment, 
                     'timestamp'   : new Date(), 
                   });
		$('#comment_area').val('');
		Session.set('current_comment', '');
	},
	'keyup #comment_area': function () {
		var comment = $('#comment_area').val();
		Session.set('current_comment', comment);
	},
	'click div.upvote': function () {
		if (Meteor.user() == null){ // if not signed in, direct user to signing in
			event.stopPropagation();
			$('a.dropdown-toggle').dropdown('toggle');
		}
		else{
			if (Lists.find({_id: Meteor.userId(), 'upvotes': this._id}).fetch().length == 0){ // if not voted
				Lists.update({'_id': Meteor.userId()}, {$push: {'upvotes': this._id}}); // vote up
				Meteor.call('upvote_count_updater', this._id, 'upvote');
			}
			else{ // if already voted 
				Lists.update({'_id': Meteor.userId()}, {$pull: {'upvotes': this._id}}); // vote down
				Meteor.call('upvote_count_updater', this._id, 'downvote');
			}
		}
	}
});