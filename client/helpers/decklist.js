Template.decklist.helpers({
	decks: function () {
		if (Session.get('selected_class') == 'All Classes'){
			if (Session.get('deck_sort') == 'top')
				return Decks.find({}, {sort:{upvotes_count: -1}, limit: Session.get('deck_limit')}).fetch();
			else if (Session.get('deck_sort') == 'latest')
				return Decks.find({}, {sort:{timestamp: -1}, limit: Session.get('deck_limit')}).fetch();
		}
		else{
			if (Session.get('deck_sort') == 'top')
				return Decks.find({'class': Session.get('selected_class')},
													{sort: {upvotes_count: -1}, limit: Session.get('deck_limit')}).fetch();
			else if (Session.get('deck_sort') == 'latest')
				return Decks.find({'class': Session.get('selected_class')},
													{sort: {timestamp: -1}, limit: Session.get('deck_limit')}).fetch();
		}
	},
	singledeck_url: function () {
		var deckname = URLify2(this.value.deckname) + '-' + this.value._id;
		return deckname;
	},
	voted: function () {
		if (Meteor.userId() == null)
			return ''
		else{
			if (Lists.find({_id: Meteor.userId(), 'upvotes': this.value._id}).fetch().length == 0)
				return '';
			else
				return 'voted';
		}
	}
});

Template.decklist.events({
	'click button#load_more': function () {
		Session.set('deck_limit', Session.get('deck_limit') + 10);
	},
	'click div.upvote': function (event) {
		if (Meteor.user() == null){ // if not signed in, direct user to signing in
			event.stopPropagation();
			$('a.dropdown-toggle').dropdown('toggle');
		}
		else{
			if (Lists.find({_id: Meteor.userId(), 'upvotes': this.value._id}).fetch().length == 0){ // if not voted
				Lists.update({'_id': Meteor.userId()}, {$push: {'upvotes': this.value._id}}); // vote up
				Meteor.call('upvote_count_updater', this.value._id, 'upvote');
			}
			else{ // if already voted 
				Lists.update({'_id': Meteor.userId()}, {$pull: {'upvotes': this.value._id}}); // vote down
				Meteor.call('upvote_count_updater', this.value._id, 'downvote');
			}
		}
	}
});


Handlebars.registerHelper('key_value', function(context, options) {
  var result = [];
  _.each(context, function(value, key, list){
    result.push({key:key+1, value:value});
  })
  return result;
});

Handlebars.registerHelper('capitalize_and_shorten', function(word) {
  word =  word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() 
  	+ txt.substr(1).toLowerCase();});

  if (word.length > 48){
			var deckname = word.slice(0,46) + ' ...';
			return deckname;
		}
		else
			return word;

});

