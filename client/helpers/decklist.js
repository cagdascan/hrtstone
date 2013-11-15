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
	}
});


Handlebars.registerHelper('key_value', function(context, options) {
  var result = [];
  _.each(context, function(value, key, list){
    result.push({key:key+1, value:value});
  })
  return result;
});

Handlebars.registerHelper('shorten', function(word) {
  if (word.length > 48){
			var deckname = word.slice(0,46) + ' ...';
			return deckname;
		}
		else
			return word;
});