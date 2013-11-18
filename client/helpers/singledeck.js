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
	current_username: function () {
		return Meteor.users.findOne().username
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
	},
	mana_count: function (mana) {
		var mana = mana;
		var total = 0;
		var decklist = Decks.find().fetch()[0].decklist;
		if (mana != '7'){
			decklist.forEach(function(i){
				if (i.cost == mana)
					total = total  + i.count;
			});
		}
		else
			decklist.forEach(function(i){
				if (i.cost == '7'  || i.cost == '8'  ||
						i.cost == '9'  || i.cost == '10' ||
						i.cost == '12' || i.cost == '20'
					 )
					total = total  + i.count;
			});

		return total;
	},
	height: function (mana) {
		var mana = mana;
		var heigth = 0;
		var total_0 = 0;
		var total_1 = 0;
		var total_2 = 0;
		var total_3 = 0;
		var total_4 = 0;
		var total_5 = 0;
		var total_6 = 0;
		var total_7 = 0;
		var max = 0;
		var decklist = Decks.find().fetch()[0].decklist;

		decklist.forEach(function(i){
			if (i.cost == "0")
				total_0 = total_0 + i.count;
			else if (i.cost == "1")
				total_1 = total_1 + i.count;
			else if (i.cost == "2")
				total_2 = total_2 + i.count;
			else if (i.cost == "3")
				total_3 = total_3 + i.count;
			else if (i.cost == "4")
				total_4 = total_4 + i.count;
			else if (i.cost == "5")
				total_5 = total_5 + i.count;
			else if (i.cost == "6")
				total_6 = total_6 + i.count;
			else if (i.cost == "7"  || i.cost == "8"  || i.cost == "9" ||
							 i.cost == "10" || i.cost == "12" || i.cost == "20")
				total_7 = total_7 + i.count;
		});

		var total_array = [total_0, total_1, total_2, total_3, total_4, total_5, total_6, total_7];

		max = _.max(total_array);

		if (mana == "0")
			if (total_0 == max)
				return 80;
			else 
				return Math.ceil(total_0 / max * 100);
		else if (mana == "1")
			if (total_1 == max)
				return 80;
			else 
				return Math.ceil(total_1 / max * 100);
		else if (mana == "2")
			if (total_2 == max)
				return 80;
			else 
				return Math.ceil(total_2 / max * 100);
		else if (mana == "3")
			if (total_3 == max)
				return 80;
			else 
				return Math.ceil(total_3 / max * 100);
		else if (mana == "4")
			if (total_4 == max)
				return 80;
			else 
				return Math.ceil(total_4 / max * 100);
		else if (mana == "5")
			if (total_5 == max)
				return 80;
			else 
				return Math.ceil(total_5 / max * 100);
		else if (mana == "6")
			if (total_6 == max)
				return 80;
			else 
				return Math.ceil(total_6 / max * 100);
		else if (mana == "7")
			if (total_7 == max)
				return 80;
			else 
				return Math.ceil(total_7 / max * 100);
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