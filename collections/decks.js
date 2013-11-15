Decks = new Meteor.Collection('decks'); // collection for deck listing	


if (Meteor.isClient){

  Deps.autorun(function() { 
    decklist_query = function(){
      if (Session.get('selected_class') == 'All Classes')
        return {};
      else
        return {'class': Session.get('selected_class')};
    }
    decklist_query = decklist_query();

    limit = function (){
      return Session.get('deck_limit');
    }
    limit = limit();

    decklist_sort = function(){
  	  if (Session.get('deck_sort') == 'top'){
        var sort_order = {};
        sort_order["upvotes_count"] = -1;
  	    return sort_order;
      }
  	  else{
  		  var sort_order = {};
        sort_order["timestamp"] = -1;
        return sort_order;
      }
    }
    decklist_sort = decklist_sort();

    Meteor.subscribe('decks', decklist_query, decklist_sort, limit);
  });

}