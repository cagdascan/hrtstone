Meteor.Router.add({
	'/'								 	 : 'decks',
	'/deck/miracle-rogue': 'singledeck',
	'/build-deck'				 : function(){
													Session.set('class', 'Druid');
													return 'builddeck';
 												},
 	'/decks/top'					 : function () {
 													Session.set('deck_sort', 'top');
 													return 'decks';
 												 },
 	'/decks/latest'				 : function () {
 													Session.set('deck_sort', 'latest');
 													return 'decks';
 												 }
});
