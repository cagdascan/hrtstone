Meteor.Router.add({
  '/'									 : 'decks',
  '/deck/miracle-rogue': 'singledeck',
  '/build-deck/druid'				 : function(){
														Session.set('class', 'Druid');
														return 'builddeck';
 												 }
});
