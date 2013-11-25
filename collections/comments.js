Comments = new Meteor.Collection('comments'); // collection for deck listing	

if (Meteor.isClient){

  Deps.autorun(function() {
    if (Meteor.Router.page() == 'singledeck'){
      deckid = function () {
        return Session.get('singleDeck');
      }
      deckid = deckid ();

      limit = function (){
        return 30; // comment limit per deck
      }
      limit = limit();
    }

    else{ 
      var limit = 0;
      var deckid = 'none';
    }

    Meteor.subscribe('comments', deckid, limit);
  });

}