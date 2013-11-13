Meteor.Router.add({
  '/'									 : 'decks',
  '/deck/miracle-rogue': 'singledeck',
  '/build-deck'				 : function(){
														Session.set('class', 'Druid');
														return 'builddeck';
 												 }
});
