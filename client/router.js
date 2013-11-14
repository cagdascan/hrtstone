Meteor.Router.add({
	'/'								: 'decks',
	'/deck/miracle-rouge'			: 'singledeck',
	'/build-deck'					: function(){
										Session.set('class', 'Druid');
										return 'builddeck';
 									}
});