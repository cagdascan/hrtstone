Decks = new Meteor.Collection('decks'); // collection for deck listing	


if (Meteor.isClient){

  Deps.autorun(function() { 
    decklist_query = function(){
      return {};
    }
    decklist_query = decklist_query();

    decklist_sort = function(){
	  if (Session.get('deck_sort') == 'top')
	    return 'upvotes_count';
	  else
		return 'timestamp';
    }
    decklist_sort = decklist_sort();

    Meteor.subscribe('decks', decklist_query, decklist_sort);
  });

}