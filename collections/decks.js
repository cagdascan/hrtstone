Decks = new Meteor.Collection('decks'); // collection for deck listing	


if (Meteor.isClient){

  Deps.autorun(function() {
    if (Meteor.Router.page() == 'decks'){
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
    }
    else if (Meteor.Router.page() == 'singledeck'){
      var decklist_query = {'_id': Session.get('singleDeck')};
      var limit = 1;
      var decklist_sort = {timestamp:1};
    }

    Meteor.subscribe('decks', decklist_query, decklist_sort, limit);
  });

}